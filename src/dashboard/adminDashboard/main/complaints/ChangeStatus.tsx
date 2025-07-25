import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { complaintsAPI, type TComplaint, type ComplaintStatus } from "../../../../reducers/complaints/complaintsAPI";
import { toast } from "sonner";
import { useEffect } from "react";

type ChangeStatusProps = {
    complaint: TComplaint | null;
    refetch: () => void;
};

type ChangeStatusInputs = {
    status: ComplaintStatus;
};

const schema = yup.object({
    status: yup.string().oneOf(["Open", "In Progress", "Resolved", "Closed"]).required("Status is required"),
});

const ChangeStatus = ({ complaint, refetch }: ChangeStatusProps) => {
    const [updateComplaintStatus, { isLoading }] = complaintsAPI.useUpdateComplaintStatusMutation(
        { fixedCacheKey: "updateComplaintStatus" }
    );

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<ChangeStatusInputs>({
        resolver: yupResolver(schema),
        defaultValues: {
            status: complaint ? complaint.status : "Open",
        },
    });

    useEffect(() => {
        if (complaint) {
            setValue("status", complaint.status);
        } else {
            reset();
        }
    }, [complaint, setValue, reset]);

    const onSubmit: SubmitHandler<ChangeStatusInputs> = async (data) => {
        try {
            if (!complaint) {
                toast.error("No complaint selected for status change.");
                return;
            }
            await updateComplaintStatus({ id: complaint.complaintId, status: data.status }).unwrap();
            toast.success("Complaint status updated successfully!");
            refetch();
            reset();
            (document.getElementById('change_status_modal') as HTMLDialogElement)?.close();
        } catch (error) {
            console.error("Error updating complaint status:", error);
            toast.error("Failed to update complaint status. Please try again.");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Open':
                return 'text-red-600';
            case 'In Progress':
                return 'text-yellow-600';
            case 'Resolved':
                return 'text-green-600';
            case 'Closed':
                return 'text-gray-600';
            default:
                return 'text-gray-600';
        }
    };

    return (
        <dialog id="change_status_modal" className="modal sm:modal-middle">
            <div className="modal-box bg-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg border border-gray-200">
                <div className="bg-gradient-to-r from-teal-500 to-pink-500 -m-6 mb-6 p-6 rounded-t-lg">
                    <h3 className="font-bold text-lg text-white">
                        Change Status for Complaint #{complaint?.complaintId}
                    </h3>
                    <p className="text-teal-100 text-sm mt-1">
                        Subject: {complaint?.subject}
                    </p>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <p className="text-sm text-gray-700">
                            <span className="font-medium">Current Status:</span> 
                            <span className={`ml-2 font-semibold ${getStatusColor(complaint?.status || 'Open')}`}>
                                {complaint?.status}
                            </span>
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select New Status:</label>
                        <select
                            data-test="status-dropdown"
                            {...register("status")}
                            className="select select-bordered w-full bg-white text-gray-800 border-gray-300 focus:border-teal-500"
                        >
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Closed">Closed</option>
                        </select>
                        {errors.status && (
                            <span className="text-sm text-red-600 mt-1">{errors.status.message}</span>
                        )}
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-800">
                            <span className="font-medium">Status Guide:</span>
                        </p>
                        <ul className="text-xs text-blue-700 mt-1 space-y-1">
                            <li>• <strong>Open:</strong> New complaint, needs attention</li>
                            <li>• <strong>In Progress:</strong> Being actively worked on</li>
                            <li>• <strong>Resolved:</strong> Issue has been fixed</li>
                            <li>• <strong>Closed:</strong> Complaint is finalized</li>
                        </ul>
                    </div>

                    <div className="modal-action flex flex-col sm:flex-row gap-2">
                        <button data-test="submit-status-change" type="submit" className="btn bg-teal-600 hover:bg-teal-700 text-white border-none w-full sm:w-auto" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <span className="loading loading-spinner loading-sm" /> Updating...
                                </>
                            ) : "Update Status"}
                        </button>
                        <button
                            data-test="cancel-status-change"
                            className="btn btn-ghost w-full sm:w-auto"
                            type="button"
                            onClick={() => {
                                (document.getElementById('change_status_modal') as HTMLDialogElement)?.close();
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

export default ChangeStatus;