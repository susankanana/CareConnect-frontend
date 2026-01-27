import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../app/store';
import {
  appointmentsAPI,
  type TDetailedAppointment,
} from '../../../../reducers/appointments/appointmentsAPI';
import {
  Edit,
  Calendar,
  User,
  Clock,
  CreditCard,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  Video,
  TrendingUp,
} from 'lucide-react';
import ChangeStatus from './ChangeStatus';
import UpdateAppointment from './UpdateAppointment';

const DoctorAppointments = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const doctorId = user?.user_id;
  const [currentTime, setCurrentTime] = useState(new Date());

  const {
    data: appointmentsData,
    isLoading,
    error,
    refetch,
  } = appointmentsAPI.useGetAppointmentsByDoctorIdQuery(doctorId ?? 0, {
    skip: !doctorId,
    refetchOnMountOrArgChange: true,
    pollingInterval: 15000,
  });

  const [selectedAppointment, setSelectedAppointment] = useState<TDetailedAppointment | null>(null);
  const [appointmentToChangeStatus, setAppointmentToChangeStatus] =
    useState<TDetailedAppointment | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleEdit = (appointment: TDetailedAppointment) => {
    setSelectedAppointment(appointment);
    (document.getElementById('update_appointment_modal') as HTMLDialogElement)?.showModal();
  };

  const handleChangeStatus = (appointment: TDetailedAppointment) => {
    setAppointmentToChangeStatus(appointment);
    (document.getElementById('change_status_modal') as HTMLDialogElement)?.showModal();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTimeSlot = (timeSlot: string) => {
    const [hours, minutes] = timeSlot.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );

  if (error)
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-700 text-lg font-semibold">Error fetching appointments</p>
      </div>
    );

  const appointments = appointmentsData?.data || [];

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8">
      {/* Integrated Dashboard Header & Summary */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="h-7 w-7 text-teal-600" /> My Schedule
            </h1>
            <p className="text-gray-500 text-sm ml-9">
              Currently managing{' '}
              <span className="font-bold text-teal-700">{appointments.length}</span> patient
              appointments
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {/* Total Stat */}
            <div className="flex flex-col items-center justify-center p-4 bg-teal-50/50 rounded-xl border border-teal-100/50">
              <span className="text-2xl font-black text-teal-700">{appointments.length}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-teal-600/70">
                Total
              </span>
            </div>

            {/* Confirmed Stat */}
            <div className="flex flex-col items-center justify-center p-4 bg-green-50/50 rounded-xl border border-green-100/50">
              <span className="text-2xl font-black text-green-700">
                {appointments.filter((apt) => apt.status === 'Confirmed').length}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-green-600/70">
                Confirmed
              </span>
            </div>

            {/* Pending Stat */}
            <div className="flex flex-col items-center justify-center p-4 bg-amber-50/50 rounded-xl border border-amber-100/50">
              <span className="text-2xl font-black text-amber-700">
                {appointments.filter((apt) => apt.status === 'Pending').length}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600/70">
                Pending
              </span>
            </div>

            {/* Revenue Stat */}
            <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-2xl font-black text-gray-900">
                KSh{' '}
                {appointments
                  .reduce((t, a) => t + parseFloat(a.totalAmount || '0'), 0)
                  .toLocaleString()}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                Revenue
              </span>
            </div>
          </div>
        </div>
      </div>

      <ChangeStatus appointment={appointmentToChangeStatus} refetch={refetch} />
      <UpdateAppointment appointment={selectedAppointment} refetch={refetch} />

      {/* Appointments Grid */}
      {appointments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {appointments.map((appointment: TDetailedAppointment) => (
            <AppointmentCard
              key={appointment.appointmentId}
              appointment={appointment}
              onEdit={handleEdit}
              onChangeStatus={handleChangeStatus}
              getStatusColor={getStatusColor}
              formatTimeSlot={formatTimeSlot}
              currentTime={currentTime}
            />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-16 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">No appointments scheduled for today.</p>
        </div>
      )}
    </div>
  );
};

// ... AppointmentCard Component remains the same as your updated version ...
const AppointmentCard = ({ appointment, onEdit, onChangeStatus, getStatusColor, formatTimeSlot, currentTime }: any) => {
  const isConfirmed = appointment.status === 'Confirmed';
  const hasLink = !!appointment.videoUrl;

  // Logic to check if the session is happening now
  const isLiveNow = () => {
    if (!isConfirmed) return false;
    const [h, m] = appointment.timeSlot.split(':').map(Number);
    const aptDate = new Date(appointment.appointmentDate);
    aptDate.setHours(h, m, 0);
    const diff = (aptDate.getTime() - currentTime.getTime()) / (1000 * 60);
    return diff <= 10 && diff >= -45; // 10 mins before to 45 mins after
  };

  const isLive = isLiveNow();

  return (
    <div className={`bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden flex flex-col ${isLive ? 'border-teal-500 shadow-teal-100 shadow-xl' : 'border-gray-100 shadow-sm'}`}>
      <div className={`p-4 border-b flex justify-between items-center ${isLive ? 'bg-teal-50' : 'bg-gray-50'}`}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-gray-400">APPOINTMENT ID #{appointment.appointmentId}</span>
          {isLive && (
            <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse flex items-center gap-1">
              <span className="w-1 h-1 bg-white rounded-full"></span> LIVE
            </span>
          )}
        </div>
        <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase ${getStatusColor(appointment.status)}`}>
          {appointment.status}
        </div>
      </div>

      <div className="p-5 flex-grow space-y-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
            <User size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{appointment.patient?.name} {appointment.patient?.lastName}</h3>
            <p className="text-xs text-gray-500">{appointment.patient?.contactPhone}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 py-3 border-y border-dashed border-gray-200">
          <div className="flex items-center gap-2 text-gray-600 text-xs font-medium">
            <Calendar size={14} /> {new Date(appointment.appointmentDate).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-xs font-medium justify-end">
            <Clock size={14} /> {formatTimeSlot(appointment.timeSlot)}
          </div>
        </div>
      </div>

      <div className="p-5 pt-0 space-y-3">
        {isConfirmed && hasLink ? (
          <button
            onClick={() => window.open(appointment.videoUrl, '_blank')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-100 transition-all active:scale-95"
          >
            <Video size={18} /> Start Consultation
          </button>
        ) : isConfirmed && !hasLink ? (
          <div className="w-full py-3 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-2">
            <Clock size={16} className="animate-spin" /> Awaiting Patient Payment...
          </div>
        ) : null}

        <div className="flex gap-2">
          <button onClick={() => onChangeStatus(appointment)} className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 rounded-lg text-xs font-bold border border-gray-200 transition-colors">
            Update Status
          </button>
          <button onClick={() => onEdit(appointment)} className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 rounded-lg text-xs font-bold border border-gray-200 transition-colors">
            Edit Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointments;
