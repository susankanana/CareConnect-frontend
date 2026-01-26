import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  appointmentsAPI,
  type AppointmentStatus,
  type TDetailedAppointment,
} from '../../../../../src/reducers/appointments/appointmentsAPI';
import { toast } from 'sonner';

type UpdateAppointmentProps = {
  appointment: TDetailedAppointment | null;
  refetch: () => void;
};

type UpdateAppointmentInputs = {
  appointmentDate: string;
  timeSlot: string;
  appointmentStatus: AppointmentStatus;
  totalAmount: number;
};

const schema: yup.ObjectSchema<UpdateAppointmentInputs> = yup.object({
  appointmentDate: yup.string().required('Appointment date is required'),
  timeSlot: yup.string().required('Time slot is required'),
  appointmentStatus: yup
    .string()
    .oneOf(['Pending', 'Confirmed', 'Cancelled'])
    .required('Status is required'),
  totalAmount: yup
    .number()
    .typeError('Total amount must be a number')
    .positive('Total amount must be positive')
    .required('Total amount is required'),
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

const UpdateAppointment = ({ appointment, refetch }: UpdateAppointmentProps) => {
  const [updateAppointment, { isLoading }] = appointmentsAPI.useUpdateAppointmentMutation({
    fixedCacheKey: 'updateAppointment',
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UpdateAppointmentInputs>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (appointment) {
      setValue('appointmentDate', appointment.appointmentDate?.slice(0, 10) || '');
      setValue('timeSlot', appointment.timeSlot || '');
      setValue('appointmentStatus', appointment.status || 'Pending');
      setValue('totalAmount', parseFloat(appointment.totalAmount) || 0);
    } else {
      reset();
    }
  }, [appointment, setValue, reset]);

  const onSubmit: SubmitHandler<UpdateAppointmentInputs> = async (data) => {
    try {
      if (!appointment) {
        toast.error('No appointment selected for update.');
        return;
      }

      const payload = {
        ...data,
        totalAmount: data.totalAmount.toString(),
        id: appointment.appointmentId,
      };

      await updateAppointment(payload).unwrap();
      toast.success('Appointment updated successfully!');
      refetch();
      reset();
      (document.getElementById('update_appointment_modal') as HTMLDialogElement)?.close();
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('Failed to update appointment. Please try again.');
    }
  };

  const formatTimeSlot = (timeSlot: string) => {
    const [hours, minutes] = timeSlot.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <dialog id="update_appointment_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg border border-gray-200">
        <div className="bg-gradient-to-r from-teal-500 to-pink-500 -m-6 mb-6 p-6 rounded-t-lg">
          <h3 className="font-bold text-lg text-white">Update Appointment</h3>
          <p className="text-teal-100 text-sm mt-1">
            Patient: {appointment?.patient?.name} {appointment?.patient?.lastName}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Date</label>
            <input
              data-test="appointment-date-input"
              type="date"
              {...register('appointmentDate')}
              className="input input-bordered w-full bg-white text-gray-800 border-gray-300 focus:border-teal-500"
            />
            {errors.appointmentDate && (
              <span className="text-sm text-red-600 mt-1">{errors.appointmentDate.message}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Slot</label>
            <select
              data-test="time-slot-select"
              {...register('timeSlot')}
              className="select select-bordered w-full bg-white text-gray-800 border-gray-300 focus:border-teal-500"
            >
              <option value="">Select time slot</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {formatTimeSlot(slot)}
                </option>
              ))}
            </select>
            {errors.timeSlot && (
              <span className="text-sm text-red-600 mt-1">{errors.timeSlot.message}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              data-test="appointment-status-select"
              {...register('appointmentStatus')}
              className="select select-bordered w-full bg-white text-gray-800 border-gray-300 focus:border-teal-500"
            >
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            {errors.appointmentStatus && (
              <span className="text-sm text-red-600 mt-1">{errors.appointmentStatus.message}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Amount (KSh)
            </label>
            <input
              data-test="total-amount-input"
              type="number"
              step="0.01"
              {...register('totalAmount')}
              placeholder="6500.00"
              className="input input-bordered w-full bg-white text-gray-800 border-gray-300 focus:border-teal-500"
            />
            {errors.totalAmount && (
              <span className="text-sm text-red-600 mt-1">{errors.totalAmount.message}</span>
            )}
          </div>

          <div className="modal-action">
            <button
              data-test="update-appointment-submit"
              type="submit"
              className="btn bg-teal-600 hover:bg-teal-700 text-white border-none"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm" /> Updating...
                </>
              ) : (
                'Update Appointment'
              )}
            </button>
            <button
              data-test="update-appointment-cancel"
              className="btn btn-ghost"
              type="button"
              onClick={() => {
                (document.getElementById('update_appointment_modal') as HTMLDialogElement)?.close();
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

export default UpdateAppointment;
