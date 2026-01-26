import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../app/store';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import {
  TrendingUp,
  Calendar,
  DollarSign,
  Clock,
  Activity,
  Target,
  Award,
  BarChart3,
  Stethoscope,
  Users,
  Pill,
} from 'lucide-react';

// Import APIs
import { appointmentsAPI } from '../../../../reducers/appointments/appointmentsAPI';
import { prescriptionsAPI } from '../../../../reducers/prescriptions/prescriptionsAPI';
import DoctorReportGenerator from './reports/DoctorReportGenerator';

const DoctorAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [showReportGenerator, setShowReportGenerator] = useState(false);
  const user = useSelector((state: RootState) => state.user.user);
  const doctorId = user?.user_id; // Assuming doctor's userId is the doctorId

  // Fetch doctor-specific data
  const { data: appointmentsData } = appointmentsAPI.useGetAppointmentsByDoctorIdQuery(
    doctorId ?? 0,
    { skip: !doctorId }
  );
  const { data: prescriptionsData } = prescriptionsAPI.useGetPrescriptionsByDoctorIdQuery(
    doctorId ?? 0,
    { skip: !doctorId }
  );

  // Process data for analytics
  const processedData = React.useMemo(() => {
    if (!appointmentsData?.data) {
      return null;
    }

    const appointments = appointmentsData.data;
    const prescriptions = prescriptionsData?.data || [];

    // Calculate overview metrics
    const totalRevenue = appointments.reduce((sum, apt) => sum + parseFloat(apt.totalAmount), 0);
    const totalAppointments = appointments.length;
    const totalPatients = new Set(appointments.map((apt) => apt.patient.id)).size;
    const averageAppointmentValue = totalRevenue / totalAppointments || 0;

    // Monthly performance data
    const monthlyPerformance = appointments.reduce((acc, apt) => {
      const month = new Date(apt.appointmentDate).toLocaleDateString('en-US', { month: 'short' });
      const existing = acc.find((item) => item.month === month);
      if (existing) {
        existing.revenue += parseFloat(apt.totalAmount);
        existing.appointments += 1;
        existing.patients.add(apt.patient.id);
      } else {
        acc.push({
          month,
          revenue: parseFloat(apt.totalAmount),
          appointments: 1,
          patients: new Set([apt.patient.id]),
        });
      }
      return acc;
    }, [] as any[]);

    // Convert Set to count for chart display
    const monthlyData = monthlyPerformance.map((item) => ({
      ...item,
      uniquePatients: item.patients.size,
      patients: undefined, // Remove the Set object
    }));

    // Appointment status distribution
    const statusDistribution = [
      {
        name: 'Confirmed',
        value: appointments.filter((apt) => apt.status === 'Confirmed').length,
        color: '#10B981',
      },
      {
        name: 'Pending',
        value: appointments.filter((apt) => apt.status === 'Pending').length,
        color: '#F59E0B',
      },
      {
        name: 'Cancelled',
        value: appointments.filter((apt) => apt.status === 'Cancelled').length,
        color: '#EF4444',
      },
    ];

    // Weekly appointment pattern
    const weeklyPattern = appointments.reduce((acc, apt) => {
      const dayName = new Date(apt.appointmentDate).toLocaleDateString('en-US', {
        weekday: 'short',
      });
      const existing = acc.find((item) => item.day === dayName);
      if (existing) {
        existing.appointments += 1;
        existing.revenue += parseFloat(apt.totalAmount);
      } else {
        acc.push({
          day: dayName,
          appointments: 1,
          revenue: parseFloat(apt.totalAmount),
        });
      }
      return acc;
    }, [] as any[]);

    // Top patients by visits
    const patientVisits = appointments
      .reduce((acc, apt) => {
        const patientKey = `${apt.patient.name} ${apt.patient.lastName}`;
        const existing = acc.find((item) => item.name === patientKey);
        if (existing) {
          existing.visits += 1;
          existing.totalSpent += parseFloat(apt.totalAmount);
        } else {
          acc.push({
            name: patientKey,
            email: apt.patient.email,
            visits: 1,
            totalSpent: parseFloat(apt.totalAmount),
          });
        }
        return acc;
      }, [] as any[])
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 5);

    // Prescription analytics
    const prescriptionMetrics = {
      totalPrescriptions: prescriptions.length,
      totalPrescriptionValue: prescriptions.reduce((sum, p) => sum + parseFloat(p.amount), 0),
      averagePrescriptionValue:
        prescriptions.length > 0
          ? prescriptions.reduce((sum, p) => sum + parseFloat(p.amount), 0) / prescriptions.length
          : 0,
      prescriptionsPerAppointment: prescriptions.length / totalAppointments || 0,
    };

    // Performance metrics
    const performanceMetrics = {
      appointmentCompletionRate:
        (appointments.filter((apt) => apt.status === 'Confirmed').length / totalAppointments) *
          100 || 0,
      averageAppointmentsPerDay: totalAppointments / 30, // Assuming 30 days
      patientRetentionRate:
        (patientVisits.filter((p) => p.visits > 1).length / totalPatients) * 100 || 0,
      averageRevenuePerPatient: totalRevenue / totalPatients || 0,
    };

    return {
      overview: {
        totalRevenue,
        totalAppointments,
        totalPatients,
        averageAppointmentValue,
        totalPrescriptions: prescriptions.length,
      },
      monthlyData,
      statusDistribution,
      weeklyPattern,
      patientVisits,
      prescriptionMetrics,
      performanceMetrics,
    };
  }, [appointmentsData, prescriptionsData]);

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color = 'blue',
    prefix = '',
    suffix = '',
    subtitle = '',
  }: {
    title: string;
    value: number | string;
    icon: any;
    color?: string;
    prefix?: string;
    suffix?: string;
    subtitle?: string;
  }) => {
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
      orange: 'bg-orange-50 text-orange-600 border-orange-200',
      teal: 'bg-teal-50 text-teal-600 border-teal-200',
      pink: 'bg-pink-50 text-pink-600 border-pink-200',
    };

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`p-3 rounded-lg border ${colorClasses[color as keyof typeof colorClasses]}`}
          >
            <Icon className="h-6 w-6" />
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <p className="text-2xl font-bold text-gray-900">
            {prefix}
            {typeof value === 'number' ? value.toLocaleString() : value}
            {suffix}
          </p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}:{' '}
              {entry.name.includes('revenue') || entry.name.includes('Revenue') ? 'KSh ' : ''}
              {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!processedData) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="h-7 w-7 text-teal-600" />
              My Practice Analytics
            </h1>
            <p className="text-gray-600 mt-1">
              Welcome back, Dr. {user?.first_name || 'Doctor'}! Here's your practice performance
              overview
            </p>
          </div>
          <div className="flex gap-2">
            {['3months', '6months', '1year', 'all'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedPeriod === period
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {period === '3months'
                  ? '3M'
                  : period === '6months'
                    ? '6M'
                    : period === '1year'
                      ? '1Y'
                      : 'All'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={processedData.overview.totalRevenue.toFixed(0)}
          icon={DollarSign}
          color="green"
          prefix="KSh "
          subtitle="Practice earnings"
        />
        <StatCard
          title="Total Appointments"
          value={processedData.overview.totalAppointments}
          icon={Calendar}
          color="blue"
          subtitle="Patient consultations"
        />
        <StatCard
          title="Unique Patients"
          value={processedData.overview.totalPatients}
          icon={Users}
          color="purple"
          subtitle="Patients served"
        />
        <StatCard
          title="Prescriptions"
          value={processedData.overview.totalPrescriptions}
          icon={Pill}
          color="pink"
          subtitle="Medications prescribed"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-teal-600" />
            <h3 className="text-lg font-semibold text-gray-900">Monthly Performance</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={processedData.monthlyData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#14B8A6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#14B8A6"
                strokeWidth={2}
                fill="url(#revenueGradient)"
                name="Revenue (KSh)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Appointment Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="h-5 w-5 text-teal-600" />
            <h3 className="text-lg font-semibold text-gray-900">Appointment Status</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={processedData.statusDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {processedData.statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any, props: any) => {
                  // Recharts provides 'name' directly for PieChart
                  // Ensure payload and payload[0] exist before accessing properties
                  if (props.payload && props.payload.name) {
                    return [
                      `${value} appointments`,
                      props.payload.name, // Access directly from payload if it's the pie slice
                    ];
                  }
                  return [`${value} appointments`, 'N/A']; // Fallback
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {processedData.statusDistribution.map((status, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }} />
                <span className="text-sm text-gray-600">
                  {status.name} ({status.value})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Pattern */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="h-5 w-5 text-teal-600" />
            <h3 className="text-lg font-semibold text-gray-900">Weekly Appointment Pattern</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={processedData.weeklyPattern}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="appointments"
                fill="#14B8A6"
                radius={[4, 4, 0, 0]}
                name="Appointments"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Patients */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Award className="h-5 w-5 text-teal-600" />
            <h3 className="text-lg font-semibold text-gray-900">Top Patients by Visits</h3>
          </div>
          <div className="space-y-4">
            {processedData.patientVisits.map((patient, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-teal-600">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{patient.name}</p>
                    <p className="text-sm text-gray-600">{patient.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{patient.visits} visits</p>
                  <p className="text-sm text-gray-600">KSh {patient.totalSpent.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Performance Metrics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-teal-600" />
            <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Completion Rate</span>
              <span className="font-medium">
                {processedData.performanceMetrics.appointmentCompletionRate.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Daily Appointments</span>
              <span className="font-medium">
                {processedData.performanceMetrics.averageAppointmentsPerDay.toFixed(1)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Patient Retention</span>
              <span className="font-medium">
                {processedData.performanceMetrics.patientRetentionRate.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Revenue per Patient</span>
              <span className="font-medium">
                KSh {processedData.performanceMetrics.averageRevenuePerPatient.toFixed(0)}
              </span>
            </div>
          </div>
        </div>

        {/* Prescription Analytics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Pill className="h-5 w-5 text-teal-600" />
            <h3 className="text-lg font-semibold text-gray-900">Prescription Analytics</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Prescriptions</span>
              <span className="font-medium">
                {processedData.prescriptionMetrics.totalPrescriptions}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Value</span>
              <span className="font-medium">
                KSh {processedData.prescriptionMetrics.totalPrescriptionValue.toFixed(0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Value</span>
              <span className="font-medium">
                KSh {processedData.prescriptionMetrics.averagePrescriptionValue.toFixed(0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Per Appointment</span>
              <span className="font-medium">
                {processedData.prescriptionMetrics.prescriptionsPerAppointment.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Stethoscope className="h-5 w-5 text-teal-600" />
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="space-y-3">
            <button className="w-full bg-teal-50 hover:bg-teal-100 text-teal-700 p-3 rounded-lg text-sm font-medium transition-colors">
              View Today's Schedule
            </button>
            <button className="w-full bg-green-50 hover:bg-green-100 text-green-700 p-3 rounded-lg text-sm font-medium transition-colors">
              Create Prescription
            </button>
            <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 p-3 rounded-lg text-sm font-medium transition-colors">
              Patient Records
            </button>
            <button
              onClick={() => setShowReportGenerator(true)}
              className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 p-3 rounded-lg text-sm font-medium transition-colors"
            >
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Practice Summary */}
      <div className="bg-gradient-to-r from-teal-600 to-pink-600 rounded-xl p-8 text-white">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-4">Practice Overview</h3>
            <p className="text-teal-100 mb-6">
              Your dedication to patient care is reflected in these metrics. Keep up the excellent
              work in providing quality healthcare.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold">{processedData.overview.totalPatients}</div>
                <div className="text-teal-100">Patients Served</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">
                  KSh {processedData.overview.totalRevenue.toFixed(0)}
                </div>
                <div className="text-teal-100">Total Revenue</div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
              <h4 className="text-xl font-semibold mb-2">Practice Rating</h4>
              <div className="text-4xl font-bold mb-2">
                {processedData.performanceMetrics.appointmentCompletionRate.toFixed(1)}%
              </div>
              <p className="text-teal-100 text-sm">Appointment completion rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Report Generator Modal */}
      <DoctorReportGenerator
        isOpen={showReportGenerator}
        onClose={() => setShowReportGenerator(false)}
      />
    </div>
  );
};

export default DoctorAnalytics;
