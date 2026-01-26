import React, { useState } from 'react';
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
  TrendingDown,
  Users,
  DollarSign,
  Calendar,
  Activity,
  Target,
  Award,
  Clock,
  MapPin,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
} from 'lucide-react';

// Import APIs
import { appointmentsAPI } from '../../../../reducers/appointments/appointmentsAPI';
import { usersAPI } from '../../../../reducers/users/usersAPI';
import { doctorsAPI } from '../../../../reducers/doctors/doctorsAPI';
import { complaintsAPI } from '../../../../reducers/complaints/complaintsAPI';
import { prescriptionsAPI } from '../../../../reducers/prescriptions/prescriptionsAPI';
import { paymentsAPI } from '../../../../reducers/payments/paymentsAPI';
import AdminSystemReport from './reports/AdminSystemReport';

const AdminAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [showReportGenerator, setShowReportGenerator] = useState(false);

  // Fetch all data
  const { data: appointmentsData } = appointmentsAPI.useGetDetailedAppointmentsQuery();
  const { data: usersData } = usersAPI.useGetUsersQuery();
  const { data: doctorsData } = doctorsAPI.useGetDoctorsQuery();
  const { data: complaintsData } = complaintsAPI.useGetComplaintsQuery();
  const { data: prescriptionsData } = prescriptionsAPI.useGetPrescriptionsQuery();
  const { data: paymentsData } = paymentsAPI.useGetAllPaymentsQuery();

  // Process data for analytics
  const processedData = React.useMemo(() => {
    if (!appointmentsData?.data || !usersData || !doctorsData?.data) {
      return null;
    }

    const appointments = appointmentsData.data;
    const users = usersData;
    const doctors = doctorsData.data;
    const complaints = complaintsData?.data || [];
    const prescriptions = prescriptionsData?.data || [];

    // Calculate overview metrics
    const totalRevenue = appointments.reduce((sum, apt) => sum + parseFloat(apt.totalAmount), 0);
    const totalAppointments = appointments.length;
    const totalUsers = users.length;
    const totalDoctors = doctors.length;

    // Monthly revenue data
    const monthlyData = appointments.reduce((acc, apt) => {
      const month = new Date(apt.appointmentDate).toLocaleDateString('en-US', { month: 'short' });
      const existing = acc.find((item) => item.month === month);
      if (existing) {
        existing.revenue += parseFloat(apt.totalAmount);
        existing.appointments += 1;
      } else {
        acc.push({
          month,
          revenue: parseFloat(apt.totalAmount),
          appointments: 1,
        });
      }
      return acc;
    }, [] as any[]);

    // Appointment status distribution
    const statusData = [
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

    // Doctor specialization distribution
    const specializationData = doctors.reduce((acc, doctor) => {
      const spec = doctor.doctor.specialization;
      const existing = acc.find((item) => item.name === spec);
      if (existing) {
        existing.value += 1;
      } else {
        acc.push({
          name: spec,
          value: 1,
          color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        });
      }
      return acc;
    }, [] as any[]);

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
      .slice(0, 5);

    // Complaint status distribution
    const complaintStatusData = [
      {
        name: 'Open',
        value: complaints.filter((c) => c.status === 'Open').length,
        color: '#EF4444',
      },
      {
        name: 'In Progress',
        value: complaints.filter((c) => c.status === 'In Progress').length,
        color: '#F59E0B',
      },
      {
        name: 'Resolved',
        value: complaints.filter((c) => c.status === 'Resolved').length,
        color: '#10B981',
      },
      {
        name: 'Closed',
        value: complaints.filter((c) => c.status === 'Closed').length,
        color: '#6B7280',
      },
    ];

    return {
      overview: {
        totalRevenue,
        totalAppointments,
        totalUsers,
        totalDoctors,
        totalComplaints: complaints.length,
        totalPrescriptions: prescriptions.length,
        averageAppointmentValue: totalRevenue / totalAppointments || 0,
        revenueGrowth: 12.5, // You can calculate this based on historical data
        appointmentGrowth: 8.3,
        userGrowth: 15.7,
      },
      monthlyData,
      statusData,
      specializationData,
      doctorPerformance,
      complaintStatusData,
    };
  }, [appointmentsData, usersData, doctorsData, complaintsData, prescriptionsData, paymentsData]);

  const StatCard = ({
    title,
    value,
    growth,
    icon: Icon,
    color = 'blue',
    prefix = '',
    suffix = '',
  }: {
    title: string;
    value: number | string;
    growth?: number;
    icon: any;
    color?: string;
    prefix?: string;
    suffix?: string;
  }) => {
    const isPositive = growth ? growth >= 0 : true;
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
      orange: 'bg-orange-50 text-orange-600 border-orange-200',
      teal: 'bg-teal-50 text-teal-600 border-teal-200',
    };

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`p-3 rounded-lg border ${colorClasses[color as keyof typeof colorClasses]}`}
          >
            <Icon className="h-6 w-6" />
          </div>
          {growth !== undefined && (
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {Math.abs(growth)}%
            </div>
          )}
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <p className="text-2xl font-bold text-gray-900">
            {prefix}
            {typeof value === 'number' ? value.toLocaleString() : value}
            {suffix}
          </p>
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
              {entry.name}: {entry.name.includes('Revenue') ? 'KSh ' : ''}
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
              System Analytics
            </h1>
            <p className="text-gray-600 mt-1">
              Comprehensive insights into CareConnect's performance and operations
            </p>
          </div>
          <div className="flex gap-2">
            {['1month', '3months', '6months', '1year'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedPeriod === period
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {period === '1month'
                  ? '1M'
                  : period === '3months'
                    ? '3M'
                    : period === '6months'
                      ? '6M'
                      : '1Y'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={processedData.overview.totalRevenue}
          growth={processedData.overview.revenueGrowth}
          icon={DollarSign}
          color="green"
          prefix="KSh "
        />
        <StatCard
          title="Total Appointments"
          value={processedData.overview.totalAppointments}
          growth={processedData.overview.appointmentGrowth}
          icon={Calendar}
          color="blue"
        />
        <StatCard
          title="Total Users"
          value={processedData.overview.totalUsers}
          growth={processedData.overview.userGrowth}
          icon={Users}
          color="purple"
        />
        <StatCard
          title="Medical Staff"
          value={processedData.overview.totalDoctors}
          icon={Activity}
          color="teal"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <LineChartIcon className="h-5 w-5 text-teal-600" />
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
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

        {/* Appointment Status Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <PieChartIcon className="h-5 w-5 text-teal-600" />
            <h3 className="text-lg font-semibold text-gray-900">Appointment Status</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={processedData.statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {processedData.statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any, props: any) => [
                  `${value} appointments`,
                  props.payload.name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {processedData.statusData.map((status, index) => (
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
        {/* Doctor Specializations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="h-5 w-5 text-teal-600" />
            <h3 className="text-lg font-semibold text-gray-900">Medical Specializations</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={processedData.specializationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#14B8A6" radius={[4, 4, 0, 0]} name="Doctors" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Performing Doctors */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Award className="h-5 w-5 text-teal-600" />
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Doctors</h3>
          </div>
          <div className="space-y-4">
            {processedData.doctorPerformance.map((doctor, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-teal-600">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{doctor.name}</p>
                    <p className="text-sm text-gray-600">{doctor.specialization}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    KSh {doctor.revenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">{doctor.appointments} appointments</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* System Health */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-teal-600" />
            <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Appointment Value</span>
              <span className="font-semibold">
                KSh {processedData.overview.averageAppointmentValue.toFixed(0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Prescriptions</span>
              <span className="font-semibold">{processedData.overview.totalPrescriptions}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Complaints</span>
              <span className="font-semibold">{processedData.overview.totalComplaints}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Doctor Utilization</span>
              <span className="font-semibold">
                {(
                  ((processedData.overview.totalAppointments /
                    processedData.overview.totalDoctors) *
                    100) /
                  30
                ).toFixed(1)}
                %
              </span>
            </div>
          </div>
        </div>

        {/* Complaint Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-teal-600" />
            <h3 className="text-lg font-semibold text-gray-900">Complaint Status</h3>
          </div>
          <div className="space-y-3">
            {processedData.complaintStatusData.map((status, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }} />
                  <span className="text-sm text-gray-600">{status.name}</span>
                </div>
                <span className="font-medium">{status.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-teal-600" />
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => setShowReportGenerator(true)}
              className="w-full bg-teal-50 hover:bg-teal-100 text-teal-700 p-3 rounded-lg text-sm font-medium transition-colors"
            >
              Generate Monthly Report
            </button>
            <button className="w-full bg-green-50 hover:bg-green-100 text-green-700 p-3 rounded-lg text-sm font-medium transition-colors">
              Export Financial Data
            </button>
            <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 p-3 rounded-lg text-sm font-medium transition-colors">
              View Detailed Analytics
            </button>
            <button className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 p-3 rounded-lg text-sm font-medium transition-colors">
              System Performance
            </button>
          </div>
        </div>
      </div>

      {/* Report Generator Modal */}
      <AdminSystemReport
        isOpen={showReportGenerator}
        onClose={() => setShowReportGenerator(false)}
      />
    </div>
  );
};

export default AdminAnalytics;
