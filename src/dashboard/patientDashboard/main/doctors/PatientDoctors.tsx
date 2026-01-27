import { useState, useEffect } from 'react';
import { doctorsAPI, type TDoctor } from '../../../../reducers/doctors/doctorsAPI';
import {
  Search,
  Stethoscope,
  Star,
  Calendar,
  Mail,
  MapPin,
} from 'lucide-react';
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

const timeSlots = ['09:00:00', '10:00:00', '11:00:00', '14:00:00', '15:00:00', '16:00:00'];
const DEFAULT_FEE = '6500.00';

const PatientDoctors = () => {
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

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateAppointmentInputs>({
    resolver: yupResolver(appointmentSchema),
  });

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
            {/* RESTORED: Doctor Image */}
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
              {/* RESTORED: Specialization and Doctor Name */}
              <p className="text-teal-600 font-black text-[10px] uppercase tracking-widest mb-1">
                {doc.doctor.specialization}
              </p>
              <h2 className="text-xl font-black text-gray-900 mb-2">
                Dr. {doc.user.firstName} {doc.user.lastName}
              </h2>

              {/* Rating */}
              <div className="flex items-center justify-center gap-1 text-gray-900 font-black mb-4">
                <Star size={16} className="fill-yellow-400 text-yellow-400" />
                {doc.doctor.rating || '5.0'}
              </div>

              {/* Contact & Availability Info */}
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

                  {/* Horizontal Scroll Container */}
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

              {/* Stats */}
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

              {/* Teal Action Button */}
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
      <dialog id="booking_modal" className="modal backdrop:backdrop-blur-sm">
        <div className="modal-box p-0 rounded-[2.5rem] bg-white overflow-hidden max-w-2xl">
          {/* Header Gradient */}
          <div className="bg-linear-to-r from-teal-500 to-pink-500 p-8 text-white">
            <h3 className="text-2xl font-black">Book New Appointment</h3>
            <p className="text-teal-50/80 font-medium">
              Schedule your consultation with our doctors
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
            <div className="space-y-6">
              <div>
                <label className="text-sm font-black text-gray-700 mb-2 block">Select Doctor</label>
                <select
                  className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-teal-500 font-bold"
                  disabled
                >
                  <option>
                    Dr. {doctorToBook?.user.firstName} {doctorToBook?.user.lastName} -{' '}
                    {doctorToBook?.doctor.specialization}
                  </option>
                </select>
              </div>

              {/* Selected Doctor Preview Card */}
              {doctorToBook && (
                <div className="bg-teal-50/50 border border-teal-100 p-5 rounded-2xl flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm">
                    <img
                      src={doctorToBook.user.image_url || 'https://via.placeholder.com/150'}
                      className="w-full h-full object-cover"
                      alt="Doctor"
                    />
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900">
                      Dr. {doctorToBook.user.firstName} {doctorToBook.user.lastName}
                    </h4>
                    <p className="text-teal-600 text-xs font-bold">
                      {doctorToBook.doctor.specialization}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Available: {doctorToBook.doctor.availableDays?.join(', ')}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black text-gray-400 uppercase ml-1">
                    Appointment Date
                  </label>
                  <input
                    type="date"
                    {...register('appointmentDate')}
                    className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-teal-500 font-bold"
                  />
                  {errors.appointmentDate && (
                    <p className="text-red-500 text-[10px] font-bold ml-1 uppercase">
                      {errors.appointmentDate.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black text-gray-400 uppercase ml-1">
                    Time Slot
                  </label>
                  <select
                    {...register('timeSlot')}
                    className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-teal-500 font-bold appearance-none"
                  >
                    <option value="">Select Time</option>
                    {timeSlots.map((t) => (
                      <option key={t} value={t}>
                        {t.substring(0, 5)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-3xl flex items-center justify-between border border-gray-100">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase">Consultation Fee</p>
                <p className="text-2xl font-black text-teal-600">
                  KSh {parseFloat(DEFAULT_FEE).toLocaleString()}
                </p>
                <p className="text-[10px] text-gray-400 font-bold">Payment due at appointment</p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-4 font-bold text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isBookingLoading}
                  className="bg-teal-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-teal-700 transition-all shadow-lg shadow-teal-100 disabled:opacity-50"
                >
                  {isBookingLoading ? 'Processing...' : 'Book Appointment'}
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
