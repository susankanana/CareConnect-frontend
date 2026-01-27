import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../app/store';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';
import {
  TrendingUp, Calendar, Star, Activity, Target, BarChart3,
  User, CreditCard, Stethoscope, Heart, Shield, Download, ArrowRight, Zap
} from 'lucide-react';

// API Imports (kept as provided)
import { appointmentsAPI } from '../../../../reducers/appointments/appointmentsAPI';
import { complaintsAPI } from '../../../../reducers/complaints/complaintsAPI';
import { prescriptionsAPI } from '../../../../reducers/prescriptions/prescriptionsAPI';
import PatientHealthReport from './reports/PatientHealthReport';

const PatientAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [showHealthReport, setShowHealthReport] = useState(false);
  const user = useSelector((state: RootState) => state.user.user);
  const userId = user?.user_id;

  const { data: appointmentsData } = appointmentsAPI.useGetAppointmentsByUserIdQuery(userId ?? 0, { skip: !userId });
  const { data: complaintsData } = complaintsAPI.useGetComplaintsByUserIdQuery(userId ?? 0, { skip: !userId });
  const { data: prescriptionsData } = prescriptionsAPI.useGetPrescriptionsByPatientIdQuery(userId ?? 0, { skip: !userId });

  const processedData = React.useMemo(() => {
    if (!appointmentsData?.data) return null;
    const appointments = appointmentsData.data;
    
    return {
      overview: {
        totalSpent: appointments.reduce((sum, apt) => sum + parseFloat(apt.totalAmount), 0),
        totalAppointments: appointments.length,
        totalPrescriptions: prescriptionsData?.data?.length || 0,
      },
      monthlySpending: appointments.reduce((acc, apt) => {
        const month = new Date(apt.appointmentDate).toLocaleDateString('en-US', { month: 'short' });
        const existing = acc.find((item) => item.month === month);
        if (existing) existing.amount += parseFloat(apt.totalAmount);
        else acc.push({ month, amount: parseFloat(apt.totalAmount) });
        return acc;
      }, [] as any[]),
      statusData: [
        { name: 'completed', value: appointments.filter(a => a.status === 'Confirmed').length, color: '#0d9488' },
        { name: 'pending', value: appointments.filter(a => a.status === 'Pending').length, color: '#db2777' },
        { name: 'others', value: appointments.filter(a => a.status === 'Cancelled').length, color: '#94a3b8' },
      ],
      recent: appointments.slice(0, 4).map(apt => ({
        doctor: `dr. ${apt.doctor.name}`,
        spec: apt.doctor.specialization,
        date: apt.appointmentDate,
        amount: parseFloat(apt.totalAmount),
        status: apt.status
      }))
    };
  }, [appointmentsData, prescriptionsData]);

  const StatCard = ({ title, value, icon: Icon, isCurrency = false }: any) => (
    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-pink-500/5 transition-all group">
      <div className="bg-gray-50 w-12 h-12 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-pink-50 group-hover:text-pink-500 transition-colors mb-6">
        <Icon size={22} />
      </div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{title}</p>
      <h2 className="text-3xl font-black text-gray-900 tracking-tighter italic lowercase">
        {isCurrency ? `kes ${value.toLocaleString()}` : value.toLocaleString()}
      </h2>
    </div>
  );

  if (!processedData) return (
    <div className="flex flex-col justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600 mb-4"></div>
      <p className="text-gray-400 font-medium italic lowercase">syncing your health record...</p>
    </div>
  );

  return (
    <div className="space-y-10 pb-20">
      {/* Personalized Header */}
      <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
            <Heart className="text-pink-500 fill-pink-500" size={20} />
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter italic lowercase">
              hello, {user?.first_name || 'friend'}
            </h1>
          </div>
          <p className="text-gray-400 font-medium tracking-tight">here is your wellness journey at a glance</p>
        </div>
        <div className="flex bg-gray-50 p-1.5 rounded-2xl">
          {['3m', '6m', '1y', 'all'].map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPeriod(p)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                selectedPeriod === p ? 'bg-white text-teal-600 shadow-md' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="total visits" value={processedData.overview.totalAppointments} icon={Calendar} />
        <StatCard title="health spend" value={processedData.overview.totalSpent} icon={CreditCard} isCurrency />
        <StatCard title="prescriptions" value={processedData.overview.totalPrescriptions} icon={Activity} />
        <StatCard title="wellness score" value="4.8" icon={Star} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Spending Area Chart */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm">
          <h3 className="text-xl font-black italic text-gray-900 mb-10 lowercase tracking-tight">spending trajectory</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={processedData.monthlySpending}>
              <defs>
                <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#db2777" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#db2777" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} dy={10} />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#db2777', fontWeight: 900, fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="amount" stroke="#db2777" strokeWidth={4} fillOpacity={1} fill="url(#colorSpend)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Appointment Status Pie */}
        <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm">
          <h3 className="text-xl font-black italic text-gray-900 mb-8 lowercase tracking-tight">visit mix</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={processedData.statusData} innerRadius={60} outerRadius={80} paddingAngle={10} dataKey="value">
                {processedData.statusData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-8 space-y-3">
            {processedData.statusData.map((s: any, i: number) => (
              <div key={i} className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-xl">
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{s.name}</span>
                <span className="text-sm font-black italic text-gray-900">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent History & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm">
          <h3 className="text-xl font-black italic text-gray-900 mb-8 lowercase tracking-tight text-teal-600">recent history</h3>
          <div className="space-y-6">
            {processedData.recent.map((apt: any, i: number) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 group-hover:bg-pink-50 group-hover:text-pink-600 transition-colors">
                    <Stethoscope size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900 lowercase italic">{apt.doctor}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{apt.spec}</p>
                  </div>
                </div>
                <div className="text-right text-[10px] font-black uppercase text-gray-400">
                  {new Date(apt.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action Card */}
        <div className="bg-gradient-to-br from-[#004d4d] to-[#006666] rounded-[3rem] p-10 text-white relative overflow-hidden flex flex-col justify-center">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl" />
          <Zap className="text-pink-500 fill-pink-500 mb-4" size={32} />
          <h3 className="text-3xl font-black italic lowercase mb-2">take control</h3>
          <p className="text-teal-100/70 text-sm font-medium mb-10 leading-relaxed">
            your health data is your power. download your complete medical history or schedule your next check-up today.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setShowHealthReport(true)}
              className="bg-white/10 hover:bg-white/20 border border-white/10 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all"
            >
              <Download size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest">full report</span>
            </button>
            <button className="bg-pink-500 hover:bg-pink-600 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all">
              <ArrowRight size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest">book visit</span>
            </button>
          </div>
        </div>
      </div>

      <PatientHealthReport isOpen={showHealthReport} onClose={() => setShowHealthReport(false)} />
    </div>
  );
};

export default PatientAnalytics;