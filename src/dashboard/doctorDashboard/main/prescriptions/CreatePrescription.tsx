import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../app/store";
import { prescriptionsAPI } from "../../../../reducers/prescriptions/prescriptionsAPI";
import { toast } from "sonner";

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

  const [createPrescription, { isLoading }] = prescriptionsAPI.useCreatePrescriptionMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePrescriptionInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<CreatePrescriptionInputs> = async (data) => {
    try {
      if (!doctorId) {
        toast.error("Doctor ID not found. Please login again.");
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
              {...register("appointmentId")}
              placeholder="Enter appointment ID"
              className="input input-bordered w-full bg-white text-gray-800 border-gray-300 focus:border-teal-500"
            />
            {errors.appointmentId && <span className="text-sm text-red-600">{errors.appointmentId.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
            <input
              data-test="create-patient-id"
              type="number"
              {...register("patientId")}
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
              {...register("amount")}
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
              disabled={isLoading}
            >
              {isLoading ? (
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