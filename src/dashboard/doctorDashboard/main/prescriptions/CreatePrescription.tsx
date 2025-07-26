import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../app/store";
import { prescriptionsAPI } from "../../../../reducers/prescriptions/prescriptionsAPI";
import { appointmentsAPI, type TDetailedAppointment } from "../../../../reducers/appointments/appointmentsAPI";
import { toast } from "sonner";
import { useEffect } from "react"; // Removed useState for appointmentOwnershipError

type CreatePrescriptionInputs = {
  appointmentId: number;
  patientId: number;
  notes: string;
  amount: number;
};

const schema: yup.ObjectSchema<CreatePrescriptionInputs> = yup.object({
  appointmentId: yup.number().positive("Appointment ID must be positive").required("Appointment ID is required"),
  patientId: yup.number().positive("Patient ID must be positive").required("Patient ID is required"),
  notes: yup.string().required("Prescription notes are required"),
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .positive("Amount must be positive")
    .required("Amount is required"),
});

type CreatePrescriptionProps = {
  refetch: () => void;
};

const CreatePrescription = ({ refetch }: CreatePrescriptionProps) => {
  const user = useSelector((state: RootState) => state.user.user);
  const doctorId = user?.user_id;

  const [createPrescription, { isLoading: isCreating }] = prescriptionsAPI.useCreatePrescriptionMutation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<CreatePrescriptionInputs>({
    resolver: yupResolver(schema),
    mode: "onChange", // Validate on change for immediate feedback
  });

  const watchedAppointmentId = watch("appointmentId");

  // Fetch appointments for the current doctor
  const {
    data: doctorAppointments,
    isLoading: isLoadingAppointments,
    isFetching: isFetchingAppointments, // Use isFetching to indicate ongoing background fetch
  } = appointmentsAPI.useGetAppointmentsByDoctorIdQuery(
    doctorId!,
    { skip: !doctorId }
  );

  // Effect to validate appointment ownership whenever watchedAppointmentId or doctorAppointments changes
  useEffect(() => {
    // Only proceed if doctorId is available, watchedAppointmentId has a value,
    // and doctorAppointments data is loaded (not undefined/null and not currently fetching)
    if (doctorId && watchedAppointmentId && doctorAppointments?.data && !isFetchingAppointments) {
      const isOwned = doctorAppointments.data.some(
        (appointment: TDetailedAppointment) => appointment.appointmentId === watchedAppointmentId
      );

      if (!isOwned) {
        setError("appointmentId", {
          type: "custom", // Use a custom type for this specific error
          message: "This appointment ID does not belong to you.",
        });
      } else {
        // Only clear if the error was due to ownership, not a yup validation error
        if (errors.appointmentId?.type === "custom") {
          clearErrors("appointmentId");
        }
      }
    } else if (!watchedAppointmentId && errors.appointmentId?.type === "custom") {
      // Clear custom error if appointment ID input is cleared
      clearErrors("appointmentId");
    }
  }, [watchedAppointmentId, doctorAppointments, isFetchingAppointments, doctorId, setError, clearErrors, errors.appointmentId]);


  const onSubmit: SubmitHandler<CreatePrescriptionInputs> = async (data) => {
    try {
      if (!doctorId) {
        toast.error("Doctor ID not found. Please login again.");
        return;
      }

      // Final check for ownership just before submission
      if (!doctorAppointments?.data) {
        toast.error("Appointments data not loaded. Cannot verify ownership. Please try again.");
        return;
      }

      const isOwned = doctorAppointments.data.some(
        (appointment: TDetailedAppointment) => appointment.appointmentId === data.appointmentId
      );

      if (!isOwned) {
        toast.error("Error: The appointment ID does not belong to you.");
        setError("appointmentId", { type: "manual", message: "This appointment ID does not belong to you." });
        return;
      }

      const payload = {
        ...data,
        doctorId,
        amount: data.amount.toString(),
      };

      await createPrescription(payload).unwrap();
      toast.success("Prescription created successfully!");
      reset();
      refetch();
      (document.getElementById("create_prescription_modal") as HTMLDialogElement)?.close();
    } catch (error) {
      console.error("Error creating prescription:", error);
      toast.error("Failed to create prescription. Please try again.");
    }
  };

  const isFormDisabled =
    isCreating ||
    isLoadingAppointments || // Still loading initial appointments data
    isFetchingAppointments || // Background fetching (e.g., re-fetching on focus)
    !!errors.appointmentId?.message; // Disable if there's any appointmentId error, including ownership

  return (
    <dialog id="create_prescription_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg border border-gray-200">
        <div className="bg-gradient-to-r from-teal-500 to-pink-500 -m-6 mb-6 p-6 rounded-t-lg">
          <h3 className="font-bold text-lg text-white">Create New Prescription</h3>
          <p className="text-teal-100 text-sm mt-1">Add a prescription for your patient</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Appointment ID</label>
            <input
              data-test="create-appointment-id"
              type="number"
              {...register("appointmentId", { valueAsNumber: true })} // Ensure it's treated as a number
              placeholder="Enter appointment ID"
              className="input input-bordered w-full bg-white text-gray-800 border-gray-300 focus:border-teal-500"
            />
            {/* Show error message only once, from react-hook-form's errors */}
            {errors.appointmentId && <span className="text-sm text-red-600">{errors.appointmentId.message}</span>}

            {/* Show a loading indicator specifically for the ownership check */}
            {watchedAppointmentId && (isLoadingAppointments || isFetchingAppointments) && !errors.appointmentId?.message && (
              <span className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <span className="loading loading-spinner loading-xs" /> Verifying appointment ownership...
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
            <input
              data-test="create-patient-id"
              type="number"
              {...register("patientId", { valueAsNumber: true })}
              placeholder="Enter patient ID"
              className="input input-bordered w-full bg-white text-gray-800 border-gray-300 focus:border-teal-500"
            />
            {errors.patientId && <span className="text-sm text-red-600">{errors.patientId.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prescription Notes</label>
            <textarea
              data-test="create-notes"
              {...register("notes")}
              placeholder="Enter detailed prescription notes, medications, dosage, etc."
              className="textarea textarea-bordered w-full bg-white text-gray-800 border-gray-300 focus:border-teal-500"
              rows={4}
            />
            {errors.notes && <span className="text-sm text-red-600">{errors.notes.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (KSh)</label>
            <input
              data-test="create-amount"
              type="number"
              step="0.01"
              {...register("amount", { valueAsNumber: true })}
              placeholder="0.00"
              className="input input-bordered w-full bg-white text-gray-800 border-gray-300 focus:border-teal-500"
            />
            {errors.amount && <span className="text-sm text-red-600">{errors.amount.message}</span>}
          </div>

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
                "Create Prescription"
              )}
            </button>
            <button
              data-test="cancel-create-prescription"
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                (document.getElementById("create_prescription_modal") as HTMLDialogElement)?.close();
                reset();
                clearErrors("appointmentId"); // Clear react-hook-form error on close
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