import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { appointmentsAPI, type AppointmentStatus, type TDetailedAppointment } from "../../../../reducers/appointments/appointmentsAPI";
import { toast } from "sonner";
import { useEffect } from "react";

type ChangeStatusProps = {
    appointment: TDetailedAppointment | null;
    refetch: () => void;
};

type ChangeStatusInputs = {
    appointmentStatus: AppointmentStatus;
};

const schema = yup.object({
    appointmentStatus: yup.string().oneOf(["Pending", "Confirmed", "Cancelled"]).required("Status is required"),
});

const ChangeStatus = ({ appointment, refetch }: ChangeStatusProps) => {
    const [updateAppointmentStatus, { isLoading }] = appointmentsAPI.useUpdateAppointmentStatusMutation(
        { fixedCacheKey: "updateAppointmentStatus" }
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
            appointmentStatus: appointment ? appointment.status : "Pending",
        },
    });

    useEffect(() => {
        if (appointment) {
            setValue("appointmentStatus", appointment.status);
        } else {
            reset();
        }
    }, [appointment, setValue, reset]);

    const onSubmit: SubmitHandler<ChangeStatusInputs> = async (data) => {
        try {
            if (!appointment) {
                toast.error("No appointment selected for status change.");
                return;
            }
            await updateAppointmentStatus({ id: appointment.appointmentId, status: data.appointmentStatus }).unwrap();
            toast.success("Appointment status updated successfully!");
            refetch();
            reset();
            (document.getElementById('change_status_modal') as HTMLDialogElement)?.close();
        } catch (error) {
            console.error("Error updating appointment status:", error);
            toast.error("Failed to update appointment status. Please try again.");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Confirmed':
                return 'text-green-600';
            case 'Pending':
                return 'text-yellow-600';
            case 'Cancelled':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    return (
        <dialog id="change_status_modal" className="modal sm:modal-middle">
            <div className="modal-box bg-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg border border-gray-200">
                <div className="bg-gradient-to-r from-teal-500 to-pink-500 -m-6 mb-6 p-6 rounded-t-lg">
                    <h3 className="font-bold text-lg text-white">
                        Change Status for Appointment #{appointment?.appointmentId}
                    </h3>
                    <p className="text-teal-100 text-sm mt-1">
                        Patient: {appointment?.patient?.name} {appointment?.patient?.lastName}
                    </p>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <p className="text-sm text-gray-700">
                            <span className="font-medium">Current Status:</span> 
                            <span className={`ml-2 font-semibold ${getStatusColor(appointment?.status || 'Pending')}`}>
                                {appointment?.status}
                            </span>
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select New Status:</label>
                        <select
                            data-test="status-select"
                            {...register("appointmentStatus")}
                            className="select select-bordered w-full bg-white text-gray-800 border-gray-300 focus:border-teal-500"
                        >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                        {errors.appointmentStatus && (
                            <span className="text-sm text-red-600 mt-1">{errors.appointmentStatus.message}</span>
                        )}
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-800">
                            <span className="font-medium">Status Guide:</span>
                        </p>
                        <ul className="text-xs text-blue-700 mt-1 space-y-1">
                            <li>• <strong>Pending:</strong> Awaiting confirmation</li>
                            <li>• <strong>Confirmed:</strong> Appointment is confirmed</li>
                            <li>• <strong>Cancelled:</strong> Appointment is cancelled</li>
                        </ul>
                    </div>

                    <div className="modal-action flex flex-col sm:flex-row gap-2">
                        <button data-test="status-submit-button" type="submit" className="btn bg-teal-600 hover:bg-teal-700 text-white border-none w-full sm:w-auto" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <span className="loading loading-spinner loading-sm" /> Updating...
                                </>
                            ) : "Update Status"}
                        </button>
                        <button
                            data-test="status-cancel-button"
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