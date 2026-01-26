import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { complaintsAPI, type TComplaint } from '../../../../reducers/complaints/complaintsAPI';
import { toast } from 'sonner';

type UpdateComplaintProps = {
  complaint: TComplaint | null;
  refetch: () => void;
};

type UpdateComplaintInputs = {
  subject: string;
  description: string;
};

const schema: yup.ObjectSchema<UpdateComplaintInputs> = yup.object({
  subject: yup.string().max(100).required('Subject is required'),
  description: yup.string().required('Description is required'),
});

const UpdateComplaint = ({ complaint, refetch }: UpdateComplaintProps) => {
  const [updateComplaint, { isLoading }] = complaintsAPI.useUpdateComplaintMutation({
    fixedCacheKey: 'updateComplaint',
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UpdateComplaintInputs>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (complaint) {
      setValue('subject', complaint.subject);
      setValue('description', complaint.description);
    } else {
      reset();
    }
  }, [complaint, setValue, reset]);

  const onSubmit: SubmitHandler<UpdateComplaintInputs> = async (data) => {
    try {
      if (!complaint) {
        toast.error('No complaint selected for update.');
        return;
      }

      const payload = {
        ...data,
        id: complaint.complaintId,
      };

      await updateComplaint(payload).unwrap();
      toast.success('Complaint updated successfully!');
      refetch();
      reset();
      (document.getElementById('update_complaint_modal') as HTMLDialogElement)?.close();
    } catch (error) {
      console.error('Error updating complaint:', error);
      toast.error('Failed to update complaint. Please try again.');
    }
  };

  return (
    <dialog id="update_complaint_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg border border-gray-200">
        <div className="bg-gradient-to-r from-teal-500 to-pink-500 -m-6 mb-6 p-6 rounded-t-lg">
          <h3 className="font-bold text-lg text-white">Update Complaint</h3>
          <p className="text-teal-100 text-sm mt-1">Complaint #{complaint?.complaintId}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <input
              data-test="update-subject-input"
              type="text"
              {...register('subject')}
              placeholder="Complaint subject"
              className="input input-bordered w-full bg-white text-gray-800 border-gray-300 focus:border-teal-500"
            />
            {errors.subject && (
              <span className="text-sm text-red-600 mt-1">{errors.subject.message}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              data-test="update-description-textarea"
              {...register('description')}
              placeholder="Detailed description of the complaint"
              className="textarea textarea-bordered w-full bg-white text-gray-800 border-gray-300 focus:border-teal-500"
              rows={4}
            />
            {errors.description && (
              <span className="text-sm text-red-600 mt-1">{errors.description.message}</span>
            )}
          </div>

          <div className="modal-action">
            <button
              data-test="submit-update-btn"
              type="submit"
              className="btn bg-teal-600 hover:bg-teal-700 text-white border-none"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm" /> Updating...
                </>
              ) : (
                'Update Complaint'
              )}
            </button>
            <button
              className="btn btn-ghost"
              type="button"
              onClick={() => {
                (document.getElementById('update_complaint_modal') as HTMLDialogElement)?.close();
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

export default UpdateComplaint;
