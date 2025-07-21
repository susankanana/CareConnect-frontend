import { toast } from "sonner";
import { type TDoctor } from "../../../../reducers/doctors/doctorsAPI";
import{ usersAPI } from "../../../../reducers/users/usersAPI"
import { Stethoscope, User, Mail, Phone, AlertTriangle } from "lucide-react";

type DeleteDoctorProps = {
    doctor: TDoctor | null;
    refetch: () => void;
};

const DeleteDoctor = ({ doctor, refetch }: DeleteDoctorProps) => {
    const [deleteUser, { isLoading }] = usersAPI.useDeleteUserMutation(
        { fixedCacheKey: "deleteDoctor" }
    );

    const handleDelete = async () => {
        try {
            if (!doctor) {
                toast.error("No doctor selected for deletion.");
                return;
            }
            await deleteUser(doctor.user.userId).unwrap();
            toast.success("Doctor deleted successfully!");
            refetch();
            (document.getElementById('delete_doctor_modal') as HTMLDialogElement)?.close();
        } catch (error) {
            console.error("Error deleting doctor:", error);
            toast.error("Failed to delete doctor. Please try again.");
        }
    };

    return (
        <dialog id="delete_doctor_modal" className="modal sm:modal-middle">
            <div className="modal-box bg-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg border border-gray-200">
                <div className="bg-gradient-to-r from-red-500 to-pink-500 -m-6 mb-6 p-6 rounded-t-lg">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="h-6 w-6 text-white" />
                        <h3 className="font-bold text-lg text-white">Delete Doctor</h3>
                    </div>
                </div>

                {doctor && (
                    <div className="space-y-4 mb-6">
                        <p className="text-gray-700 font-medium">
                            Are you sure you want to delete this doctor? This action cannot be undone and will remove all associated data.
                        </p>
                        
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                            <div className="flex items-center gap-3">
                                <User className="h-4 w-4 text-teal-600" />
                                <span className="text-sm">
                                    <span className="font-medium">Name:</span> Dr. {doctor.user.firstName} {doctor.user.lastName}
                                </span>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <Stethoscope className="h-4 w-4 text-teal-600" />
                                <span className="text-sm">
                                    <span className="font-medium">Specialization:</span> {doctor.doctor.specialization}
                                </span>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-teal-600" />
                                <span className="text-sm">
                                    <span className="font-medium">Email:</span> {doctor.user.email}
                                </span>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-teal-600" />
                                <span className="text-sm">
                                    <span className="font-medium">Phone:</span> {doctor.user.contactPhone}
                                </span>
                            </div>
                        </div>

                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-red-700 text-sm font-medium">
                                ⚠️ Warning: This will also delete all appointments and prescriptions associated with this doctor.
                            </p>
                        </div>
                    </div>
                )}

                <div className="modal-action flex gap-4">
                    <button
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
                        className="btn btn-ghost"
                        type="button"
                        onClick={() => (document.getElementById('delete_doctor_modal') as HTMLDialogElement)?.close()}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </dialog>
    );
};

export default DeleteDoctor;