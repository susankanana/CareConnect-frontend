import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../../app/store';
import { appointmentsAPI } from '../../../../../reducers/appointments/appointmentsAPI';
import { prescriptionsAPI } from '../../../../../reducers/prescriptions/prescriptionsAPI';
import { toast } from 'sonner';
import { Download, Heart, X, Loader, CheckCircle } from 'lucide-react';

interface HealthReportProps {
  isOpen: boolean;
  onClose: () => void;
}

const PatientHealthReport: React.FC<HealthReportProps> = ({ isOpen, onClose }) => {
  const [reportType, setReportType] = useState<'summary' | 'detailed'>('summary');
  const [isGenerating, setIsGenerating] = useState(false);

  const user = useSelector((state: RootState) => state.user.user);
  const userId = user?.user_id;

  const { data: appointmentsData } = appointmentsAPI.useGetAppointmentsByUserIdQuery(userId ?? 0, {
    skip: !userId,
  });
  const { data: prescriptionsData } = prescriptionsAPI.useGetPrescriptionsByPatientIdQuery(
    userId ?? 0,
    { skip: !userId }
  );

  const generateHealthReport = async () => {
    if (!appointmentsData?.data || !user) {
      toast.error('health data not available');
      return;
    }

    setIsGenerating(true);
    try {
      const appointments = appointmentsData.data;
      const prescriptions = prescriptionsData?.data || [];
      const totalSpent = appointments.reduce((sum, apt) => sum + parseFloat(apt.totalAmount), 0);
      const engagementScore = ((appointments.filter(a => a.status === 'Confirmed').length / Math.max(appointments.length, 1)) * 100).toFixed(0);

      const reportHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Inter', sans-serif; color: #003d3d; margin: 0; padding: 40px; background: #f4f7f7; }
            .sheet { background: white; max-width: 800px; margin: 0 auto; padding: 50px; border-radius: 4px; }
            .header { border-bottom: 4px solid #003d3d; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
            .title { font-size: 24px; font-weight: 900; letter-spacing: -1px; }
            .accent { color: #00a18e; }
            .score-box { background: #003d3d; color: white; padding: 30px; border-radius: 20px; text-align: center; margin: 20px 0; }
            .metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 30px; }
            .metric-card { background: #f4f7f7; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0; text-align: center; }
            .m-val { font-size: 18px; font-weight: 800; display: block; }
            .m-lbl { font-size: 9px; text-transform: uppercase; color: #00a18e; letter-spacing: 1px; }
            table { width: 100%; border-collapse: collapse; margin-top: 30px; }
            th { text-align: left; font-size: 10px; text-transform: uppercase; padding: 12px; border-bottom: 2px solid #003d3d; color: #00a18e; }
            td { padding: 12px; font-size: 12px; border-bottom: 1px solid #e2e8f0; }
            .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center; }
          </style>
        </head>
        <body>
          <div class="sheet">
            <div class="header">
              <div class="title">health<span class="accent">.</span>journey</div>
              <div style="font-size: 12px; opacity: 0.6;">generated: ${new Date().toLocaleDateString()}</div>
            </div>
            <div style="margin-bottom: 20px;">
              <span style="font-size: 12px; text-transform: uppercase; color: #94a3b8;">patient record</span>
              <div style="font-size: 20px; font-weight: 700;">${user.first_name} ${user.last_name}</div>
            </div>
            <div class="score-box">
              <div style="font-size: 48px; font-weight: 900;">${engagementScore}%</div>
              <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; opacity: 0.8;">engagement score</div>
            </div>
            <div class="metrics">
              <div class="metric-card"><span class="m-val">${appointments.length}</span><span class="m-lbl">visits</span></div>
              <div class="metric-card"><span class="m-val">KSh ${totalSpent.toLocaleString()}</span><span class="m-lbl">investment</span></div>
              <div class="metric-card"><span class="m-val">${prescriptions.length}</span><span class="m-lbl">meds</span></div>
              <div class="metric-card"><span class="m-val">${new Set(appointments.map(a => a.doctor.id)).size}</span><span class="m-lbl">physicians</span></div>
            </div>
            <table>
              <thead><tr><th>date</th><th>provider</th><th>department</th><th>status</th></tr></thead>
              <tbody>
                ${appointments.slice(0, 10).map(apt => `
                  <tr>
                    <td>${new Date(apt.appointmentDate).toLocaleDateString()}</td>
                    <td>dr. ${apt.doctor.lastName}</td>
                    <td>${apt.doctor.specialization.toLowerCase()}</td>
                    <td>${apt.status.toLowerCase()}</td>
                  </tr>`).join('')}
              </tbody>
            </table>
            <div class="footer">careconnect medical group — confidential patient document</div>
          </div>
        </body>
        </html>
      `;

      const blob = new Blob([reportHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `health_report_${user.last_name.toLowerCase()}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('health report downloaded');
      onClose();
    } catch (error) {
      toast.error('failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#003d3d]/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100">
        <div className="bg-[#003d3d] p-8 text-white relative">
          <button onClick={onClose} className="absolute top-6 right-6 hover:opacity-70 transition-opacity">
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[#00a18e] p-2 rounded-lg">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold lowercase">health record export</h2>
          </div>
          <p className="text-teal-100/60 text-xs">summary of your medical history and wellness metrics</p>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'summary', label: 'summary' },
              { id: 'detailed', label: 'detailed' }
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setReportType(type.id as any)}
                className={`py-3 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all border-2 ${
                  reportType === type.id ? 'border-[#003d3d] bg-[#f4f7f7] text-[#003d3d]' : 'border-gray-50 text-gray-400'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          <div className="bg-[#f4f7f7] rounded-2xl p-5 border border-gray-100">
            <h4 className="text-[10px] uppercase font-extrabold text-[#00a18e] mb-4 tracking-widest">report contents</h4>
            <div className="grid grid-cols-1 gap-3">
              {[
                'visit history summary',
                'healthcare investment audit',
                'prescription records',
                'engagement performance'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-gray-600 font-medium lowercase">
                  <CheckCircle className="h-3.5 w-3.5 text-[#00a18e]" /> {item}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-2 items-center">
            <button
              onClick={onClose}
              className="flex-1 text-gray-400 text-[10px] font-bold uppercase tracking-widest hover:text-gray-600"
            >
              dismiss
            </button>
            <button
              onClick={generateHealthReport}
              disabled={isGenerating}
              className="flex-2 bg-[#00a18e] text-white py-4 rounded-2xl font-bold text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#008f7e] transition-all disabled:opacity-50"
            >
              {isGenerating ? <Loader className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              {isGenerating ? 'processing' : 'generate report'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientHealthReport;