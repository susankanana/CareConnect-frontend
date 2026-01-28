import React, { useState } from 'react';
import { appointmentsAPI } from '../../../../../reducers/appointments/appointmentsAPI';
import { usersAPI } from '../../../../../reducers/users/usersAPI';
import { doctorsAPI } from '../../../../../reducers/doctors/doctorsAPI';
import { prescriptionsAPI } from '../../../../../reducers/prescriptions/prescriptionsAPI';
import { toast } from 'sonner';
import { Download, BarChart3, X, Loader, CheckCircle } from 'lucide-react';

interface SystemReportProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSystemReport: React.FC<SystemReportProps> = ({ isOpen, onClose }) => {
  const [reportType, setReportType] = useState<'monthly' | 'quarterly' | 'yearly' | 'comprehensive'>('monthly');
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch all system data
  const { data: appointmentsData } = appointmentsAPI.useGetDetailedAppointmentsQuery();
  const { data: usersData } = usersAPI.useGetUsersQuery();
  const { data: doctorsData } = doctorsAPI.useGetDoctorsQuery();
  const { data: prescriptionsData } = prescriptionsAPI.useGetPrescriptionsQuery();

  const generateSystemReport = async () => {
    if (!appointmentsData?.data || !usersData || !doctorsData?.data) {
      toast.error('System data not available for report generation');
      return;
    }

    setIsGenerating(true);

    try {
      const appointments = appointmentsData.data;
      const users = usersData;
      const doctors = doctorsData.data;
      const prescriptions = prescriptionsData?.data || [];

      // Calculate system metrics
      const totalRevenue = appointments.reduce((sum, apt) => sum + parseFloat(apt.totalAmount), 0);
      const totalUsers = users.length;
      const totalDoctors = doctors.length;
      const totalAppointments = appointments.length;
      const totalPrescriptions = prescriptions.length;

      const appointmentsByStatus = {
        confirmed: appointments.filter((apt) => apt.status === 'Confirmed').length,
        pending: appointments.filter((apt) => apt.status === 'Pending').length,
        cancelled: appointments.filter((apt) => apt.status === 'Cancelled').length,
      };

      // Top performing doctors
      const doctorPerformance = doctors
        .map((doctor) => {
          const doctorAppointments = appointments.filter(
            (apt) => apt.doctor?.id === doctor.user.userId
          );
          const revenue = doctorAppointments.reduce(
            (sum, apt) => sum + parseFloat(apt.totalAmount),
            0
          );
          return {
            name: `Dr. ${doctor.user.firstName} ${doctor.user.lastName}`,
            specialization: doctor.doctor.specialization,
            appointments: doctorAppointments.length,
            revenue,
          };
        })
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);

      // Premium HTML Template
      const reportHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>CareConnect | Intelligence Report</title>
          <style>
            :root {
              --primary: #003d3d;
              --accent: #00a18e;
              --bg: #ffffff;
              --muted: #f4f7f7;
              --border: #e2e8f0;
            }
            body { 
              font-family: 'Inter', -apple-system, sans-serif; 
              margin: 0; padding: 0; color: var(--primary); background: var(--muted); 
            }
            .page { 
              max-width: 1000px; margin: 40px auto; background: var(--bg); 
              box-shadow: 0 40px 100px -20px rgba(0,61,61,0.1); padding: 60px;
              border-radius: 8px;
            }
            .header { 
              border-bottom: 8px solid var(--primary); padding-bottom: 40px; margin-bottom: 50px;
              display: flex; justify-content: space-between; align-items: flex-end;
            }
            .logo { font-size: 28px; font-weight: 900; letter-spacing: -1px; }
            .logo span { color: var(--accent); }
            h1 { font-size: 44px; margin: 10px 0; font-weight: 900; text-transform: lowercase; }
            
            .summary { 
              background: var(--primary); color: white; padding: 40px; 
              border-radius: 24px; margin: 40px 0;
            }
            .summary h3 { color: var(--accent); margin-top: 0; text-transform: lowercase; }
            
            .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 40px 0; }
            .card { background: var(--muted); padding: 30px; border-radius: 16px; border: 1px solid var(--border); }
            .card-val { font-size: 28px; font-weight: 900; margin-bottom: 5px; }
            .card-lab { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: var(--accent); }

