import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../app/store";
import { complaintsAPI } from "../../../../reducers/complaints/complaintsAPI";
import { toast } from "sonner";

type CreateComplaintInputs = {
  subject: string;
  description: string;
  relatedAppointmentId?: number;
};

const schema: yup.ObjectSchema<CreateComplaintInputs> = yup.object({
  subject: yup.string().max(100, 'Subject must be less than 100 characters').required("Subject is required"),
  description: yup.string().required("Description is required"),
  relatedAppointmentId: yup
    .number()
    .positive("Appointment ID must be positive")
    .integer("Appointment ID must be an integer")
    .optional(),
});

type CreateComplaintProps = {
  refetch: () => void;
};

const CreateComplaint = ({ refetch }: CreateComplaintProps) => {
  const user = useSelector((state: RootState) => state.user.user);
  const userId = user?.user_id;

  const [createComplaint, { isLoading }] = complaintsAPI.useCreateComplaintMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateComplaintInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<CreateComplaintInputs> = async (data) => {
    try {
      if (!userId) {
        toast.error("User ID not found. Please login again.");
        return;
      }

      const payload = {
        ...data,
        userId,
        // Only include relatedAppointmentId if it's provided and valid
        ...(data.relatedAppointmentId && { relatedAppointmentId: data.relatedAppointmentId }),
      };

      await createComplaint(payload).unwrap();
      toast.success("Complaint submitted successfully!");
      reset();
      refetch();
      (document.getElementById("create_complaint_modal") as HTMLDialogElement)?.close();
    } catch (error) {
      console.error("Error creating complaint:", error);
      toast.error("Failed to submit complaint. Please try again.");
    }
  };

  return (
    <dialog id="create_complaint_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg border border-gray-200">
        <div className="bg-gradient-to-r from-teal-500 to-pink-500 -m-6 mb-6 p-6 rounded-t-lg">
          <h3 className="font-bold text-lg text-white">Submit New Complaint</h3>
          <p className="text-teal-100 text-sm mt-1">Share your feedback or concerns with us</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              data-test="complaint-subject-input"
              type="text"
              {...register("subject")}
              placeholder="Brief description of your complaint"
              className="input input-bordered w-full bg-white text-gray-800 border-gray-300 focus:border-teal-500"
            />
            {errors.subject && <span className="text-sm text-red-600">{errors.subject.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              data-test="complaint-description-input"
              {...register("description")}
              placeholder="Please provide detailed information about your complaint..."
              className="textarea textarea-bordered w-full bg-white text-gray-800 border-gray-300 focus:border-teal-500"
              rows={4}
            />
            {errors.description && <span className="text-sm text-red-600">{errors.description.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Related Appointment ID (Optional)</label>
            <input
              data-test="complaint-appointment-id-input"
              type="number"
              {...register("relatedAppointmentId")}
              placeholder="Enter appointment ID if complaint is related to a specific appointment"
              className="input input-bordered w-full bg-white text-gray-800 border-gray-300 focus:border-teal-500"
            />
            {errors.relatedAppointmentId && <span className="text-sm text-red-600">{errors.relatedAppointmentId.message}</span>}
            <p className="text-xs text-gray-500 mt-1">
              If your complaint is about a specific appointment, please enter the appointment ID
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Note:</span> Your complaint will be reviewed by our team and you will receive updates on its status.
            </p>
          </div>

          <div className="modal-action">
            <button 
              data-test="complaint-submit-btn"
              type="submit" 
              className="btn bg-teal-600 hover:bg-teal-700 text-white border-none" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm" /> Submitting...
                </>
              ) : (
                "Submit Complaint"
              )}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                (document.getElementById("create_complaint_modal") as HTMLDialogElement)?.close();
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

export default CreateComplaint;