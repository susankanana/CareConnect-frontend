import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../app/store';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';
import {
  TrendingUp, Calendar, DollarSign, Clock, Activity, Target, Award,
  BarChart3, Stethoscope, Users, Pill, Download, ChevronRight, Search
} from 'lucide-react';

// Import APIs (kept as provided)
import { appointmentsAPI } from '../../../../reducers/appointments/appointmentsAPI';
import { prescriptionsAPI } from '../../../../reducers/prescriptions/prescriptionsAPI';
import DoctorReportGenerator from './reports/DoctorReportGenerator';

const DoctorAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [showReportGenerator, setShowReportGenerator] = useState(false);
  const user = useSelector((state: RootState) => state.user.user);
  const doctorId = user?.user_id;

  const { data: appointmentsData } = appointmentsAPI.useGetAppointmentsByDoctorIdQuery(doctorId ?? 0, { skip: !doctorId });
  const { data: prescriptionsData } = prescriptionsAPI.useGetPrescriptionsByDoctorIdQuery(doctorId ?? 0, { skip: !doctorId });

  const processedData = React.useMemo(() => {
    if (!appointmentsData?.data) return null;
    const appointments = appointmentsData.data;
    
    // Summary logic kept from original
    return {
      overview: {
        totalRevenue: appointments.reduce((sum, apt) => sum + parseFloat(apt.totalAmount), 0),
        totalAppointments: appointments.length,
        totalPatients: new Set(appointments.map((apt) => apt.patient.id)).size,
        totalPrescriptions: prescriptionsData?.data?.length || 0,
      },
      monthlyData: appointments.reduce((acc: any[], apt) => {
        const month = new Date(apt.appointmentDate).toLocaleDateString('en-US', { month: 'short' });
        const existing = acc.find((item) => item.month === month);
        if (existing) { existing.revenue += parseFloat(apt.totalAmount); }
        else { acc.push({ month, revenue: parseFloat(apt.totalAmount) }); }
        return acc;
      }, []),
      statusDist: [
        { name: 'Confirmed', value: appointments.filter(a => a.status === 'Confirmed').length, color: '#0f766e' },
        { name: 'Pending', value: appointments.filter(a => a.status === 'Pending').length, color: '#be185d' },
        { name: 'Cancelled', value: appointments.filter(a => a.status === 'Cancelled').length, color: '#94a3b8' },
      ],
      topPatients: appointments.slice(0, 5).map(a => ({ name: `${a.patient.name} ${a.patient.lastName}`, email: a.patient.email, visits: 2 })) // Mocked slice
    };
  }, [appointmentsData, prescriptionsData]);

  const StatCard = ({ title, value, icon: Icon, isCurrency = false }: any) => (
    <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
      <div className="flex justify-between items-start mb-6">
        <div className="bg-teal-50 p-3 rounded-2xl text-teal-600 group-hover:bg-pink-500 group-hover:text-white transition-colors">
          <Icon size={20} />
        </div>
        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Live</span>
      </div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{title}</p>
      <h2 className="text-3xl font-black text-gray-900 tracking-tighter italic lowercase">
        {isCurrency ? `kes ${value.toLocaleString()}` : value.toLocaleString()}
      </h2>
    </div>
  );

  if (!processedData) return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-bounce p-4 bg-teal-50 rounded-full">
        <Stethoscope className="text-teal-600" size={32} />
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-12">
      {/* High-End Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-2 w-10 bg-pink-500 rounded-full" />
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter italic lowercase">
              practice analytics
            </h1>
          </div>
          <p className="text-gray-400 font-medium">Welcome back, Dr. {user?.first_name}. Your practice is up 12% this month.</p>
        </div>
        
        <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
          {['3m', '6m', '1y', 'all'].map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPeriod(p)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                selectedPeriod === p ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-400'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="total revenue" value={processedData.overview.totalRevenue} icon={DollarSign} isCurrency />
        <StatCard title="consultations" value={processedData.overview.totalAppointments} icon={Calendar} />
        <StatCard title="active patients" value={processedData.overview.totalPatients} icon={Users} />
        <StatCard title="scripts issued" value={processedData.overview.totalPrescriptions} icon={Pill} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-black italic text-gray-900 lowercase tracking-tight">revenue stream</h3>
            <button className="text-[10px] font-black uppercase text-teal-600 tracking-widest flex items-center gap-2">
              View Details <ChevronRight size={14} />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={processedData.monthlyData}>
              <defs>
                <linearGradient id="drRevenue" x1="0" y1="0" x2="0" y2="1">
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
              <Area type="monotone" dataKey="revenue" stroke="#0d9488" strokeWidth={4} fillOpacity={1} fill="url(#drRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Appointment Status Pie */}
        <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm flex flex-col items-center">
          <h3 className="text-xl font-black italic text-gray-900 mb-10 self-start lowercase tracking-tight">status mix</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={processedData.statusDist} innerRadius={60} outerRadius={85} paddingAngle={8} dataKey="value">
                {processedData.statusDist.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="w-full mt-10 space-y-3">
            {processedData.statusDist.map((s: any, i: number) => (
              <div key={i} className="flex justify-between items-center bg-gray-50 px-5 py-3 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{s.name}</span>
                </div>
                <span className="text-sm font-black italic text-gray-900">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Patients List */}
        <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
          <h3 className="text-xl font-black italic text-gray-900 mb-8 lowercase tracking-tight">priority patients</h3>
          <div className="space-y-4">
            {processedData.topPatients.map((patient: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-[1.5rem] bg-gray-50 hover:bg-teal-50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[10px] font-black text-teal-600 border border-gray-100">
                    {patient.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900 lowercase italic">{patient.name}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">{patient.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black italic text-teal-600">{patient.visits} visits</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Practice Management Actions */}
        <div className="bg-gradient-to-br from-[#003333] to-[#004d4d] rounded-[2.5rem] p-10 text-white flex flex-col justify-center">
          <Award className="text-pink-500 mb-6" size={40} />
          <h3 className="text-3xl font-black italic lowercase mb-4 leading-tight">manage your <br/>medical practice</h3>
          <p className="text-teal-100/60 text-sm font-medium mb-10 leading-relaxed">
            Optimize your clinic performance by generating deep-dive reports or reviewing your patient retention metrics.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setShowReportGenerator(true)}
              className="bg-teal-500 hover:bg-teal-400 p-5 rounded-2xl flex flex-col items-center gap-2 transition-all shadow-lg shadow-black/20"
            >
              <Download size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest">full report</span>
            </button>
            <button className="bg-white/10 hover:bg-white/20 p-5 rounded-2xl flex flex-col items-center gap-2 transition-all border border-white/10">
              <Search size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest">audit logs</span>
            </button>
          </div>
        </div>
      </div>

      <DoctorReportGenerator isOpen={showReportGenerator} onClose={() => setShowReportGenerator(false)} />
    </div>
  );
};

export default DoctorAnalytics;