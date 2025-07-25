import { toast } from "sonner";
import { complaintsAPI, type TComplaint } from "../../../../reducers/complaints/complaintsAPI";
import { MessageSquare, User, Calendar, AlertTriangle } from "lucide-react";

type DeleteComplaintProps = {
    complaint: TComplaint | null;
    refetch: () => void;
};

const DeleteComplaint = ({ complaint, refetch }: DeleteComplaintProps) => {
    const [deleteComplaint, { isLoading }] = complaintsAPI.useDeleteComplaintMutation(
        { fixedCacheKey: "deleteComplaint" }
    );

    const handleDelete = async () => {
        try {
            if (!complaint) {
                toast.error("No complaint selected for deletion.");
                return;
            }
            await deleteComplaint(complaint.complaintId).unwrap();
            toast.success("Complaint deleted successfully!");
            refetch();
            (document.getElementById('delete_complaint_modal') as HTMLDialogElement)?.close();
        } catch (error) {
            console.error("Error deleting complaint:", error);
            toast.error("Failed to delete complaint. Please try again.");
        }
    };

    return (
        <dialog id="delete_complaint_modal" className="modal sm:modal-middle">
            <div className="modal-box bg-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg border border-gray-200">
                <div className="bg-gradient-to-r from-red-500 to-pink-500 -m-6 mb-6 p-6 rounded-t-lg">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="h-6 w-6 text-white" />
                        <h3 className="font-bold text-lg text-white">Delete Complaint</h3>
                    </div>
                </div>

                {complaint && (
                    <div className="space-y-4 mb-6">
                        <p className="text-gray-700 font-medium">
                            Are you sure you want to delete this complaint? This action cannot be undone.
                        </p>
                        
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                            <div className="flex items-center gap-3">
                                <MessageSquare className="h-4 w-4 text-teal-600" />
                                <span className="text-sm">
                                    <span className="font-medium">Subject:</span> {complaint.subject}
                                </span>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <User className="h-4 w-4 text-teal-600" />
                                <span className="text-sm">
                                    <span className="font-medium">User ID:</span> {complaint.userId}
                                </span>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4 text-teal-600" />
                                <span className="text-sm">
                                    <span className="font-medium">Created:</span> {complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString() : 'N/A'}
                                </span>
                            </div>
                            
                            <div className="bg-gray-100 rounded p-2">
                                <p className="text-xs text-gray-600">
                                    <span className="font-medium">Description:</span> {complaint.description.substring(0, 100)}...
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="modal-action flex gap-4">
                    <button
                        data-test="confirm-delete-btn"
                        className="btn bg-red-600 hover:bg-red-700 text-white border-none"
                        onClick={handleDelete}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="loading loading-spinner loading-sm" /> Deleting...
                            </>
                        ) : "Yes, Delete"}
                    </button>
                    <button
                        data-test="cancel-delete-btn"
                        className="btn btn-ghost"
                        type="button"
                        onClick={() => (document.getElementById('delete_complaint_modal') as HTMLDialogElement)?.close()}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </dialog>
    );
};

export default DeleteComplaint;