            table { width: 100%; border-collapse: collapse; margin: 30px 0; }
            th { text-align: left; font-size: 12px; text-transform: lowercase; color: var(--accent); padding: 15px; border-bottom: 2px solid var(--primary); }
            td { padding: 15px; font-size: 14px; border-bottom: 1px solid var(--border); }
            
            .footer { 
              margin-top: 60px; padding-top: 30px; border-top: 1px solid var(--border);
              font-size: 12px; color: #64748b; text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="page">
            <div class="header">
              <div>
                <div class="logo">CareConnect<span>.</span></div>
                <h1>system intelligence</h1>
              </div>
              <div style="text-align: right">
                <div style="font-size: 12px; color: var(--accent); font-weight: 700;">ISSUED</div>
                <div style="font-weight: 900;">${new Date().toLocaleDateString('en-GB')}</div>
              </div>
            </div>

            <div class="summary">
              <h3>executive oversight</h3>
              <p>The system has processed <strong>${totalAppointments.toLocaleString()}</strong> interactions with a 
              <strong>${((appointmentsByStatus.confirmed / Math.max(totalAppointments, 1)) * 100).toFixed(1)}%</strong> success rate. 
              Total revenue generated: <strong>KSh ${totalRevenue.toLocaleString()}</strong>.</p>
            </div>

            <div class="grid">
              <div class="card"><div class="card-val">${totalUsers}</div><div class="card-lab">total entities</div></div>
              <div class="card"><div class="card-val">${totalDoctors}</div><div class="card-lab">medical staff</div></div>
              <div class="card"><div class="card-val">${totalPrescriptions}</div><div class="card-lab">prescriptions</div></div>
            </div>

            <h3>provider performance</h3>
            <table>
              <thead>
                <tr><th>rank</th><th>provider</th><th>specialization</th><th>revenue</th></tr>
              </thead>
              <tbody>
                ${doctorPerformance.map((doc, i) => `
                  <tr>
                    <td>#0${i + 1}</td>
                    <td>${doc.name}</td>
                    <td>${doc.specialization}</td>
                    <td>KSh ${doc.revenue.toLocaleString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="footer">
              careconnect administration &bull; system analytics report &bull; ${new Date().getFullYear()}
            </div>
          </div>
        </body>
        </html>
      `;

      const blob = new Blob([reportHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `careconnect_report_${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('System report generated successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100">
        <div className="bg-[#003d3d] p-8 text-white relative">
          <button onClick={onClose} className="absolute top-6 right-6 hover:rotate-90 transition-transform">
            <X className="h-5 w-5" />
          </button>
          <BarChart3 className="h-10 w-10 mb-4 text-[#00a18e]" />
          <h2 className="text-2xl font-bold">system intelligence</h2>
          <p className="text-teal-100/70 text-sm">generate clinical & financial audits</p>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-2 gap-3">
            {['monthly', 'quarterly', 'yearly', 'comprehensive'].map((type) => (
              <button
                key={type}
                onClick={() => setReportType(type as any)}
                className={`py-3 px-4 rounded-xl text-sm font-medium border-2 transition-all ${
                  reportType === type 
                    ? 'border-[#003d3d] bg-[#f4f7f7] text-[#003d3d]' 
                    : 'border-gray-100 text-gray-400 hover:border-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-[#00a18e]" />
              <span>revenue & medical staff analytics</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-[#00a18e]" />
              <span>patient interaction distribution</span>
            </div>
          </div>

          <button
            onClick={generateSystemReport}
            disabled={isGenerating}
            className="w-full bg-[#00a18e] hover:bg-[#008f7e] text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isGenerating ? <Loader className="animate-spin h-5 w-5" /> : <Download className="h-5 w-5" />}
            {isGenerating ? 'processing data...' : 'generate intelligence report'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSystemReport;