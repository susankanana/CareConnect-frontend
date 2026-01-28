import { useState, useEffect } from 'react';
import { doctorsAPI, type TDoctor } from '../../../../reducers/doctors/doctorsAPI';
import { Search, Stethoscope, Star, Calendar, Mail, MapPin, ChevronDown } from 'lucide-react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../app/store';
import { appointmentsAPI } from '../../../../reducers/appointments/appointmentsAPI';
import { toast } from 'sonner';

// --- Types & Schema ---
type CreateAppointmentInputs = {
  doctorId: number;
  appointmentDate: string;
  timeSlot: string;
};

const appointmentSchema = yup.object({
  doctorId: yup.number().required('Please select a doctor'),
  appointmentDate: yup
    .string()
    .required('Date is required')
    .test('future-date', 'Date must be in the future', (v) => {
      if (!v) return false;
      const selectedDate = new Date(v).getTime();
      const today = new Date().setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }),
  timeSlot: yup.string().required('Please select a time slot'),
});

// 1. Constants and Helpers from your reference
const SLOT_DURATION_MINUTES = 30;
const timeSlots = [
  '09:00:00',
  '09:30:00',
  '10:00:00',
  '10:30:00',
  '11:00:00',
  '11:30:00',
  '14:00:00',
  '14:30:00',
  '15:00:00',
  '15:30:00',
  '16:00:00',
  '16:30:00',
  '17:00:00',
  '17:30:00',
  '18:00:00',
  '18:30:00',
  '19:00:00',
  '19:30:00',
];

// Helper for time ranges
const getTimeRangeLabel = (timeSlot: string) => {
  const [h, m] = timeSlot.split(':').map(Number);
  const start = new Date();
  start.setHours(h, m, 0, 0);
  const end = new Date(start);
  end.setMinutes(start.getMinutes() + SLOT_DURATION_MINUTES);
  const formatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  return `${formatter.format(start)} – ${formatter.format(end)}`;
};

const isPastTimeSlot = (date: string, timeSlot: string) => {
  if (!date) return false;
  const now = new Date();
  const [h, m] = timeSlot.split(':').map(Number);
  const slotTime = new Date(date);
  slotTime.setHours(h, m, 0, 0);
  const isToday = new Date(date).toDateString() === now.toDateString();
  return isToday && slotTime <= now;
};

const getDayName = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', { weekday: 'long' });
};

const isDateAvailable = (dateString: string, doctor: any) => {
  if (!doctor?.doctor?.availableDays) return false;
  const dayName = getDayName(dateString);
  return (
    Array.isArray(doctor.doctor.availableDays) && doctor.doctor.availableDays.includes(dayName)
  );
};
const DEFAULT_FEE = '6500.00';

