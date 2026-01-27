import { appointmentsAPI } from '../../../../reducers/appointments/appointmentsAPI';
import {
  Edit,
  Trash2,
  Calendar,
  User,
  Stethoscope,
  Clock,
  Phone,
  Mail,
  Loader,
  Receipt,
  Search,
} from 'lucide-react';
import { useState } from 'react';
import UpdateAppointment from './UpdateAppointment';
import DeleteAppointment from './DeleteAppointment';

const AdminAppointments = () => {
  const {
    data: appointmentsData,
    isLoading,
    refetch,
  } = appointmentsAPI.useGetDetailedAppointmentsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 60000,
  });

  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [appointmentToDelete, setAppointmentToDelete] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState(''); // State for search

  const appointments = appointmentsData?.data || [];

  // FILTER LOGIC: Search by Appointment ID
  const filteredAppointments = appointments.filter((apt: any) =>
    apt.appointmentId.toString().includes(searchTerm.trim())
  );

  const handleEdit = (appointment: any) => {
    setSelectedAppointment(appointment);
    (document.getElementById('update_appointment_modal') as HTMLDialogElement)?.showModal();
  };

  const handleDelete = (appointment: any) => {
    setAppointmentToDelete(appointment);
    (document.getElementById('delete_appointment_modal') as HTMLDialogElement)?.showModal();
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-white border-green-200 text-green-600';
      case 'Pending': return 'bg-white border-yellow-200 text-yellow-600';
      case 'Cancelled': return 'bg-white border-red-200 text-red-600';
      default: return 'bg-white border-blue-200 text-blue-600';
    }
  };

  const formatTimeSlot = (timeSlot: string) => {
    const [hours, minutes] = timeSlot.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-100">
      <Loader className="animate-spin text-teal-600" size={40} />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8">
      {/* Chique Header */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-8 rounded-2xl border border-gray-100 shadow-sm gap-6">
        <div className="flex items-center gap-5">
          <div className="bg-teal-50 p-4 rounded-2xl">
            <Calendar className="h-8 w-8 text-teal-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Clinic Schedule</h1>
            <p className="text-gray-500 text-sm font-medium">Managing {filteredAppointments.length} records</p>
          </div>
        </div>
        
        {/* Search Bar Implementation */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-500" size={18} />
          <input 
            type="text" 
            placeholder="Search Appointment ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-teal-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 ring-teal-500/10 transition-all" 
          />
        </div>
      </div>

      <UpdateAppointment appointment={selectedAppointment} refetch={refetch} />
      <DeleteAppointment appointment={appointmentToDelete} refetch={refetch} />

      {/* Grid using Filtered Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAppointments.map((apt: any) => (
          <div key={apt.appointmentId} className="bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all">
            
            <div className="p-4 border-b bg-gray-50/30 flex justify-between items-center">
              <div className="flex items-center gap-2 text-gray-400">
                <Receipt size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Record #{apt.appointmentId}</span>
              </div>
              <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyles(apt.appointmentStatus)}`}>
                {apt.appointmentStatus}
              </div>
            </div>

            <div className="p-6 space-y-5 grow">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="font-black text-gray-900 text-lg uppercase leading-tight">
                    {apt.patient?.name} {apt.patient?.lastName}
                  </h3>
                  <div className="flex flex-col mt-1 gap-0.5">
                    <span className="text-xs text-gray-400 font-medium flex items-center gap-1"><Mail size={12} /> {apt.patient?.email}</span>
                    <span className="text-xs text-gray-400 font-medium flex items-center gap-1"><Phone size={12} /> {apt.patient?.contactPhone}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 py-4 border-y border-dashed border-gray-100">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={14} className="text-teal-500" />
                  <span className="text-xs font-bold uppercase">{new Date(apt.appointmentDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 justify-end">
                  <Clock size={14} className="text-teal-500" />
                  <span className="text-xs font-bold">{formatTimeSlot(apt.timeSlot)}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-50 rounded-lg">
                  <Stethoscope size={16} className="text-pink-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Doctor</p>
                  <p className="text-sm font-bold text-gray-800">Dr. {apt.doctor?.name} {apt.doctor?.lastName}</p>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Total Fee</p>
                <p className="text-2xl font-black text-gray-900">KSh {parseFloat(apt.totalAmount).toLocaleString()}</p>
              </div>
            </div>

            {/* UPDATED: Buttons matching requested color */}
            <div className="p-6 pt-0 mt-auto flex gap-3">
              <button
                onClick={() => handleEdit(apt)}
                className="flex-1 border border-teal-400 text-teal-600 bg-teal-50/30 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-teal-50 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Edit size={16} /> Edit Record
              </button>
              <button
                onClick={() => handleDelete(apt)}
                className="px-4 py-3 bg-white text-red-500 border border-red-100 rounded-2xl font-black hover:bg-red-50 transition-all active:scale-95"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Show message if search has no results */}
      {filteredAppointments.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <p className="text-gray-400 font-bold uppercase tracking-widest">No matching IDs found</p>
        </div>
      )}
    </div>
  );
};

export default AdminAppointments;