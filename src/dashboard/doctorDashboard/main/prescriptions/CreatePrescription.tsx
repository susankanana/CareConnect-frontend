import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../app/store";
import { prescriptionsAPI } from "../../../../reducers/prescriptions/prescriptionsAPI";
import { appointmentsAPI, type TDetailedAppointment } from "../../../../reducers/appointments/appointmentsAPI";
import { toast } from "sonner";
import { useEffect } from "react";

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
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<CreatePrescriptionInputs>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const watchedAppointmentId = watch("appointmentId");

  const {
    data: doctorAppointments,
    isLoading: isLoadingAppointments,
    isFetching: isFetchingAppointments,
  } = appointmentsAPI.useGetAppointmentsByDoctorIdQuery(
    doctorId!,
    { skip: !doctorId }
  );

  // Effect to validate appointment ownership and prepopulate patientId
  useEffect(() => {
    // Clear patientId and any custom appointmentId errors when watchedAppointmentId changes
    setValue("patientId", 0); // Reset patientId
    if (errors.appointmentId?.type === "custom") {
      clearErrors("appointmentId");
    }

    if (doctorId && watchedAppointmentId && doctorAppointments?.data && !isFetchingAppointments) {
      const foundAppointment = doctorAppointments.data.find(
        (appointment: TDetailedAppointment) => appointment.appointmentId === watchedAppointmentId
      );

      if (!foundAppointment) {
        setError("appointmentId", {
          type: "custom",
          message: "This appointment ID does not belong to you or does not exist.",
        });
        setValue("patientId", 0); // Ensure patientId is cleared if invalid appointment
      } else {
        // If owned and found, clear any previous custom error
        if (errors.appointmentId?.type === "custom") {
          clearErrors("appointmentId");
        }
        // Prepopulate patientId field
        setValue("patientId", foundAppointment.patient.id);
      }
    } else if (!watchedAppointmentId) {
      // Clear custom error and patientId if appointment ID input is empty
      clearErrors("appointmentId");
      setValue("patientId", 0);
    }
  }, [watchedAppointmentId, doctorAppointments, isFetchingAppointments, doctorId, setError, clearErrors, setValue, errors.appointmentId]);


  const onSubmit: SubmitHandler<CreatePrescriptionInputs> = async (data) => {
    try {
      if (!doctorId) {
        toast.error("Doctor ID not found. Please login again.");
        return;
      }

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
    isLoadingAppointments ||
    isFetchingAppointments ||
    !!errors.appointmentId?.message;

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
              {...register("appointmentId", { valueAsNumber: true })}
              placeholder="Enter appointment ID"
              className="input input-bordered w-full bg-white text-gray-800 border-gray-300 focus:border-teal-500"
            />
            {errors.appointmentId && <span className="text-sm text-red-600">{errors.appointmentId.message}</span>}

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
              readOnly // Make it read-only since it's pre-populated
              disabled={watchedAppointmentId === 0 || errors.appointmentId?.message !== undefined} // Disable if no valid appointment ID or if there's an error
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
                clearErrors("appointmentId");
                // Note: reset() should clear patientId too if it's part of the form state
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