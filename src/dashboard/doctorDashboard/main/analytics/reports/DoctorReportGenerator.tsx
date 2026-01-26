import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../../app/store';
import { appointmentsAPI } from '../../../../../reducers/appointments/appointmentsAPI';
import { prescriptionsAPI } from '../../../../../reducers/prescriptions/prescriptionsAPI';
import { toast } from 'sonner';
import { FileText, Download, X, Loader, CheckCircle } from 'lucide-react';

interface ReportGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
}

const DoctorReportGenerator: React.FC<ReportGeneratorProps> = ({ isOpen, onClose }) => {
  const [reportType, setReportType] = useState<'monthly' | 'quarterly' | 'yearly' | 'custom'>(
    'monthly'
  );
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const user = useSelector((state: RootState) => state.user.user);
  const doctorId = user?.user_id;

  const { data: appointmentsData } = appointmentsAPI.useGetAppointmentsByDoctorIdQuery(
    doctorId ?? 0,
    { skip: !doctorId }
  );
  const { data: prescriptionsData } = prescriptionsAPI.useGetPrescriptionsByDoctorIdQuery(
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
      default:
        // Keep current dates for custom
        break;
    }
  };

  const generateReport = async () => {
    if (!appointmentsData?.data || !user) {
      toast.error('No data available for report generation');
      return;
    }

    setIsGenerating(true);

    try {
      // Filter data by date range
      const filteredAppointments = appointmentsData.data.filter((apt) => {
        const aptDate = new Date(apt.appointmentDate);
        const start = new Date(dateRange.startDate);
        const end = new Date(dateRange.endDate);
        return aptDate >= start && aptDate <= end;
      });

      const filteredPrescriptions =
        prescriptionsData?.data?.filter((prescription) => {
          // Find related appointment to check date
          const relatedAppointment = appointmentsData.data.find(
            (apt) => apt.appointmentId === prescription.appointmentId
          );
          if (!relatedAppointment) return false;

          const aptDate = new Date(relatedAppointment.appointmentDate);
          const start = new Date(dateRange.startDate);
          const end = new Date(dateRange.endDate);
          return aptDate >= start && aptDate <= end;
        }) || [];

      // Calculate metrics
      const totalRevenue = filteredAppointments.reduce(
        (sum, apt) => sum + parseFloat(apt.totalAmount),
        0
      );
      const totalAppointments = filteredAppointments.length;
      const totalPatients = new Set(filteredAppointments.map((apt) => apt.patient.id)).size;
      const totalPrescriptions = filteredPrescriptions.length;
      const prescriptionRevenue = filteredPrescriptions.reduce(
        (sum, p) => sum + parseFloat(p.amount),
        0
      );

      const statusBreakdown = {
        confirmed: filteredAppointments.filter((apt) => apt.status === 'Confirmed').length,
        pending: filteredAppointments.filter((apt) => apt.status === 'Pending').length,
        cancelled: filteredAppointments.filter((apt) => apt.status === 'Cancelled').length,
      };

      // Generate HTML report
      const reportHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>CareConnect - Doctor Practice Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
            .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #14B8A6; padding-bottom: 20px; }
            .logo { color: #14B8A6; font-size: 24px; font-weight: bold; margin-bottom: 10px; }
            .report-title { font-size: 28px; font-weight: bold; margin: 10px 0; }
            .report-period { color: #666; font-size: 16px; }
            .doctor-info { background: #f0fdfa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0; }
            .metric-card { background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; text-align: center; }
            .metric-value { font-size: 32px; font-weight: bold; color: #14B8A6; }
            .metric-label { color: #666; font-size: 14px; margin-top: 5px; }
            .section { margin: 30px 0; }
            .section-title { font-size: 20px; font-weight: bold; margin-bottom: 15px; color: #14B8A6; }
            .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .table th, .table td { border: 1px solid #e5e7eb; padding: 12px; text-align: left; }
            .table th { background: #f9fafb; font-weight: bold; }
            .footer { margin-top: 50px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #e5e7eb; padding-top: 20px; }
            .status-confirmed { color: #059669; font-weight: bold; }
            .status-pending { color: #d97706; font-weight: bold; }
            .status-cancelled { color: #dc2626; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">CareConnect Hospital</div>
            <div class="report-title">Doctor Practice Report</div>
            <div class="report-period">${dateRange.startDate} to ${dateRange.endDate}</div>
          </div>

          <div class="doctor-info">
            <h3>Doctor Information</h3>
            <p><strong>Name:</strong> Dr. ${user.first_name} ${user.last_name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Report Generated:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-value">${totalAppointments}</div>
              <div class="metric-label">Total Appointments</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">${totalPatients}</div>
              <div class="metric-label">Unique Patients</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">KSh ${totalRevenue.toLocaleString()}</div>
              <div class="metric-label">Total Revenue</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">${totalPrescriptions}</div>
              <div class="metric-label">Prescriptions</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Appointment Status Breakdown</div>
            <table class="table">
              <tr>
                <th>Status</th>
                <th>Count</th>
                <th>Percentage</th>
              </tr>
              <tr>
                <td class="status-confirmed">Confirmed</td>
                <td>${statusBreakdown.confirmed}</td>
                <td>${totalAppointments > 0 ? ((statusBreakdown.confirmed / totalAppointments) * 100).toFixed(1) : 0}%</td>
              </tr>
              <tr>
                <td class="status-pending">Pending</td>
                <td>${statusBreakdown.pending}</td>
                <td>${totalAppointments > 0 ? ((statusBreakdown.pending / totalAppointments) * 100).toFixed(1) : 0}%</td>
              </tr>
              <tr>
                <td class="status-cancelled">Cancelled</td>
                <td>${statusBreakdown.cancelled}</td>
                <td>${totalAppointments > 0 ? ((statusBreakdown.cancelled / totalAppointments) * 100).toFixed(1) : 0}%</td>
              </tr>
            </table>
          </div>

          <div class="section">
            <div class="section-title">Recent Appointments</div>
            <table class="table">
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Patient</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
              ${filteredAppointments
                .slice(0, 10)
                .map(
                  (apt) => `
                <tr>
                  <td>${new Date(apt.appointmentDate).toLocaleDateString()}</td>
                  <td>${apt.timeSlot}</td>
                  <td>${apt.patient.name} ${apt.patient.lastName}</td>
                  <td class="status-${apt.status.toLowerCase()}">${apt.status}</td>
                  <td>KSh ${parseFloat(apt.totalAmount).toLocaleString()}</td>
                </tr>
              `
                )
                .join('')}
            </table>
          </div>

          ${
            filteredPrescriptions.length > 0
              ? `
          <div class="section">
            <div class="section-title">Prescription Summary</div>
            <table class="table">
              <tr>
                <th>Total Prescriptions</th>
                <th>Total Value</th>
                <th>Average Value</th>
              </tr>
              <tr>
                <td>${totalPrescriptions}</td>
                <td>KSh ${prescriptionRevenue.toLocaleString()}</td>
                <td>KSh ${totalPrescriptions > 0 ? (prescriptionRevenue / totalPrescriptions).toFixed(2) : '0.00'}</td>
              </tr>
            </table>
          </div>
          `
              : ''
          }

          <div class="footer">
            <p>This report was generated by CareConnect Hospital Management System</p>
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
      link.download = `CareConnect_Doctor_Report_${dateRange.startDate}_to_${dateRange.endDate}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Report generated and downloaded successfully!');
      onClose();
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report. Please try again.');
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
              <FileText className="h-6 w-6 text-white" />
              <h2 className="text-xl font-bold text-white">Generate Practice Report</h2>
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
            <label className="block text-sm font-medium text-gray-700 mb-3">Report Period</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'monthly', label: 'This Month' },
                { value: 'quarterly', label: 'This Quarter' },
                { value: 'yearly', label: 'This Year' },
                { value: 'custom', label: 'Custom Range' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleReportTypeChange(option.value as any)}
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

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange((prev) => ({ ...prev, startDate: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange((prev) => ({ ...prev, endDate: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
          </div>

          {/* Report Preview */}
          {appointmentsData?.data && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Report Preview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-600">
                    {
                      appointmentsData.data.filter((apt) => {
                        const aptDate = new Date(apt.appointmentDate);
                        const start = new Date(dateRange.startDate);
                        const end = new Date(dateRange.endDate);
                        return aptDate >= start && aptDate <= end;
                      }).length
                    }
                  </div>
                  <div className="text-sm text-gray-600">Appointments</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-600">
                    {
                      new Set(
                        appointmentsData.data
                          .filter((apt) => {
                            const aptDate = new Date(apt.appointmentDate);
                            const start = new Date(dateRange.startDate);
                            const end = new Date(dateRange.endDate);
                            return aptDate >= start && aptDate <= end;
                          })
                          .map((apt) => apt.patient.id)
                      ).size
                    }
                  </div>
                  <div className="text-sm text-gray-600">Patients</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-600">
                    KSh{' '}
                    {appointmentsData.data
                      .filter((apt) => {
                        const aptDate = new Date(apt.appointmentDate);
                        const start = new Date(dateRange.startDate);
                        const end = new Date(dateRange.endDate);
                        return aptDate >= start && aptDate <= end;
                      })
                      .reduce((sum, apt) => sum + parseFloat(apt.totalAmount), 0)
                      .toFixed(0)}
                  </div>
                  <div className="text-sm text-gray-600">Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-600">
                    {prescriptionsData?.data?.filter((prescription) => {
                      const relatedAppointment = appointmentsData.data.find(
                        (apt) => apt.appointmentId === prescription.appointmentId
                      );
                      if (!relatedAppointment) return false;
                      const aptDate = new Date(relatedAppointment.appointmentDate);
                      const start = new Date(dateRange.startDate);
                      const end = new Date(dateRange.endDate);
                      return aptDate >= start && aptDate <= end;
                    }).length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Prescriptions</div>
                </div>
              </div>
            </div>
          )}

          {/* Report Features */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Report Includes:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-blue-800">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Appointment statistics</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Revenue breakdown</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Patient demographics</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Prescription summary</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Status analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Performance metrics</span>
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
              onClick={generateReport}
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

export default DoctorReportGenerator;
