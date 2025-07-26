import { toast } from "sonner";
import { appointmentsAPI, type TDetailedAppointment } from "../../../../reducers/appointments/appointmentsAPI";
import { Calendar, User, Stethoscope, AlertTriangle } from "lucide-react";

type DeleteAppointmentProps = {
    appointment: TDetailedAppointment | null;
    refetch: () => void;
};

const DeleteAppointment = ({ appointment, refetch }: DeleteAppointmentProps) => {
    const [deleteAppointment, { isLoading }] = appointmentsAPI.useDeleteAppointmentMutation(
        { fixedCacheKey: "deleteAppointment" }
    );

    const handleDelete = async () => {
        try {
            if (!appointment) {
                toast.error("No appointment selected for deletion.");
                return;
            }
            await deleteAppointment(appointment.appointmentId).unwrap();
            toast.success("Appointment deleted successfully!");
            refetch();
            (document.getElementById('delete_appointment_modal') as HTMLDialogElement)?.close();
        } catch (error) {
            console.error("Error deleting appointment:", error);
            toast.error("Failed to delete appointment. Please try again.");
        }
    };

    const formatTimeSlot = (timeSlot: string) => {
        const [hours, minutes] = timeSlot.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    return (
        <dialog id="delete_appointment_modal" className="modal sm:modal-middle">
            <div data-test="delete-appointment-modal" className="modal-box bg-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg border border-gray-200">
                <div className="bg-gradient-to-r from-red-500 to-pink-500 -m-6 mb-6 p-6 rounded-t-lg">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="h-6 w-6 text-white" />
                        <h3 className="font-bold text-lg text-white">Delete Appointment</h3>
                    </div>
                </div>

                {appointment && (
                    <div className="space-y-4 mb-6">
                        <p className="text-gray-700 font-medium">
                            Are you sure you want to delete this appointment? This action cannot be undone.
                        </p>
                        
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                            <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4 text-teal-600" />
                                <span className="text-sm">
                                    <span className="font-medium">Date:</span> {new Date(appointment.appointmentDate).toLocaleDateString()}
                                </span>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <User className="h-4 w-4 text-teal-600" />
                                <span className="text-sm">
                                    <span className="font-medium">Patient:</span> {appointment.patient?.name} {appointment.patient?.lastName}
                                </span>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <Stethoscope className="h-4 w-4 text-teal-600" />
                                <span className="text-sm">
                                    <span className="font-medium">Doctor:</span> Dr. {appointment.doctor?.name} {appointment.doctor?.lastName}
                                </span>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <span className="text-sm">
                                    <span className="font-medium">Time:</span> {formatTimeSlot(appointment.timeSlot)}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="modal-action flex gap-4">
                    <button
                        data-test="confirm-delete-appointment"
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
                        data-test="cancel-delete-appointment"
                        className="btn btn-ghost"
                        type="button"
                        onClick={() => (document.getElementById('delete_appointment_modal') as HTMLDialogElement)?.close()}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </dialog>
    );
};

export default DeleteAppointment;