const PatientDoctors = () => {
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [doctorToBook, setDoctorToBook] = useState<TDoctor | null>(null);

  const user = useSelector((state: RootState) => state.user.user);
  const userId = user?.user_id;

  const { data: doctorsData, isLoading } = doctorsAPI.useGetDoctorsQuery();
  const { data: specData } = doctorsAPI.useGetDoctorBySpecializationQuery(selectedSpecialization, {
    skip: !selectedSpecialization,
  });
  const [createAppointment, { isLoading: isBookingLoading }] =
    appointmentsAPI.useCreateAppointmentMutation();

  const { register, handleSubmit, reset, setValue, watch } = useForm<CreateAppointmentInputs>({
    resolver: yupResolver(appointmentSchema),
  });
  const watchedDate = watch('appointmentDate');
  const watchedTime = watch('timeSlot');

  useEffect(() => {
    if (doctorToBook) setValue('doctorId', doctorToBook.doctor.doctorId);
  }, [doctorToBook, setValue]);

  const specializations = doctorsData?.data
    ? [...new Set(doctorsData.data.map((d) => d.doctor.specialization))]
    : [];

  const filteredDoctors = () => {
    let doctors = selectedSpecialization ? specData?.data || [] : doctorsData?.data || [];
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      doctors = doctors.filter(
        (d) =>
          d.user.firstName.toLowerCase().includes(s) ||
          d.user.lastName.toLowerCase().includes(s) ||
          d.doctor.specialization.toLowerCase().includes(s)
      );
    }
    return doctors;
  };

  const handleBookClick = (doctor: TDoctor) => {
    setDoctorToBook(doctor);
    (document.getElementById('booking_modal') as HTMLDialogElement)?.showModal();
  };

  const onSubmit: SubmitHandler<CreateAppointmentInputs> = async (data) => {
    try {
      if (!userId) return toast.error('Session expired. Please login.');
      await createAppointment({ ...data, userId, totalAmount: DEFAULT_FEE }).unwrap();
      toast.success('Appointment booked!');
      handleCloseModal();
    } catch (e) {
      toast.error('Booking failed. Slot might be taken.');
    }
  };

  const handleCloseModal = () => {
    setDoctorToBook(null);
    reset();
    (document.getElementById('booking_modal') as HTMLDialogElement)?.close();
  };

  if (isLoading)
    return (
      <div className="flex justify-center p-20">
        <span className="loading loading-spinner text-teal-600 w-12"></span>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 bg-gray-50/50">
      {/* Search Header */}
      <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-teal-600 p-3 rounded-2xl text-white shadow-lg shadow-teal-100">
            <Stethoscope size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">Find Specialists</h1>
            <p className="text-gray-500 text-sm font-medium">Book your consultation in minutes</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name..."
              className="pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl w-full focus:ring-2 focus:ring-teal-500 outline-none"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="bg-gray-50 border-none rounded-2xl px-6 py-3 outline-none focus:ring-2 focus:ring-teal-500 font-bold text-gray-700"
            onChange={(e) => setSelectedSpecialization(e.target.value)}
          >
            <option value="">All Specialties</option>
            {specializations.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Doctor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredDoctors().map((doc) => (
          <div
            key={doc.doctor.doctorId}
            className="bg-white rounded-4xl border border-gray-100 p-2 shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="relative h-48 bg-gray-50 rounded-[1.8rem] overflow-hidden mb-4">
              <img
                src={doc.user.image_url || 'https://via.placeholder.com/400'}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                alt={`Dr. ${doc.user.firstName}`}
              />
              {doc.user.isVerified && (
                <div className="absolute top-4 right-4 bg-teal-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg">
                  Verified
                </div>
              )}
            </div>

            <div className="px-6 pb-6 text-center">
              <p className="text-teal-600 font-black text-[10px] uppercase tracking-widest mb-1">
                {doc.doctor.specialization}
              </p>
              <h2 className="text-xl font-black text-gray-900 mb-2">
                Dr. {doc.user.firstName} {doc.user.lastName}
              </h2>

              <div className="flex items-center justify-center gap-1 text-gray-900 font-black mb-4">
                <Star size={16} className="fill-yellow-400 text-yellow-400" />
                {doc.doctor.rating || '5.0'}
              </div>

              <div className="space-y-2 mb-4 text-left border-t border-gray-50 pt-4">
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <Mail size={14} className="text-teal-500" /> {doc.user.email}
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <MapPin size={14} className="text-teal-500" /> {doc.user.address || 'Eldoret'}
                </div>
                <div className="mt-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 text-left">
                    Available Days
                  </p>
                  <div className="flex flex-nowrap gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {doc.doctor.availableDays?.map((day) => (
                      <span
                        key={day}
                        className="inline-block whitespace-nowrap px-4 py-1.5 bg-teal-50 text-teal-700 rounded-full text-[10px] font-bold border border-teal-100 shrink-0"
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-6">
                <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                  <span className="block text-xs font-bold text-gray-400 uppercase">
                    Experience
                  </span>
                  <span className="text-md font-black text-gray-900">
                    {doc.doctor.experience || 0} Yrs
                  </span>
                </div>
                <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                  <span className="block text-xs font-bold text-gray-400 uppercase">Patients</span>
                  <span className="text-md font-black text-gray-900">
                    {doc.doctor.patients || 0}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleBookClick(doc)}
                className="w-full bg-teal-600 text-white py-4 rounded-2xl font-black hover:bg-teal-700 transition-all shadow-lg shadow-teal-100 active:scale-95 flex items-center justify-center gap-2"
              >
                <Calendar size={18} /> Book Appointment
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}

      <dialog id="booking_modal" className="modal modal-middle backdrop:backdrop-blur-sm">
        <div className="modal-box p-0 rounded-[2.5rem] bg-white overflow-hidden max-w-2xl w-[95%] max-h-[90vh] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="bg-linear-to-r from-teal-500 to-pink-500 p-8 text-white shrink-0">
            <h3 className="text-2xl font-black">Book New Appointment</h3>
            <p className="text-teal-50/80 font-medium lowercase">
              Schedule your consultation with our doctors
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col overflow-hidden h-full">
            <div className="p-8 space-y-6 overflow-y-auto flex-1">
              {/* Doctor Selection (ReadOnly in Modal) */}
              <div>
                <label className="text-xs font-black text-gray-400 uppercase ml-1 mb-2 block">
                  Select Doctor
                </label>
                <select
                  className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-200 font-bold appearance-none cursor-not-allowed"
                  disabled
                >
                  <option>
                    Dr. {doctorToBook?.user.firstName} {doctorToBook?.user.lastName} -{' '}
                    {doctorToBook?.doctor.specialization}
                  </option>
                </select>
              </div>

              {/* Doctor Info Card */}
              {doctorToBook && (
                <div className="bg-teal-50/50 border border-teal-100 p-5 rounded-3xl flex items-center gap-4">
                  <img
                    src={doctorToBook.user.image_url}
                    className="w-14 h-14 rounded-2xl object-cover shadow-sm"
                    alt="dr"
                  />
                  <div>
                    <h4 className="font-black text-gray-900 lowercase">
                      dr. {doctorToBook.user.firstName} {doctorToBook.user.lastName}
                    </h4>
                    <p className="text-teal-600 text-[10px] font-black uppercase tracking-widest">
                      {doctorToBook.doctor.specialization}
                    </p>
                    <p className="text-gray-400 text-[10px] font-bold uppercase mt-1">
                      Available: {doctorToBook.doctor.availableDays?.join(', ')}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date Picker */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase ml-1">
                    Appointment Date
                  </label>
                  <input
                    type="date"
                    {...register('appointmentDate')}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-gray-50 p-4 rounded-2xl border-2 border-transparent focus:border-teal-500 outline-none font-bold transition-all"
                  />
                  {doctorToBook && watchedDate && !isDateAvailable(watchedDate, doctorToBook) && (
                    <p className="text-[10px] text-red-500 font-black uppercase px-1">
                      Doctor not available on {getDayName(watchedDate)}
                    </p>
                  )}
                </div>

                {/* Time Slot Custom Dropdown */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase ml-1">
                    Time Slot
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-left flex justify-between items-center border-2 border-transparent hover:border-gray-200 transition-all"
                      disabled={
                        !watchedDate ||
                        (!!doctorToBook && !isDateAvailable(watchedDate, doctorToBook))
                      }
                      onClick={() => setTimeDropdownOpen(!timeDropdownOpen)}
                    >
                      <span className={watchedTime ? 'text-gray-900' : 'text-gray-400'}>
                        {watchedTime ? getTimeRangeLabel(watchedTime) : 'Select Time'}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform ${timeDropdownOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {timeDropdownOpen && (
                      <div className="absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden max-h-48 overflow-y-auto custom-scrollbar">
                        {timeSlots.map((slot) => {
                          const disabled = isPastTimeSlot(watchedDate, slot);
                          return (
                            <button
                              key={slot}
                              type="button"
                              disabled={disabled}
                              onClick={() => {
                                setValue('timeSlot', slot);
                                setTimeDropdownOpen(false);
                              }}
                              className={`w-full p-3 text-left text-xs font-bold border-b border-gray-50 last:border-0 transition-colors ${
                                disabled
                                  ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                                  : 'hover:bg-teal-50 text-gray-700'
                              }`}
                            >
                              {getTimeRangeLabel(slot)} {disabled && '(Passed)'}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <input type="hidden" {...register('timeSlot')} />
                </div>
              </div>
            </div>

            {/* footer / fee section */}
<div className="bg-gray-50 p-8 flex flex-col md:flex-row items-center justify-between gap-6 shrink-0 border-t border-gray-100">
  <div className="text-center md:text-left">
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
      consultation fee
    </p>
    <p className="text-3xl font-black text-teal-600">ksh 6,500</p>
    <p className="text-[10px] text-gray-400 font-bold uppercase">
      payment due at appointment
    </p>
  </div>
  
  <div className="flex items-center gap-8 w-full md:w-auto">
    <button
      type="button"
      onClick={handleCloseModal}
      className="text-sm font-black text-gray-500 hover:text-gray-700 transition-colors uppercase tracking-wider"
    >
      cancel
    </button>
    
    <button
      type="submit"
      disabled={isBookingLoading}
      className="flex-1 md:flex-none bg-[#00a18e] text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-[#008a7a] transition-all shadow-lg shadow-teal-100 disabled:opacity-50 active:scale-95"
    >
      {isBookingLoading ? 'processing...' : 'book appointment'}
    </button>
  </div>
</div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default PatientDoctors;
