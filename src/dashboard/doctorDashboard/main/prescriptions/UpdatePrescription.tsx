import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { prescriptionsAPI, type TPrescription } from "../../../../reducers/prescriptions/prescriptionsAPI";
import { toast } from "sonner";

type UpdatePrescriptionProps = {
  prescription: TPrescription | null;
  refetch: () => void;
};

type UpdatePrescriptionInputs = {
  notes: string;
  amount: number;
};

const schema: yup.ObjectSchema<UpdatePrescriptionInputs> = yup.object({
  notes: yup.string().required("Prescription notes are required"),
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .positive("Amount must be positive")
    .required("Amount is required"),
});

const UpdatePrescription = ({ prescription, refetch }: UpdatePrescriptionProps) => {
  const [updatePrescription, { isLoading }] = prescriptionsAPI.useUpdatePrescriptionMutation({ 
    fixedCacheKey: "updatePrescription" 
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UpdatePrescriptionInputs>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (prescription) {
      setValue("notes", prescription.notes);
      setValue("amount", parseFloat(prescription.amount));
    } else {
      reset();
    }
  }, [prescription, setValue, reset]);

  const onSubmit: SubmitHandler<UpdatePrescriptionInputs> = async (data) => {
    try {
      if (!prescription) {
        toast.error("No prescription selected for update.");
        return;
      }

      const payload = {
        ...data,
        amount: data.amount.toString(),
        id: prescription.prescriptionId,
      };

      await updatePrescription(payload).unwrap();
      toast.success("Prescription updated successfully!");
      refetch();
      reset();
      (document.getElementById("update_prescription_modal") as HTMLDialogElement)?.close();
    } catch (error) {
      console.error("Error updating prescription:", error);
      toast.error("Failed to update prescription. Please try again.");
    }
  };

  return (
    <dialog id="update_prescription_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg border border-gray-200">
        <div className="bg-gradient-to-r from-teal-500 to-pink-500 -m-6 mb-6 p-6 rounded-t-lg">
          <h3 className="font-bold text-lg text-white">Update Prescription</h3>
          <p className="text-teal-100 text-sm mt-1">
            Prescription #{prescription?.prescriptionId}
          </p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prescription Notes
            </label>
            <textarea
              data-test="update-notes"
              {...register("notes")}
              placeholder="Enter detailed prescription notes, medications, dosage, etc."
              className="textarea textarea-bordered w-full bg-white text-gray-800 border-gray-300 focus:border-teal-500"
              rows={4}
            />
            {errors.notes && (
              <span className="text-sm text-red-600 mt-1">{errors.notes.message}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (KSh)
            </label>
            <input
              data-test="update-amount"
              type="number"
              step="0.01"
              {...register("amount")}
              placeholder="0.00"
              className="input input-bordered w-full bg-white text-gray-800 border-gray-300 focus:border-teal-500"
            />
            {errors.amount && (
              <span className="text-sm text-red-600 mt-1">{errors.amount.message}</span>
            )}
          </div>

          <div className="modal-action">
            <button 
              data-test="submit-update-prescription"
              type="submit" 
              className="btn bg-teal-600 hover:bg-teal-700 text-white border-none" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm" /> Updating...
                </>
              ) : (
                "Update Prescription"
              )}
            </button>
            <button
              data-test="cancel-update-prescription"
              className="btn btn-ghost"
              type="button"
              onClick={() => {
                (document.getElementById("update_prescription_modal") as HTMLDialogElement)?.close();
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

export default UpdatePrescription;