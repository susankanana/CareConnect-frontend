// [imports stay unchanged]
import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../app/store';
import { appointmentsAPI } from '../../../../reducers/appointments/appointmentsAPI';
import { doctorsAPI, type TDoctor } from '../../../../reducers/doctors/doctorsAPI';
import { toast } from 'sonner';

type CreateAppointmentInputs = {
  doctorId: number;
  appointmentDate: string;
  timeSlot: string;
};

const schema = yup.object({
  doctorId: yup.number().required('Please select a doctor'),
  appointmentDate: yup
    .string()
    .required('Appointment date is required')
    .test('future-date', 'Appointment date must be in the future', function (value) {
      if (!value) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const appointmentDate = new Date(value);
      return appointmentDate >= today;
    }),
  timeSlot: yup.string().required('Please select a time slot'),
});

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
  '20:00:00',
  '20:30:00',
  '21:00:00',
  '21:30:00',
  '22:00:00',
];

const DEFAULT_CONSULTATION_FEE = '6500.00';

type CreateAppointmentProps = {
  refetch: () => void;
};
const SLOT_DURATION_MINUTES = 30;

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

  // Only disable past times IF date is today
  const isToday = new Date(date).toDateString() === now.toDateString();

  return isToday && slotTime <= now;
};

const CreateAppointment = ({ refetch }: CreateAppointmentProps) => {
  const user = useSelector((state: RootState) => state.user.user);
  const userId = user?.user_id;

  const [selectedDoctor, setSelectedDoctor] = useState<TDoctor | null>(null);

  const [createAppointment, { isLoading }] = appointmentsAPI.useCreateAppointmentMutation();
  const { data: doctorsData, isLoading: doctorsLoading } = doctorsAPI.useGetDoctorsQuery();
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateAppointmentInputs>({
    resolver: yupResolver(schema),
  });

  const watchedValues = watch();

  useEffect(() => {
    if (watchedValues.doctorId && doctorsData?.data) {
      const doctor = doctorsData.data.find(
        (d) => d.doctor?.doctorId === Number(watchedValues.doctorId)
      );
      setSelectedDoctor(doctor || null);
    }
  }, [watchedValues.doctorId, doctorsData]);

  const onSubmit: SubmitHandler<CreateAppointmentInputs> = async (data) => {
    try {
      if (!userId) {
        toast.error('User ID not found. Please login again.');
        return;
      }

      const payload = {
        ...data,
        userId,
        doctorId: Number(data.doctorId),
        totalAmount: DEFAULT_CONSULTATION_FEE,
      };

      await createAppointment(payload).unwrap();
      toast.success('Appointment booked successfully!');
      reset();
      refetch();
      (document.getElementById('create_appointment_modal') as HTMLDialogElement)?.close();
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error('Failed to book appointment. Please try again.');
    }
  };

  return (
    <dialog id="create_appointment_modal" className="modal backdrop-blur-sm bg-[#003d3d]/40">
      <div className="modal-box bg-white w-full max-w-2xl p-0 overflow-hidden rounded-[40px] border-none shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Fixed Header */}
        <div className="bg-linear-to-r from-[#14b8a6] to-[#e91e63] p-8 text-white shrink-0">
          <h3 className="font-black text-2xl tracking-tight lowercase">book new appointment</h3>
          <p className="text-white/80 text-sm font-medium">schedule your consultation with our doctors</p>
        </div>

        {/* Scrollable Form Body */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col overflow-hidden"
        >
          <div className="p-8 pt-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
            {/* Doctor Selection */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">select doctor</label>
              {doctorsLoading ? (
                <p className="text-gray-500 animate-pulse">loading doctors...</p>
              ) : (
                <select
                  {...register('doctorId', { valueAsNumber: true })}
                  className="select select-bordered w-full bg-gray-50 border-gray-200 rounded-2xl text-[#003d3d] font-bold focus:border-[#14b8a6]"
                >
                  <option value="">choose a doctor</option>
                  {doctorsData?.data?.map((doctor: TDoctor) => (
                    <option key={doctor.doctor?.doctorId} value={doctor.doctor?.doctorId}>
                      Dr. {doctor.user?.firstName} {doctor.user?.lastName} - {doctor.doctor?.specialization}
                    </option>
                  ))}
                </select>
              )}
              {errors.doctorId && <span className="text-xs text-red-500 font-bold">{errors.doctorId.message}</span>}
            </div>

            {/* Doctor Info Card */}
            {selectedDoctor && (
              <div className="bg-[#f8fafc] border border-gray-100 rounded-[30px] p-5 flex items-center gap-4">
                <img
                  src={selectedDoctor.user?.image_url || 'https://via.placeholder.com/400'}
                  alt="doctor"
                  className="w-16 h-16 rounded-[20px] object-cover shadow-sm"
                />
                <div className="space-y-0.5">
                  <p className="font-black text-[#003d3d] lowercase text-lg leading-tight">
                    dr. {selectedDoctor.user?.firstName} {selectedDoctor.user?.lastName}
                  </p>
                  <p className="text-sm text-[#14b8a6] font-bold lowercase">{selectedDoctor.doctor?.specialization}</p>
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                    available: {selectedDoctor.doctor?.availableDays?.join(', ')}
                  </p>
                </div>
              </div>
            )}

            {/* Grid for Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">date</label>
                <input
                  type="date"
                  {...register('appointmentDate')}
                  className="input input-bordered w-full bg-gray-50 border-gray-200 rounded-2xl font-bold text-[#003d3d]"
                />
              </div>

            <div className="relative">
  <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">time slot</label>
  <button
    type="button"
    className="input input-bordered w-full text-left bg-gray-50 border-gray-200 rounded-2xl font-bold text-[#003d3d] flex justify-between items-center"
    disabled={!selectedDoctor || !watchedValues.appointmentDate}
    onClick={() => setTimeDropdownOpen(!timeDropdownOpen)}
  >
    {watchedValues.timeSlot ? getTimeRangeLabel(watchedValues.timeSlot) : 'select time'}
    <span className={`transition-transform ${timeDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
  </button>
  
  {timeDropdownOpen && (
    /* Changed to fixed and added a calculation for positioning or used a higher z-index */
    <div className="absolute left-0 right-0 z-100 mt-2 rounded-2xl border border-gray-100 bg-white shadow-2xl max-h-48 overflow-y-auto p-2">
      {timeSlots.map((slot) => {
        const disabled = isPastTimeSlot(watchedValues.appointmentDate, slot);
        return (
          <button
            key={slot}
            type="button"
            disabled={disabled}
            onClick={() => {
              if (!disabled) {
                setValue('timeSlot', slot);
                setTimeDropdownOpen(false);
              }
            }}
            className={`w-full px-4 py-2 text-left text-sm font-bold rounded-lg mb-1 transition
              ${disabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-teal-50 text-[#003d3d]'}
            `}
          >
            {getTimeRangeLabel(slot)}
          </button>
        );
      })}
    </div>
  )}
</div>
            </div>

            {/* Fee Section (Now inside the scrollable area) */}
            <div className="bg-[#003d3d] rounded-[25px] p-6 text-white flex justify-between items-center shadow-lg">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-teal-400">consultation fee</span>
                <p className="text-xs text-white/60 lowercase">due at appointment</p>
              </div>
              <span className="text-2xl font-black">KSh {parseFloat(DEFAULT_CONSULTATION_FEE).toLocaleString()}</span>
            </div>
          </div>

          {/* Fixed Actions Footer */}
          <div className="p-8 border-t border-gray-100 flex gap-3 shrink-0 bg-white">
            <button
              type="submit"
              className="btn flex-1 bg-linear-to-r from-[#14b8a6] to-[#e91e63] border-none text-white rounded-2xl font-black lowercase text-lg shadow-lg shadow-teal-100/20"
              disabled={isLoading}
            >
              {isLoading ? <span className="loading loading-spinner" /> : 'book appointment'}
            </button>
            <button
              type="button"
              className="btn btn-ghost lowercase font-bold text-gray-400"
              onClick={() => {
                (document.getElementById('create_appointment_modal') as any)?.close();
                reset();
              }}
            >
              cancel
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default CreateAppointment;
