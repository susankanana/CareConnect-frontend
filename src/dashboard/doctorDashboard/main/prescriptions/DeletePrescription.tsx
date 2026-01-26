import { toast } from 'sonner';
import {
  prescriptionsAPI,
  type TPrescription,
} from '../../../../reducers/prescriptions/prescriptionsAPI';
import { Pill, User, Calendar, AlertTriangle, CreditCard } from 'lucide-react';

type DeletePrescriptionProps = {
  prescription: TPrescription | null;
  refetch: () => void;
};

const DeletePrescription = ({ prescription, refetch }: DeletePrescriptionProps) => {
  const [deletePrescription, { isLoading }] = prescriptionsAPI.useDeletePrescriptionMutation({
    fixedCacheKey: 'deletePrescription',
  });

  const handleDelete = async () => {
    try {
      if (!prescription) {
        toast.error('No prescription selected for deletion.');
        return;
      }
      await deletePrescription(prescription.prescriptionId).unwrap();
      toast.success('Prescription deleted successfully!');
      refetch();
      (document.getElementById('delete_prescription_modal') as HTMLDialogElement)?.close();
    } catch (error) {
      console.error('Error deleting prescription:', error);
      toast.error('Failed to delete prescription. Please try again.');
    }
  };

  return (
    <dialog id="delete_prescription_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg border border-gray-200">
        <div className="bg-gradient-to-r from-red-500 to-pink-500 -m-6 mb-6 p-6 rounded-t-lg">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-white" />
            <h3 className="font-bold text-lg text-white">Delete Prescription</h3>
          </div>
        </div>

        {prescription && (
          <div className="space-y-4 mb-6">
            <p className="text-gray-700 font-medium">
              Are you sure you want to delete this prescription? This action cannot be undone and
              will affect the appointment's total amount.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Pill className="h-4 w-4 text-teal-600" />
                <span className="text-sm">
                  <span className="font-medium">Prescription ID:</span> #
                  {prescription.prescriptionId}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-teal-600" />
                <span className="text-sm">
                  <span className="font-medium">Patient ID:</span> {prescription.patientId}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-teal-600" />
                <span className="text-sm">
                  <span className="font-medium">Appointment ID:</span> {prescription.appointmentId}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <CreditCard className="h-4 w-4 text-teal-600" />
                <span className="text-sm">
                  <span className="font-medium">Amount:</span> KSh{' '}
                  {parseFloat(prescription.amount).toFixed(2)}
                </span>
              </div>

              <div className="bg-gray-100 rounded p-2">
                <p className="text-xs text-gray-600">
                  <span className="font-medium">Notes:</span> {prescription.notes.substring(0, 100)}
                  ...
                </p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm font-medium">
                ⚠️ Warning: This will also update the related appointment's total amount.
              </p>
            </div>
          </div>
        )}

        <div className="modal-action flex gap-4">
          <button
            data-test="confirm-delete-prescription"
            className="btn bg-red-600 hover:bg-red-700 text-white border-none"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-sm" /> Deleting...
              </>
            ) : (
              'Yes, Delete'
            )}
          </button>
          <button
            data-test="cancel-delete-prescription"
            className="btn btn-ghost"
            type="button"
            onClick={() =>
              (document.getElementById('delete_prescription_modal') as HTMLDialogElement)?.close()
            }
          >
            Cancel
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default DeletePrescription;
