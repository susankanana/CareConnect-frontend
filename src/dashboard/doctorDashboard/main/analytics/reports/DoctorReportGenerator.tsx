import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../../app/store';
import { appointmentsAPI } from '../../../../../reducers/appointments/appointmentsAPI';
import { toast } from 'sonner';
import { FileText, Download, X, Loader, CheckCircle } from 'lucide-react';

interface ReportGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
}

const DoctorReportGenerator: React.FC<ReportGeneratorProps> = ({ isOpen, onClose }) => {
  const [reportType, setReportType] = useState<'monthly' | 'quarterly' | 'yearly' | 'custom'>('monthly');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const user = useSelector((state: RootState) => state.user.user);
  const doctorId = user?.user_id;

  const { data: appointmentsData } = appointmentsAPI.useGetAppointmentsByDoctorIdQuery(
    doctorId ?? 0,
    { skip: !doctorId }
  );

  const handleReportTypeChange = (type: 'monthly' | 'quarterly' | 'yearly' | 'custom') => {
    setReportType(type);
    const now = new Date();
    switch (type) {
      case 'monthly':
        setDateRange({
          startDate: new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0],
          endDate: now.toISOString().split('T')[0],
        });
        break;
      case 'quarterly':
        const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        setDateRange({
          startDate: quarterStart.toISOString().split('T')[0],
          endDate: now.toISOString().split('T')[0],
        });
        break;
      case 'yearly':
        setDateRange({
          startDate: new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0],
          endDate: now.toISOString().split('T')[0],
        });
        break;
    }
  };

  const generateReport = async () => {
    if (!appointmentsData?.data || !user) {
      toast.error('practice data not available');
      return;
    }

    setIsGenerating(true);
    try {
      const filteredAppointments = appointmentsData.data.filter((apt) => {
        const aptDate = new Date(apt.appointmentDate);
        return aptDate >= new Date(dateRange.startDate) && aptDate <= new Date(dateRange.endDate);
      });

      const totalRevenue = filteredAppointments.reduce((sum, apt) => sum + parseFloat(apt.totalAmount), 0);
      const totalPatients = new Set(filteredAppointments.map((apt) => apt.patient.id)).size;

      const reportHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Inter', sans-serif; color: #003d3d; margin: 0; padding: 40px; background: #f4f7f7; }
            .sheet { background: white; max-width: 800px; margin: 0 auto; padding: 50px; border-radius: 4px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
            .header { border-bottom: 4px solid #003d3d; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
            .title { font-size: 24px; font-weight: 900; letter-spacing: -1px; }
            .accent { color: #00a18e; }
            .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 30px 0; }
            .stat-card { background: #f4f7f7; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; }
            .stat-val { font-size: 20px; font-weight: 800; }
            .stat-label { font-size: 10px; text-transform: uppercase; color: #00a18e; letter-spacing: 1px; }
            table { width: 100%; border-collapse: collapse; }
            th { text-align: left; font-size: 11px; text-transform: uppercase; padding: 12px; border-bottom: 2px solid #003d3d; color: #00a18e; }
            td { padding: 12px; font-size: 13px; border-bottom: 1px solid #e2e8f0; }
            .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; }
          </style>
        </head>
        <body>
          <div class="sheet">
            <div class="header">
              <div><div class="title">practice<span class="accent">.</span>report</div></div>
              <div style="text-align: right; font-size: 12px;">${dateRange.startDate} — ${dateRange.endDate}</div>
            </div>
            <p><strong>physician:</strong> dr. ${user.first_name} ${user.last_name}</p>
            <div class="stats-grid">
              <div class="stat-card"><div class="stat-val">${filteredAppointments.length}</div><div class="stat-label">total cases</div></div>
              <div class="stat-card"><div class="stat-val">${totalPatients}</div><div class="stat-label">unique patients</div></div>
              <div class="stat-card"><div class="stat-val">KSh ${totalRevenue.toLocaleString()}</div><div class="stat-label">revenue</div></div>
            </div>
            <table>
              <thead><tr><th>date</th><th>patient</th><th>status</th><th>amount</th></tr></thead>
              <tbody>
                ${filteredAppointments.slice(0, 15).map(apt => `
                  <tr>
                    <td>${new Date(apt.appointmentDate).toLocaleDateString()}</td>
                    <td>${apt.patient.name} ${apt.patient.lastName}</td>
                    <td>${apt.status.toLowerCase()}</td>
                    <td>${parseFloat(apt.totalAmount).toLocaleString()}</td>
                  </tr>`).join('')}
              </tbody>
            </table>
            <div class="footer">generated via careconnect physician portal. confidential medical record.</div>
          </div>
        </body>
        </html>
      `;

      const blob = new Blob([reportHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `practice_report_${dateRange.startDate}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('practice report downloaded');
      onClose();
    } catch (error) {
      toast.error('generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#003d3d]/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-gray-100">
        <div className="bg-[#003d3d] p-8 text-white relative">
          <button onClick={onClose} className="absolute top-6 right-6 hover:opacity-70 transition-opacity">
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[#00a18e] p-2 rounded-lg">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold lowercase">practice analytics</h2>
          </div>
          <p className="text-teal-100/60 text-xs">generate performance and revenue insights</p>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-2">
            {['monthly', 'quarterly', 'yearly', 'custom'].map((type) => (
              <button
                key={type}
                onClick={() => handleReportTypeChange(type as any)}
                className={`py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all border-2 ${
                  reportType === type ? 'border-[#003d3d] bg-[#f4f7f7] text-[#003d3d]' : 'border-gray-50 text-gray-400'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">start date</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange((prev) => ({ ...prev, startDate: e.target.value }))}
                className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#00a18e]"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">end date</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange((prev) => ({ ...prev, endDate: e.target.value }))}
                className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#00a18e]"
              />
            </div>
          </div>

          <div className="p-4 bg-[#f4f7f7] rounded-2xl border border-gray-100">
            <h4 className="text-[10px] uppercase font-extrabold text-[#00a18e] mb-3 tracking-widest">data inclusion</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-600 font-medium lowercase">
                <CheckCircle className="h-3.5 w-3.5 text-[#00a18e]" /> clinical activity summary
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600 font-medium lowercase">
                <CheckCircle className="h-3.5 w-3.5 text-[#00a18e]" /> revenue and billing audit
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-gray-600 transition-colors"
            >
              cancel
            </button>
            <button
              onClick={generateReport}
              disabled={isGenerating}
              className="flex-2 bg-[#00a18e] text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#008f7e] transition-all disabled:opacity-50"
            >
              {isGenerating ? <Loader className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              {isGenerating ? 'generating' : 'export report'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorReportGenerator;