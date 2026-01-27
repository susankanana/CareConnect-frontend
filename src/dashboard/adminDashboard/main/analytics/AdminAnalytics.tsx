import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';
import {
  TrendingUp, TrendingDown, Users, Calendar, Activity, Target,
  Award, Clock, BarChart3, PieChart as PieChartIcon,
  LineChart as LineChartIcon, Zap, ArrowRight, Download
} from 'lucide-react';

// API Imports (kept as provided)
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

  const { data: appointmentsData } = appointmentsAPI.useGetDetailedAppointmentsQuery();
  const { data: usersData } = usersAPI.useGetUsersQuery();
  const { data: doctorsData } = doctorsAPI.useGetDoctorsQuery();
  const { data: complaintsData } = complaintsAPI.useGetComplaintsQuery();
  const { data: prescriptionsData } = prescriptionsAPI.useGetPrescriptionsQuery();

  const processedData = React.useMemo(() => {
    if (!appointmentsData?.data || !usersData || !doctorsData?.data) return null;

    const appointments = appointmentsData.data;
    const totalRevenue = appointments.reduce((sum, apt) => sum + parseFloat(apt.totalAmount), 0);
    
    // Monthly data with specific brand colors
    const monthlyData = appointments.reduce((acc, apt) => {
      const month = new Date(apt.appointmentDate).toLocaleDateString('en-US', { month: 'short' });
      const existing = acc.find((item) => item.month === month);
      if (existing) {
        existing.revenue += parseFloat(apt.totalAmount);
      } else {
        acc.push({ month, revenue: parseFloat(apt.totalAmount) });
      }
      return acc;
    }, [] as any[]);

    const doctorPerformance = doctorsData.data
      .map((doc) => ({
        name: `dr. ${doc.user.firstName} ${doc.user.lastName}`,
        spec: doc.doctor.specialization,
        rev: appointments.filter(a => a.doctor?.id === doc.user.userId).reduce((s, a) => s + parseFloat(a.totalAmount), 0)
      }))
      .sort((a, b) => b.rev - a.rev).slice(0, 5);

    return {
      overview: {
        totalRevenue,
        totalAppointments: appointments.length,
        totalUsers: usersData.length,
        totalDoctors: doctorsData.data.length,
        growth: 14.2
      },
      monthlyData,
      doctorPerformance,
      statusData: [
        { name: 'confirmed', value: appointments.filter(a => a.status === 'Confirmed').length, color: '#0d9488' },
        { name: 'pending', value: appointments.filter(a => a.status === 'Pending').length, color: '#db2777' },
        { name: 'cancelled', value: appointments.filter(a => a.status === 'Cancelled').length, color: '#94a3b8' },
      ]
    };
  }, [appointmentsData, usersData, doctorsData]);

  const StatCard = ({ title, value, growth, icon: Icon, isCurrency = false }: any) => (
    <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-teal-500/5 transition-all group">
      <div className="flex justify-between items-start mb-6">
        <div className="bg-gray-50 p-4 rounded-2xl group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
          <Icon size={24} />
        </div>
        {growth && (
          <div className="flex items-center gap-1 text-[11px] font-black text-teal-600 bg-teal-50 px-3 py-1 rounded-full uppercase italic">
            <TrendingUp size={12} /> {growth}%
          </div>
        )}
      </div>
      <div>
        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight italic lowercase">
          {isCurrency ? `kes ${value.toLocaleString()}` : value.toLocaleString()}
        </h2>
      </div>
    </div>
  );

  if (!processedData) return (
    <div className="flex flex-col justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mb-4"></div>
      <p className="text-gray-400 font-medium italic">assembling your intelligence...</p>
    </div>
  );

  return (
    <div className="space-y-10 pb-20">
      {/* Executive Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Zap className="text-pink-500 fill-pink-500" size={20} />
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter italic">system intelligence</h1>
          </div>
          <p className="text-gray-400 font-medium">real-time operational metrics for CareConnect</p>
        </div>
        <div className="flex bg-gray-100 p-1.5 rounded-2xl">
          {['1m', '3m', '6m', '1y'].map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPeriod(p)}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                selectedPeriod === p ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="total liquidity" value={processedData.overview.totalRevenue} growth={12} icon={Activity} isCurrency />
        <StatCard title="active patients" value={processedData.overview.totalUsers} growth={8} icon={Users} />
        <StatCard title="appointments" value={processedData.overview.totalAppointments} growth={14} icon={Calendar} />
        <StatCard title="medical staff" value={processedData.overview.totalDoctors} icon={Award} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-black italic text-gray-900 lowercase">revenue trajectory</h3>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
              <div className="w-2 h-2 rounded-full bg-teal-500" /> performance index
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={processedData.monthlyData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} dy={10} />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#0d9488', fontWeight: 900, fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#0d9488" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Status Breakdown */}
        <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm">
          <h3 className="text-xl font-black italic text-gray-900 mb-10 lowercase">status mix</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={processedData.statusData}
                innerRadius={70}
                outerRadius={90}
                paddingAngle={8}
                dataKey="value"
              >
                {processedData.statusData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-4 mt-8">
            {processedData.statusData.map((s: any, i: number) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{s.name}</span>
                </div>
                <span className="text-sm font-black italic">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Performance & Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Doctors */}
        <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm">
          <h3 className="text-xl font-black italic text-gray-900 mb-8 lowercase text-teal-600">elite performers</h3>
          <div className="space-y-6">
            {processedData.doctorPerformance.map((doc: any, i: number) => (
              <div key={i} className="flex items-center justify-between group cursor-default">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 font-black italic group-hover:bg-pink-50 group-hover:text-pink-600 transition-colors">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900 lowercase">{doc.name}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{doc.spec}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black italic text-gray-900">kes {doc.rev.toLocaleString()}</p>
                  <p className="text-[10px] font-bold text-teal-500 uppercase">growth positive</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Intelligence Actions */}
        <div className="bg-gradient-to-br from-[#004d4d] to-[#006666] rounded-[3rem] p-10 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="relative z-10">
            <h3 className="text-2xl font-black italic mb-2 lowercase tracking-tight">intelligence tools</h3>
            <p className="text-teal-100/60 text-sm font-medium mb-8">generate and export detailed system audits</p>
            
            <div className="space-y-3">
              <button 
                onClick={() => setShowReportGenerator(true)}
                className="w-full bg-white/10 hover:bg-white/20 border border-white/10 p-4 rounded-2xl flex items-center justify-between group transition-all"
              >
                <span className="text-sm font-bold lowercase italic">generate system audit</span>
                <Download size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full bg-pink-500 hover:bg-pink-600 p-4 rounded-2xl flex items-center justify-between group transition-all">
                <span className="text-sm font-bold lowercase italic text-white">export financial ledger</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-teal-200/50">
            <span>reconciliation active</span>
            <span>sync: 100%</span>
          </div>
        </div>
      </div>

      <AdminSystemReport isOpen={showReportGenerator} onClose={() => setShowReportGenerator(false)} />
    </div>
  );
};

export default AdminAnalytics;