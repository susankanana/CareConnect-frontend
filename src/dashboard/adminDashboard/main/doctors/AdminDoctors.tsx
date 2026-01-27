import { doctorsAPI, type TDoctor } from '../../../../reducers/doctors/doctorsAPI';
import {
  Edit,
  Trash2,
  Stethoscope,
  Star,
  CheckCircle,
  XCircle,
  Plus,
  Phone,
  Mail,
  Calendar,
  Search,
  Loader,
} from 'lucide-react';
import { useState } from 'react';
import InsertDoctor from './InsertDoctor';
import UpdateDoctor from './UpdateDoctor';
import DeleteDoctor from './DeleteDoctor';

const AdminDoctors = () => {
  const {
    data: doctorsData,
    isLoading,
    error,
    refetch,
  } = doctorsAPI.useGetDoctorsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 60000,
  });

  const [selectedDoctor, setSelectedDoctor] = useState<TDoctor | null>(null);
  const [doctorToDelete, setDoctorToDelete] = useState<TDoctor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const doctors = doctorsData?.data || [];

  const filteredDoctors = doctors.filter((doc: TDoctor) => 
    `${doc.user.firstName} ${doc.user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (doctor: TDoctor) => {
    setSelectedDoctor(doctor);
    (document.getElementById('update_doctor_modal') as HTMLDialogElement)?.showModal();
  };

  const handleDelete = (doctor: TDoctor) => {
    setDoctorToDelete(doctor);
    (document.getElementById('delete_doctor_modal') as HTMLDialogElement)?.showModal();
  };

  if (isLoading) return (
    <div className="flex flex-col justify-center items-center min-h-[400px]">
      <Loader className="animate-spin text-teal-600" size={40} />
      <p className="text-gray-500 font-bold mt-4">Loading Medical Staff...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-10">
      {/* Chique Header */}
      <div className="flex flex-col lg:flex-row justify-between items-center bg-white p-8 rounded-3xl border border-gray-100 shadow-sm gap-6">
        <div className="flex items-center gap-5">
          <div className="bg-teal-50 p-4 rounded-2xl">
            <Stethoscope className="h-8 w-8 text-teal-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tighter">Medical Directory</h1>
            <p className="text-gray-400 text-sm font-semibold">Manage your specialized clinical team</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-500" size={18} />
            <input 
              type="text" 
              placeholder="Search name or specialty..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-semibold outline-none focus:ring-2 ring-teal-500/10" 
            />
          </div>
          <button
            className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-100 active:scale-95"
            onClick={() => (document.getElementById('create_doctor_modal') as HTMLDialogElement)?.showModal()}
          >
            <Plus size={20} /> Add Specialist
          </button>
        </div>
      </div>

      <InsertDoctor refetch={refetch} />
      <UpdateDoctor doctor={selectedDoctor} refetch={refetch} />
      <DeleteDoctor doctor={doctorToDelete} refetch={refetch} />

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredDoctors.map((doctor: TDoctor) => (
          <div key={doctor.doctor.doctorId} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-xl transition-all group">
            
            {/* Top Profile Section */}
            <div className="h-44 bg-gradient-to-br from-teal-50 to-pink-50 flex items-center justify-center relative">
              <img
                src={doctor.user.image_url || 'https://via.placeholder.com/400'}
                alt={doctor.user.firstName}
                className="w-28 h-28 rounded-3xl object-cover border-4 border-white shadow-xl group-hover:scale-105 transition-transform"
              />
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border bg-white shadow-sm ${
                  doctor.user.isVerified ? 'border-green-200 text-green-600' : 'border-amber-200 text-amber-600'
                }`}>
                  {doctor.user.isVerified ? 'Verified' : 'Pending'}
                </span>
              </div>
            </div>

            <div className="p-8 space-y-6 grow text-center">
              <div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">
                  Dr. {doctor.user.firstName} {doctor.user.lastName}
                </h3>
                <p className="text-teal-600 font-bold text-sm uppercase tracking-wider mt-1">{doctor.doctor.specialization}</p>
                {doctor.doctor.rating && (
                  <div className="flex items-center justify-center gap-1 mt-2 text-amber-500">
                    <Star size={14} fill="currentColor" />
                    <span className="text-sm font-black">{doctor.doctor.rating}</span>
                  </div>
                )}
              </div>

              <div className="space-y-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-100 text-left">
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail size={14} className="text-pink-500" />
                  <span className="text-xs font-bold truncate">{doctor.user.email.toLowerCase()}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone size={14} className="text-pink-500" />
                  <span className="text-xs font-bold">{doctor.user.contactPhone}</span>
                </div>
              </div>

              {/* Availability */}
              <div className="text-left">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Calendar size={12} /> Rotation Days
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {doctor.doctor.availableDays?.map((day, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-white border border-teal-100 text-teal-600 text-[10px] font-bold rounded-lg uppercase">
                      {day.substring(0, 3)}
                    </span>
                  )) || <span className="text-gray-400 text-xs">Schedule not set</span>}
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-teal-50/50 rounded-2xl p-3 border border-teal-50">
                  <p className="text-lg font-black text-teal-700">{doctor.doctor.experience || 0}</p>
                  <p className="text-[9px] font-bold text-teal-600 uppercase tracking-tighter">Years Exp.</p>
                </div>
                <div className="bg-pink-50/50 rounded-2xl p-3 border border-pink-50">
                  <p className="text-lg font-black text-pink-700">{doctor.doctor.patients || 0}</p>
                  <p className="text-[9px] font-bold text-pink-600 uppercase tracking-tighter">Patients</p>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-8 pt-0 mt-auto flex gap-3">
              <button
                onClick={() => handleEdit(doctor)}
                className="flex-1 border border-teal-400 text-teal-600 bg-teal-50/30 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-teal-600 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <Edit size={14} /> Profile
              </button>
              <button
                onClick={() => handleDelete(doctor)}
                className="px-5 py-3 bg-white text-red-500 border border-red-100 rounded-2xl hover:bg-red-50 transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Footer: Custom Deep Teal Gradient */}
      <div className="bg-gradient-to-r from-[#004d4d] to-[#006666] rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl -mr-40 -mt-40"></div>
        <h3 className="text-xl font-black mb-10 flex items-center gap-3 tracking-tighter uppercase">
          <div className="w-1.5 h-6 bg-teal-400 rounded-full"></div> 
          Staff Intelligence
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Total Doctors', value: doctors.length, color: 'text-white' },
            { label: 'Verified Staff', value: doctors.filter(d => d.user.isVerified).length, color: 'text-teal-300' },
            { label: 'Departments', value: new Set(doctors.map(d => d.doctor.specialization)).size, color: 'text-pink-300' },
            { label: 'Avg Satisfaction', value: '4.8★', color: 'text-amber-300' }
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10">
              <p className="text-[10px] font-bold text-teal-100/60 uppercase tracking-widest mb-2">{stat.label}</p>
              <div className={`text-2xl font-black ${stat.color} tracking-tight`}>{stat.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDoctors;