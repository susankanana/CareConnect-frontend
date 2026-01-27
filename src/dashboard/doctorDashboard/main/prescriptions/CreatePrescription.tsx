import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

import type { RootState } from '../../../../app/store';
import { prescriptionsAPI } from '../../../../reducers/prescriptions/prescriptionsAPI';
import {
  appointmentsAPI,
  type TDetailedAppointment,
} from '../../../../reducers/appointments/appointmentsAPI';

type CreatePrescriptionInputs = {
  appointmentId: number;
  patientId: number;
  notes: string;
  amount: number;
};

const schema: yup.ObjectSchema<CreatePrescriptionInputs> = yup.object({
  appointmentId: yup
    .number()
    .positive('Appointment ID must be positive')
    .required('Appointment ID is required'),
  patientId: yup
    .number()
    .positive('Patient ID must be positive')
    .required('Patient ID is required'),
  notes: yup.string().required('Prescription notes are required'),
  amount: yup
    .number()
    .typeError('Amount must be a number')
    .positive('Amount must be positive')
    .required('Amount is required'),
});

type CreatePrescriptionProps = {
  refetch: () => void;
};

const CreatePrescription = ({ refetch }: CreatePrescriptionProps) => {
  const user = useSelector((state: RootState) => state.user.user);
  const [foundAppointment, setFoundAppointment] = useState<TDetailedAppointment | null>(null);
  const [customAppointmentError, setCustomAppointmentError] = useState<string | null>(null);
  const doctorId = user?.user_id;

  const [createPrescription, { isLoading: isCreating }] =
    prescriptionsAPI.useCreatePrescriptionMutation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    // setError, // We will manage custom error outside of RHF state for consistent display
    clearErrors,
    formState: { errors: formErrors }, // Renamed to avoid collision with local state
  } = useForm<CreatePrescriptionInputs>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const watchedAppointmentId = watch('appointmentId');

  const {
    data: doctorAppointments,
    isLoading: isLoadingAppointments,
    isFetching: isFetchingAppointments,
  } = appointmentsAPI.useGetAppointmentsByDoctorIdQuery(doctorId!, {
    skip: !doctorId,
  });

  useEffect(() => {
    setValue('patientId', 0);
    setFoundAppointment(null); // Reset foundAppointment each time ID changes
    setCustomAppointmentError(null); //Clear custom error on ID change start

    if (!doctorId) {
      // clearErrors("appointmentId"); // Let Yup handle "required" for empty/null
      return;
    }

    if (!watchedAppointmentId || watchedAppointmentId <= 0) {
      // No need to clear errors.appointmentId via clearErrors() here directly as Yup's resolver will manage its own error state.
      setCustomAppointmentError(null);
      return;
    }

    // While fetching appointments, show verifying state, not a custom error.
    if (isLoadingAppointments || isFetchingAppointments) {
      setCustomAppointmentError(null); // Ensure no custom error while verifying
      return;
    }

    // If data hasn't loaded (e.g., query skipped or failed silently before data exists)
    if (!doctorAppointments?.data) {
      setCustomAppointmentError('Unable to load appointments to verify ID. Please refresh.');
      return;
    }

    const matched = doctorAppointments.data.find(
      (appointment) => appointment.appointmentId === watchedAppointmentId
    );

    if (!matched) {
      // If no match found, set the custom error
      setCustomAppointmentError('This appointment ID does not belong to you or does not exist.');
      setFoundAppointment(null);
    } else {
      // If a match is found, ensure no custom error is set
      setCustomAppointmentError(null);
      setFoundAppointment(matched);
      setValue('patientId', matched.patient.id);
    }
  }, [
    watchedAppointmentId,
    doctorAppointments?.data,
    isFetchingAppointments,
    isLoadingAppointments,
    doctorId,
    setValue,
  ]);

  const onSubmit: SubmitHandler<CreatePrescriptionInputs> = async (data) => {
    try {
      if (!doctorId) {
        toast.error('Doctor ID not found. Please login again.');
        return;
      }

      if (!doctorAppointments?.data) {
        toast.error('Appointments data not loaded. Cannot verify ownership. Please try again.');
        return;
      }

      const foundAppointmentOnSubmit = doctorAppointments.data.find(
        (appointment: TDetailedAppointment) => appointment.appointmentId === data.appointmentId
      );

      if (!foundAppointmentOnSubmit) {
        toast.error('Error: The appointment ID does not belong to you or does not exist.');
        setCustomAppointmentError('This appointment ID does not belong to you or does not exist.');
        return;
      }

      const payload = {
        ...data,
        doctorId,
        amount: data.amount.toString(),
      };

      await createPrescription(payload).unwrap();
      toast.success('Prescription created successfully!');
      reset();
      refetch();
      (document.getElementById('create_prescription_modal') as HTMLDialogElement)?.close();
    } catch (error) {
      console.error('Error creating prescription:', error);
      toast.error('Failed to create prescription. Please try again.');
    }
  };

  // Derived UI States
  const hasYupError = !!formErrors.appointmentId?.message; // Check RHF's formErrors for Yup's messages
  const hasCustomError = !!customAppointmentError; // Check your local state for the custom message

  // An error exists if either Yup has one, OR your custom logic has one.
  const hasOverallAppointmentError = hasYupError || hasCustomError;

  const isValidatingAppointment =
    watchedAppointmentId > 0 &&
    (isLoadingAppointments || isFetchingAppointments) &&
    !hasOverallAppointmentError; // Show verifying only if no error is currently displayed

  // Form disabled if creating or if there's *any* appointment ID error.
  const isFormDisabled = isCreating || hasOverallAppointmentError;

  return (
    <dialog id="create_prescription_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg border border-gray-200">
        <div className="bg-linear-to-r from-teal-500 to-pink-500 -m-6 mb-6 p-6 rounded-t-lg">
          <h3 className="font-bold text-lg text-white">Create New Prescription</h3>
          <p className="text-teal-100 text-sm mt-1">Add a prescription for your patient</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Appointment ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Appointment ID</label>
            <input
              data-test="create-appointment-id"
              type="number"
              {...register('appointmentId', { valueAsNumber: true })}
              placeholder="Enter appointment ID"
              className="input input-bordered w-full bg-white text-gray-800 border-gray-300 focus:border-teal-500"
            />
            {isValidatingAppointment && (
              <span className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <span className="loading loading-spinner loading-xs" /> Verifying appointment
                ownership...
              </span>
            )}

            {/* Displaying error messages - prioritize custom error if present, then Yup's */}
            {!isValidatingAppointment && hasOverallAppointmentError && (
              <span className="text-sm text-red-600 flex items-center gap-1 mt-1">
                {customAppointmentError || formErrors.appointmentId?.message}
              </span>
            )}

            {/* Displaying success state (only if no errors and found) */}
            {!isValidatingAppointment && !hasOverallAppointmentError && foundAppointment && (
              <span className="text-sm text-green-600 flex items-center gap-1 mt-1">
                Valid appointment for {foundAppointment.patient.name}{' '}
                {foundAppointment.patient.lastName}
              </span>
            )}
          </div>

          {/* Patient ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
            <input
              data-test="create-patient-id"
              type="number"
              {...register('patientId', { valueAsNumber: true })}
              placeholder="Enter patient ID"
              className="input input-bordered w-full bg-white text-gray-800 border-gray-300 focus:border-teal-500"
              readOnly
              disabled={
                watchedAppointmentId === 0 ||
                hasOverallAppointmentError || // Use the overall error status here
                isLoadingAppointments ||
                isFetchingAppointments
              }
            />
            {formErrors.patientId && (
              <span className="text-sm text-red-600">{formErrors.patientId.message}</span>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prescription Notes
            </label>
            <textarea
              data-test="create-notes"
              {...register('notes')}
              placeholder="Enter detailed prescription notes, medications, dosage, etc."
              className="textarea textarea-bordered w-full bg-white text-gray-800 border-gray-300 focus:border-teal-500"
              rows={4}
            />
            {formErrors.notes && (
              <span className="text-sm text-red-600">{formErrors.notes.message}</span>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (KSh)</label>
            <input
              data-test="create-amount"
              type="number"
              step="0.01"
              {...register('amount', { valueAsNumber: true })}
              placeholder="0.00"
              className="input input-bordered w-full bg-white text-gray-800 border-gray-300 focus:border-teal-500"
            />
            {formErrors.amount && (
              <span className="text-sm text-red-600">{formErrors.amount.message}</span>
            )}
          </div>

          {/* Buttons */}
          <div className="modal-action">
            <button
              data-test="submit-create-prescription"
              type="submit"
              className="btn bg-teal-600 hover:bg-teal-700 text-white border-none"
              disabled={isFormDisabled}
            >
              {isCreating ? (
                <>
                  <span className="loading loading-spinner loading-sm" /> Creating...
                </>
              ) : (
                'Create Prescription'
              )}
            </button>
            <button
              data-test="cancel-create-prescription"
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                (
                  document.getElementById('create_prescription_modal') as HTMLDialogElement
                )?.close();
                reset();
                clearErrors(); // Clears all RHF errors
                setCustomAppointmentError(null); // Clear your local custom error
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

export default CreatePrescription;
