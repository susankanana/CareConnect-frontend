import React, { useState } from 'react';
import { appointmentsAPI } from '../../../../../reducers/appointments/appointmentsAPI';
import { usersAPI } from '../../../../../reducers/users/usersAPI';
import { doctorsAPI } from '../../../../../reducers/doctors/doctorsAPI';
import { complaintsAPI } from '../../../../../reducers/complaints/complaintsAPI';
import { prescriptionsAPI } from '../../../../../reducers/prescriptions/prescriptionsAPI';
import { paymentsAPI } from '../../../../../reducers/payments/paymentsAPI';
import { toast } from 'sonner';
import {
  Download,
  BarChart3,
  X,
  Loader,
  CheckCircle,
} from 'lucide-react';

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
  const { data: complaintsData } = complaintsAPI.useGetComplaintsQuery();
  const { data: prescriptionsData } = prescriptionsAPI.useGetPrescriptionsQuery();
  const { data: paymentsData } = paymentsAPI.useGetAllPaymentsQuery();

  const generateSystemReport = async () => {
    if (!appointmentsData?.data || !usersData || !doctorsData?.data) {
      toast.error("System data not available for report generation");
      return;
    }

    setIsGenerating(true);

    try {
      const appointments = appointmentsData.data;
      const users = usersData;
      const doctors = doctorsData.data;
      const complaints = complaintsData?.data || [];
      const prescriptions = prescriptionsData?.data || [];
      const payments = paymentsData?.data || [];

      // Calculate system metrics
      const totalRevenue = appointments.reduce((sum, apt) => sum + parseFloat(apt.totalAmount), 0);
      const totalUsers = users.length;
      const totalDoctors = doctors.length;
      const totalAppointments = appointments.length;
      const totalComplaints = complaints.length;
      const totalPrescriptions = prescriptions.length;
      const totalPayments = payments.length;

      const appointmentsByStatus = {
        confirmed: appointments.filter(apt => apt.status === 'Confirmed').length,
        pending: appointments.filter(apt => apt.status === 'Pending').length,
        cancelled: appointments.filter(apt => apt.status === 'Cancelled').length
      };

      const usersByRole = {
        patients: users.filter(user => user.role === 'user').length,
        doctors: users.filter(user => user.role === 'doctor').length,
        admins: users.filter(user => user.role === 'admin').length
      };

      const complaintsByStatus = {
        open: complaints.filter(c => c.status === 'Open').length,
        inProgress: complaints.filter(c => c.status === 'In Progress').length,
        resolved: complaints.filter(c => c.status === 'Resolved').length,
        closed: complaints.filter(c => c.status === 'Closed').length
      };

      // Top performing doctors
      const doctorPerformance = doctors.map(doctor => {
        const doctorAppointments = appointments.filter(apt => apt.doctor?.id === doctor.user.userId);
        const revenue = doctorAppointments.reduce((sum, apt) => sum + parseFloat(apt.totalAmount), 0);
        return {
          name: `Dr. ${doctor.user.firstName} ${doctor.user.lastName}`,
          specialization: doctor.doctor.specialization,
          appointments: doctorAppointments.length,
          revenue
        };
      }).sort((a, b) => b.revenue - a.revenue).slice(0, 10);

      // Specialization distribution
      const specializationStats = doctors.reduce((acc, doctor) => {
        const spec = doctor.doctor.specialization;
        acc[spec] = (acc[spec] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Generate comprehensive HTML report
      const reportHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>CareConnect - System Performance Report</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 40px; color: #333; background: #f8fafc; }
            .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #14B8A6, #EC4899); color: white; padding: 40px; text-align: center; }
            .logo { font-size: 32px; font-weight: bold; margin-bottom: 10px; }
            .report-title { font-size: 36px; font-weight: bold; margin: 15px 0; }
            .report-subtitle { font-size: 18px; opacity: 0.9; }
            .content { padding: 40px; }
            .executive-summary { background: #f0fdfa; padding: 30px; border-radius: 12px; margin: 30px 0; border-left: 4px solid #14B8A6; }
            .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 25px; margin: 40px 0; }
            .metric-card { background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 25px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05); transition: transform 0.2s; }
            .metric-card:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
            .metric-value { font-size: 36px; font-weight: bold; color: #14B8A6; margin-bottom: 8px; }
            .metric-label { color: #666; font-size: 16px; font-weight: 500; }
            .metric-change { font-size: 12px; margin-top: 5px; }
            .positive { color: #059669; }
            .negative { color: #dc2626; }
            .section { margin: 40px 0; }
            .section-title { font-size: 24px; font-weight: bold; margin-bottom: 20px; color: #14B8A6; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
            .table { width: 100%; border-collapse: collapse; margin: 20px 0; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
            .table th, .table td { padding: 15px; text-align: left; border-bottom: 1px solid #e5e7eb; }
            .table th { background: #f9fafb; font-weight: 600; color: #374151; }
            .table tr:hover { background: #f9fafb; }
            .status-confirmed { color: #059669; font-weight: bold; background: #d1fae5; padding: 4px 8px; border-radius: 4px; }
            .status-pending { color: #d97706; font-weight: bold; background: #fef3c7; padding: 4px 8px; border-radius: 4px; }
            .status-cancelled { color: #dc2626; font-weight: bold; background: #fee2e2; padding: 4px 8px; border-radius: 4px; }
            .chart-placeholder { background: #f3f4f6; border: 2px dashed #d1d5db; border-radius: 8px; padding: 40px; text-align: center; color: #6b7280; margin: 20px 0; }
            .footer { background: #f9fafb; padding: 30px; text-align: center; color: #666; font-size: 14px; border-top: 1px solid #e5e7eb; }
            .highlight-box { background: linear-gradient(135deg, #eff6ff, #dbeafe); border: 1px solid #3b82f6; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .two-column { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 30px 0; }
            @media (max-width: 768px) { .two-column { grid-template-columns: 1fr; } .metrics-grid { grid-template-columns: 1fr; } }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">CareConnect Hospital</div>
              <div class="report-title">System Performance Report</div>
              <div class="report-subtitle">Comprehensive Healthcare Management Analytics</div>
              <div style="margin-top: 20px; font-size: 16px;">Generated on ${new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</div>
            </div>

            <div class="content">
              <div class="executive-summary">
                <h3 style="margin-top: 0; color: #14B8A6;">Executive Summary</h3>
                <p>CareConnect Hospital has successfully managed <strong>${totalAppointments.toLocaleString()}</strong> appointments, 
                serving <strong>${totalUsers.toLocaleString()}</strong> patients with a team of <strong>${totalDoctors}</strong> medical professionals. 
                The system has generated <strong>KSh ${totalRevenue.toLocaleString()}</strong> in total revenue, demonstrating strong operational performance.</p>
                
                <p>With a <strong>${((appointmentsByStatus.confirmed / Math.max(totalAppointments, 1)) * 100).toFixed(1)}%</strong> appointment confirmation rate 
                and <strong>${((complaintsByStatus.resolved / Math.max(totalComplaints, 1)) * 100).toFixed(1)}%</strong> complaint resolution rate, 
                the hospital maintains high standards of patient care and satisfaction.</p>
              </div>

              <div class="metrics-grid">
                <div class="metric-card">
                  <div class="metric-value">${totalRevenue.toLocaleString()}</div>
                  <div class="metric-label">Total Revenue (KSh)</div>
                  <div class="metric-change positive">↗ System Performance</div>
                </div>
                <div class="metric-card">
                  <div class="metric-value">${totalAppointments.toLocaleString()}</div>
                  <div class="metric-label">Total Appointments</div>
                  <div class="metric-change positive">↗ Patient Engagement</div>
                </div>
                <div class="metric-card">
                  <div class="metric-value">${totalUsers.toLocaleString()}</div>
                  <div class="metric-label">Registered Users</div>
                  <div class="metric-change positive">↗ Growing Community</div>
                </div>
                <div class="metric-card">
                  <div class="metric-value">${totalDoctors}</div>
                  <div class="metric-label">Medical Staff</div>
                  <div class="metric-change positive">↗ Expert Team</div>
                </div>
                <div class="metric-card">
                  <div class="metric-value">${totalPrescriptions.toLocaleString()}</div>
                  <div class="metric-label">Prescriptions Issued</div>
                  <div class="metric-change positive">↗ Active Treatment</div>
                </div>
                <div class="metric-card">
                  <div class="metric-value">${((appointmentsByStatus.confirmed / Math.max(totalAppointments, 1)) * 100).toFixed(1)}%</div>
                  <div class="metric-label">Confirmation Rate</div>
                  <div class="metric-change positive">↗ Reliability</div>
                </div>
              </div>

              <div class="two-column">
                <div class="section">
                  <div class="section-title">User Distribution</div>
                  <table class="table">
                    <tr><th>Role</th><th>Count</th><th>Percentage</th></tr>
                    <tr><td>Patients</td><td>${usersByRole.patients}</td><td>${((usersByRole.patients / totalUsers) * 100).toFixed(1)}%</td></tr>
                    <tr><td>Doctors</td><td>${usersByRole.doctors}</td><td>${((usersByRole.doctors / totalUsers) * 100).toFixed(1)}%</td></tr>
                    <tr><td>Administrators</td><td>${usersByRole.admins}</td><td>${((usersByRole.admins / totalUsers) * 100).toFixed(1)}%</td></tr>
                  </table>
                </div>

                <div class="section">
                  <div class="section-title">Appointment Status</div>
                  <table class="table">
                    <tr><th>Status</th><th>Count</th><th>Percentage</th></tr>
                    <tr><td><span class="status-confirmed">Confirmed</span></td><td>${appointmentsByStatus.confirmed}</td><td>${((appointmentsByStatus.confirmed / Math.max(totalAppointments, 1)) * 100).toFixed(1)}%</td></tr>
                    <tr><td><span class="status-pending">Pending</span></td><td>${appointmentsByStatus.pending}</td><td>${((appointmentsByStatus.pending / Math.max(totalAppointments, 1)) * 100).toFixed(1)}%</td></tr>
                    <tr><td><span class="status-cancelled">Cancelled</span></td><td>${appointmentsByStatus.cancelled}</td><td>${((appointmentsByStatus.cancelled / Math.max(totalAppointments, 1)) * 100).toFixed(1)}%</td></tr>
                  </table>
                </div>
              </div>

              <div class="section">
                <div class="section-title">Top Performing Doctors</div>
                <table class="table">
                  <tr>
                    <th>Rank</th>
                    <th>Doctor</th>
                    <th>Specialization</th>
                    <th>Appointments</th>
                    <th>Revenue (KSh)</th>
                  </tr>
                  ${doctorPerformance.map((doctor, index) => `
                    <tr>
                      <td><strong>#${index + 1}</strong></td>
                      <td>${doctor.name}</td>
                      <td>${doctor.specialization}</td>
                      <td>${doctor.appointments}</td>
                      <td>${doctor.revenue.toLocaleString()}</td>
                    </tr>
                  `).join('')}
                </table>
              </div>

              <div class="section">
                <div class="section-title">Medical Specializations</div>
                <table class="table">
                  <tr><th>Specialization</th><th>Doctors</th><th>Percentage</th></tr>
                  ${Object.entries(specializationStats).map(([spec, count]) => `
                    <tr>
                      <td>${spec}</td>
                      <td>${count}</td>
                      <td>${((count / totalDoctors) * 100).toFixed(1)}%</td>
                    </tr>
                  `).join('')}
                </table>
              </div>

              ${complaints.length > 0 ? `
              <div class="section">
                <div class="section-title">Patient Feedback & Complaints</div>
                <div class="highlight-box">
                  <h4 style="margin-top: 0; color: #1e40af;">Complaint Resolution Performance</h4>
                  <p>Out of ${totalComplaints} total complaints, <strong>${complaintsByStatus.resolved}</strong> have been resolved, 
                  showing a <strong>${((complaintsByStatus.resolved / Math.max(totalComplaints, 1)) * 100).toFixed(1)}%</strong> resolution rate.</p>
                </div>
                <table class="table">
                  <tr><th>Status</th><th>Count</th><th>Percentage</th></tr>
                  <tr><td>Open</td><td>${complaintsByStatus.open}</td><td>${((complaintsByStatus.open / Math.max(totalComplaints, 1)) * 100).toFixed(1)}%</td></tr>
                  <tr><td>In Progress</td><td>${complaintsByStatus.inProgress}</td><td>${((complaintsByStatus.inProgress / Math.max(totalComplaints, 1)) * 100).toFixed(1)}%</td></tr>
                  <tr><td>Resolved</td><td>${complaintsByStatus.resolved}</td><td>${((complaintsByStatus.resolved / Math.max(totalComplaints, 1)) * 100).toFixed(1)}%</td></tr>
                  <tr><td>Closed</td><td>${complaintsByStatus.closed}</td><td>${((complaintsByStatus.closed / Math.max(totalComplaints, 1)) * 100).toFixed(1)}%</td></tr>
                </table>
              </div>
              ` : ''}

              <div class="section">
                <div class="section-title">System Health Indicators</div>
                <div class="metrics-grid">
                  <div class="metric-card">
                    <div class="metric-value">${(totalRevenue / Math.max(totalAppointments, 1)).toFixed(0)}</div>
                    <div class="metric-label">Avg Revenue per Appointment (KSh)</div>
                  </div>
                  <div class="metric-card">
                    <div class="metric-value">${(totalAppointments / Math.max(totalDoctors, 1)).toFixed(1)}</div>
                    <div class="metric-label">Appointments per Doctor</div>
                  </div>
                  <div class="metric-card">
                    <div class="metric-value">${((users.filter(u => u.isVerified).length / totalUsers) * 100).toFixed(1)}%</div>
                    <div class="metric-label">User Verification Rate</div>
                  </div>
                  <div class="metric-card">
                    <div class="metric-value">${totalPayments}</div>
                    <div class="metric-label">Completed Payments</div>
                  </div>
                </div>
              </div>

              <div class="highlight-box">
                <h4 style="margin-top: 0; color: #1e40af;">Recommendations for Continued Growth</h4>
                <ul style="margin: 15px 0; padding-left: 20px;">
                  <li>Continue monitoring appointment confirmation rates to maintain high patient satisfaction</li>
                  <li>Focus on resolving open complaints to improve overall patient experience</li>
                  <li>Consider expanding medical specializations based on patient demand patterns</li>
                  <li>Implement targeted strategies to increase user verification rates</li>
                  <li>Monitor doctor workload distribution for optimal resource allocation</li>
                </ul>
              </div>
            </div>

            <div class="footer">
              <p><strong>CareConnect Hospital Management System</strong></p>
              <p>This comprehensive report provides insights into system performance, user engagement, and operational efficiency.</p>
              <p>Generated on ${new Date().toLocaleString()} | © ${new Date().getFullYear()} CareConnect. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Create and download the report
      const blob = new Blob([reportHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `CareConnect_System_Report_${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("System report generated and downloaded successfully!");
      onClose();
    } catch (error) {
      console.error("Error generating system report:", error);
      toast.error("Failed to generate system report. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-pink-500 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-white" />
              <h2 className="text-xl font-bold text-white">Generate System Report</h2>
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
            <label className="block text-sm font-medium text-gray-700 mb-3">Report Scope</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'monthly', label: 'Monthly Report' },
                { value: 'quarterly', label: 'Quarterly Report' },
                { value: 'yearly', label: 'Annual Report' },
                { value: 'comprehensive', label: 'Comprehensive Report' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setReportType(option.value as any)}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    reportType === option.value
                      ? 'border-teal-500 bg-teal-50 text-teal-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* System Overview */}
          {appointmentsData?.data && usersData && doctorsData?.data && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">System Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-600">
                    {appointmentsData.data.length}
                  </div>
                  <div className="text-sm text-gray-600">Appointments</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-600">
                    {usersData.length}
                  </div>
                  <div className="text-sm text-gray-600">Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-600">
                    {doctorsData.data.length}
                  </div>
                  <div className="text-sm text-gray-600">Doctors</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-600">
                    KSh {appointmentsData.data.reduce((sum, apt) => sum + parseFloat(apt.totalAmount), 0).toFixed(0)}
                  </div>
                  <div className="text-sm text-gray-600">Revenue</div>
                </div>
              </div>
            </div>
          )}

          {/* Report Features */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">System Report Includes:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-blue-800">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Revenue analytics</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>User statistics</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Doctor performance</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Appointment analytics</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Complaint resolution</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>System health metrics</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Growth recommendations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Executive summary</span>
              </div>
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
              onClick={generateSystemReport}
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
                  <span>Generate Report</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSystemReport;