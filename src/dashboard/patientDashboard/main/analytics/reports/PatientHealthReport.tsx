import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../../app/store';
import { appointmentsAPI } from '../../../../../reducers/appointments/appointmentsAPI';
import { prescriptionsAPI } from '../../../../../reducers/prescriptions/prescriptionsAPI';
import { complaintsAPI } from '../../../../../reducers/complaints/complaintsAPI';
import { toast } from 'sonner';
import {
  Download,
  Heart,
  X,
  Loader,
  CheckCircle
} from 'lucide-react';

interface HealthReportProps {
  isOpen: boolean;
  onClose: () => void;
}

const PatientHealthReport: React.FC<HealthReportProps> = ({ isOpen, onClose }) => {
  const [reportType, setReportType] = useState<'summary' | 'detailed'>('summary');
  const [isGenerating, setIsGenerating] = useState(false);

  const user = useSelector((state: RootState) => state.user.user);
  const userId = user?.user_id;

  const { data: appointmentsData } = appointmentsAPI.useGetAppointmentsByUserIdQuery(
    userId ?? 0,
    { skip: !userId }
  );
  const { data: prescriptionsData } = prescriptionsAPI.useGetPrescriptionsByPatientIdQuery(
    userId ?? 0,
    { skip: !userId }
  );
  const { data: complaintsData } = complaintsAPI.useGetComplaintsByUserIdQuery(
    userId ?? 0,
    { skip: !userId }
  );

  const generateHealthReport = async () => {
    if (!appointmentsData?.data || !user) {
      toast.error("No health data available for report generation");
      return;
    }

    setIsGenerating(true);

    try {
      const appointments = appointmentsData.data;
      const prescriptions = prescriptionsData?.data || [];
      const complaints = complaintsData?.data || [];

      // Calculate health metrics
      const totalSpent = appointments.reduce((sum, apt) => sum + parseFloat(apt.totalAmount), 0);
      const totalAppointments = appointments.length;
      const uniqueDoctors = new Set(appointments.map(apt => apt.doctor.id)).size;
      const specializations = [...new Set(appointments.map(apt => apt.doctor.specialization))];

      const appointmentsByStatus = {
        confirmed: appointments.filter(apt => apt.status === 'Confirmed').length,
        pending: appointments.filter(apt => apt.status === 'Pending').length,
        cancelled: appointments.filter(apt => apt.status === 'Cancelled').length
      };

      const complaintsByStatus = {
        open: complaints.filter(c => c.status === 'Open').length,
        inProgress: complaints.filter(c => c.status === 'In Progress').length,
        resolved: complaints.filter(c => c.status === 'Resolved').length,
        closed: complaints.filter(c => c.status === 'Closed').length
      };

      // Generate HTML report
      const reportHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>CareConnect - Personal Health Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; color: #333; line-height: 1.6; }
            .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #14B8A6; padding-bottom: 20px; }
            .logo { color: #14B8A6; font-size: 24px; font-weight: bold; margin-bottom: 10px; }
            .report-title { font-size: 28px; font-weight: bold; margin: 10px 0; }
            .patient-info { background: #f0fdfa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0; }
            .metric-card { background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
            .metric-value { font-size: 32px; font-weight: bold; color: #14B8A6; }
            .metric-label { color: #666; font-size: 14px; margin-top: 5px; }
            .section { margin: 30px 0; }
            .section-title { font-size: 20px; font-weight: bold; margin-bottom: 15px; color: #14B8A6; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
            .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .table th, .table td { border: 1px solid #e5e7eb; padding: 12px; text-align: left; }
            .table th { background: #f9fafb; font-weight: bold; }
            .footer { margin-top: 50px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #e5e7eb; padding-top: 20px; }
            .status-confirmed { color: #059669; font-weight: bold; }
            .status-pending { color: #d97706; font-weight: bold; }
            .status-cancelled { color: #dc2626; font-weight: bold; }
            .health-score { background: linear-gradient(135deg, #14B8A6, #EC4899); color: white; padding: 20px; border-radius: 12px; text-align: center; margin: 20px 0; }
            .health-score-value { font-size: 48px; font-weight: bold; }
            .specialization-list { display: flex; flex-wrap: wrap; gap: 10px; margin: 10px 0; }
            .specialization-tag { background: #e0f2fe; color: #0369a1; padding: 5px 12px; border-radius: 20px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">CareConnect Hospital</div>
            <div class="report-title">Personal Health Report</div>
            <div style="color: #666; font-size: 16px;">Comprehensive Health Journey Summary</div>
          </div>

          <div class="patient-info">
            <h3>Patient Information</h3>
            <p><strong>Name:</strong> ${user.first_name} ${user.last_name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Report Generated:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <div class="health-score">
            <div class="health-score-value">${((appointmentsByStatus.confirmed / Math.max(totalAppointments, 1)) * 100).toFixed(0)}%</div>
            <div style="font-size: 18px; margin-top: 10px;">Health Engagement Score</div>
            <div style="font-size: 14px; opacity: 0.9;">Based on appointment completion rate</div>
          </div>

          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-value">${totalAppointments}</div>
              <div class="metric-label">Total Appointments</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">KSh ${totalSpent.toLocaleString()}</div>
              <div class="metric-label">Healthcare Investment</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">${uniqueDoctors}</div>
              <div class="metric-label">Doctors Consulted</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">${prescriptions.length}</div>
              <div class="metric-label">Prescriptions Received</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Medical Specializations Visited</div>
            <div class="specialization-list">
              ${specializations.map(spec => `<span class="specialization-tag">${spec}</span>`).join('')}
            </div>
            <p style="margin-top: 15px; color: #666;">You have consulted with specialists across ${specializations.length} different medical fields, showing comprehensive healthcare coverage.</p>
          </div>

          <div class="section">
            <div class="section-title">Appointment History</div>
            <table class="table">
              <tr>
                <th>Status</th>
                <th>Count</th>
                <th>Percentage</th>
              </tr>
              <tr>
                <td class="status-confirmed">Confirmed</td>
                <td>${appointmentsByStatus.confirmed}</td>
                <td>${totalAppointments > 0 ? ((appointmentsByStatus.confirmed / totalAppointments) * 100).toFixed(1) : 0}%</td>
              </tr>
              <tr>
                <td class="status-pending">Pending</td>
                <td>${appointmentsByStatus.pending}</td>
                <td>${totalAppointments > 0 ? ((appointmentsByStatus.pending / totalAppointments) * 100).toFixed(1) : 0}%</td>
              </tr>
              <tr>
                <td class="status-cancelled">Cancelled</td>
                <td>${appointmentsByStatus.cancelled}</td>
                <td>${totalAppointments > 0 ? ((appointmentsByStatus.cancelled / totalAppointments) * 100).toFixed(1) : 0}%</td>
              </tr>
            </table>
          </div>

          ${reportType === 'detailed' ? `
          <div class="section">
            <div class="section-title">Recent Appointments</div>
            <table class="table">
              <tr>
                <th>Date</th>
                <th>Doctor</th>
                <th>Specialization</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
              ${appointments.slice(0, 10).map(apt => `
                <tr>
                  <td>${new Date(apt.appointmentDate).toLocaleDateString()}</td>
                  <td>Dr. ${apt.doctor.name} ${apt.doctor.lastName}</td>
                  <td>${apt.doctor.specialization}</td>
                  <td class="status-${apt.status.toLowerCase()}">${apt.status}</td>
                  <td>KSh ${parseFloat(apt.totalAmount).toLocaleString()}</td>
                </tr>
              `).join('')}
            </table>
          </div>

          ${prescriptions.length > 0 ? `
          <div class="section">
            <div class="section-title">Prescription Summary</div>
            <table class="table">
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Notes</th>
              </tr>
              ${prescriptions.slice(0, 5).map(prescription => {
                const relatedAppointment = appointments.find(apt => apt.appointmentId === prescription.appointmentId);
                return `
                  <tr>
                    <td>${relatedAppointment ? new Date(relatedAppointment.appointmentDate).toLocaleDateString() : 'N/A'}</td>
                    <td>KSh ${parseFloat(prescription.amount).toLocaleString()}</td>
                    <td>${prescription.notes.substring(0, 100)}${prescription.notes.length > 100 ? '...' : ''}</td>
                  </tr>
                `;
              }).join('')}
            </table>
          </div>
          ` : ''}
          ` : ''}

          ${complaints.length > 0 ? `
          <div class="section">
            <div class="section-title">Feedback & Complaints</div>
            <table class="table">
              <tr>
                <th>Status</th>
                <th>Count</th>
              </tr>
              <tr>
                <td>Open</td>
                <td>${complaintsByStatus.open}</td>
              </tr>
              <tr>
                <td>In Progress</td>
                <td>${complaintsByStatus.inProgress}</td>
              </tr>
              <tr>
                <td>Resolved</td>
                <td>${complaintsByStatus.resolved}</td>
              </tr>
              <tr>
                <td>Closed</td>
                <td>${complaintsByStatus.closed}</td>
              </tr>
            </table>
          </div>
          ` : ''}

          <div class="section">
            <div class="section-title">Health Insights</div>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
              <h4 style="color: #14B8A6; margin-bottom: 15px;">Key Observations:</h4>
              <ul style="margin: 0; padding-left: 20px;">
                <li>You have maintained ${appointmentsByStatus.confirmed > 0 ? 'good' : 'developing'} appointment attendance with ${appointmentsByStatus.confirmed} confirmed visits</li>
                <li>Your healthcare investment of KSh ${totalSpent.toLocaleString()} shows ${totalSpent > 10000 ? 'strong' : 'growing'} commitment to health</li>
                <li>Consulting ${uniqueDoctors} different doctors indicates ${uniqueDoctors > 2 ? 'comprehensive' : 'focused'} healthcare approach</li>
                ${prescriptions.length > 0 ? `<li>You have received ${prescriptions.length} prescriptions, showing active medical management</li>` : ''}
                ${complaints.length === 0 ? '<li>No complaints filed shows satisfaction with care received</li>' : `<li>${complaintsByStatus.resolved} of ${complaints.length} complaints resolved shows responsive care</li>`}
              </ul>
            </div>
          </div>

          <div class="footer">
            <p>This report was generated by CareConnect Hospital Management System</p>
            <p>For questions about your health data, please contact your healthcare provider</p>
            <p>© ${new Date().getFullYear()} CareConnect. All rights reserved.</p>
          </div>
        </body>
        </html>
      `;

      // Create and download the report
      const blob = new Blob([reportHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `CareConnect_Health_Report_${user.first_name}_${user.last_name}_${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Health report generated and downloaded successfully!");
      onClose();
    } catch (error) {
      console.error("Error generating health report:", error);
      toast.error("Failed to generate health report. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-pink-500 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="h-6 w-6 text-white" />
              <h2 className="text-xl font-bold text-white">Generate Health Report</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Report Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Report Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setReportType('summary')}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  reportType === 'summary'
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                Summary Report
              </button>
              <button
                onClick={() => setReportType('detailed')}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  reportType === 'detailed'
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                Detailed Report
              </button>
            </div>
          </div>

          {/* Report Preview */}
          {appointmentsData?.data && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Your Health Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-600">
                    {appointmentsData.data.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Visits</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-600">
                    KSh {appointmentsData.data.reduce((sum, apt) => sum + parseFloat(apt.totalAmount), 0).toFixed(0)}
                  </div>
                  <div className="text-sm text-gray-600">Healthcare Investment</div>
                </div>
              </div>
            </div>
          )}

          {/* Report Features */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Report Includes:</h4>
            <div className="grid grid-cols-1 gap-2 text-sm text-blue-800">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Complete appointment history</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Healthcare spending analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Doctor consultations summary</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Prescription records</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Health engagement score</span>
              </div>
              {reportType === 'detailed' && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Detailed visit records</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={generateHealthReport}
              disabled={isGenerating}
              className="flex-1 bg-gradient-to-r from-teal-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-teal-600 hover:to-pink-600 transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Download className="h-5 w-5" />
                  <span>Download Report</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientHealthReport;