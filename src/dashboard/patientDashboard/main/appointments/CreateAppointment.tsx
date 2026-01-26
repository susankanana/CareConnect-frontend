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
];

const DEFAULT_CONSULTATION_FEE = '6500.00';

type CreateAppointmentProps = {
  refetch: () => void;
};

const CreateAppointment = ({ refetch }: CreateAppointmentProps) => {
  const user = useSelector((state: RootState) => state.user.user);
  const userId = user?.user_id;

  const [selectedDoctor, setSelectedDoctor] = useState<TDoctor | null>(null);

  const [createAppointment, { isLoading }] = appointmentsAPI.useCreateAppointmentMutation();
  const { data: doctorsData, isLoading: doctorsLoading } = doctorsAPI.useGetDoctorsQuery();

  const {
    register,
    handleSubmit,
    reset,
    watch,
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

  const formatTimeSlot = (timeSlot: string) => {
    const [hours, minutes] = timeSlot.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const isDateAvailable = (dateString: string, doctor: TDoctor) => {
    if (!doctor || !doctor.doctor?.availableDays) return false;
    const dayName = getDayName(dateString);
    return (
      Array.isArray(doctor.doctor.availableDays) && doctor.doctor.availableDays.includes(dayName)
    );
  };

  return (
    <dialog id="create_appointment_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-white w-full max-w-xs sm:max-w-2xl mx-auto rounded-lg border border-gray-200">
        <div className="bg-gradient-to-r from-teal-500 to-pink-500 -m-6 mb-6 p-6 rounded-t-lg">
          <h3 className="font-bold text-lg text-white">Book New Appointment</h3>
          <p className="text-teal-100 text-sm mt-1">Schedule your consultation with our doctors</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          data-test="create-appointment-form"
          className="flex flex-col gap-6"
        >
          {/* Doctor Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Doctor</label>
            {doctorsLoading ? (
              <p className="text-gray-500">Loading doctors...</p>
            ) : (
              <select
                data-test="doctor-select"
                {...register('doctorId', { valueAsNumber: true })}
                className="select select-bordered w-full bg-white text-gray-800 border-gray-300 focus:border-teal-500"
              >
                <option value="">Choose a doctor</option>
                {doctorsData?.data?.map((doctor: TDoctor) => (
                  <option key={doctor.doctor?.doctorId} value={doctor.doctor?.doctorId}>
                    Dr. {doctor.user?.firstName} {doctor.user?.lastName} -{' '}
                    {doctor.doctor?.specialization}
                  </option>
                ))}
              </select>
            )}
            {errors.doctorId && (
              <span className="text-sm text-red-600">{errors.doctorId.message}</span>
            )}
          </div>

          {/* Selected Doctor Info */}
          {selectedDoctor && (
            <div className="bg-teal-50 rounded-lg p-4">
              <h4 className="font-semibold text-teal-800 mb-2">Selected Doctor</h4>
              <div className="flex items-center gap-4">
                <img
                  src={selectedDoctor.user?.image_url || 'https://via.placeholder.com/400'}
                  alt={`Dr. ${selectedDoctor.user?.firstName}`}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-gray-900">
                    Dr. {selectedDoctor.user?.firstName} {selectedDoctor.user?.lastName}
                  </p>
                  <p className="text-sm text-teal-600">{selectedDoctor.doctor?.specialization}</p>
                  <p className="text-sm text-gray-600">
                    Available: {selectedDoctor.doctor?.availableDays?.join(', ') || 'Not specified'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Date</label>
            <input
              data-test="appointment-date-input"
              type="date"
              {...register('appointmentDate')}
              min={new Date().toISOString().split('T')[0]}
              className="input input-bordered w-full bg-white text-gray-800 border-gray-300 focus:border-teal-500"
            />
            {errors.appointmentDate && (
              <span className="text-sm text-red-600">{errors.appointmentDate.message}</span>
            )}

            {selectedDoctor &&
              watchedValues.appointmentDate &&
              !isDateAvailable(watchedValues.appointmentDate, selectedDoctor) && (
                <p className="text-sm text-red-600 mt-1">
                  Doctor is not available on {getDayName(watchedValues.appointmentDate)}.
                </p>
              )}
          </div>

          {/* Time Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Slot</label>
            <select
              data-test="appointment-time-slot-select"
              {...register('timeSlot')}
              className="select select-bordered w-full bg-white text-gray-800 border-gray-300 focus:border-teal-500"
              disabled={!selectedDoctor || !watchedValues.appointmentDate}
            >
              <option value="">Select a time slot</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {formatTimeSlot(slot)}
                </option>
              ))}
            </select>
            {errors.timeSlot && (
              <span className="text-sm text-red-600">{errors.timeSlot.message}</span>
            )}
          </div>

          {/* Consultation Fee */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">Consultation Fee</span>
              <span className="text-2xl font-bold text-teal-600">
                KSh {parseFloat(DEFAULT_CONSULTATION_FEE).toFixed(2)}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">Payment due at appointment</p>
          </div>

          {/* Actions */}
          <div className="modal-action">
            <button
              data-test="submit-appointment-btn"
              type="submit"
              className="btn bg-teal-600 hover:bg-teal-700 text-white border-none"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm" /> Booking...
                </>
              ) : (
                'Book Appointment'
              )}
            </button>
            <button
              data-test="cancel-appointment-btn"
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                (document.getElementById('create_appointment_modal') as HTMLDialogElement)?.close();
                reset();
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default CreateAppointment;
