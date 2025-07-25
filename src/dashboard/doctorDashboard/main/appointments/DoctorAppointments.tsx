import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../app/store";
import { appointmentsAPI, type TDetailedAppointment } from "../../../../reducers/appointments/appointmentsAPI";
import { Edit, Calendar, User, Clock, CreditCard, CheckCircle, XCircle, Phone, Mail } from "lucide-react";
import ChangeStatus from "./ChangeStatus";
import UpdateAppointment from "./UpdateAppointment";

const DoctorAppointments = () => {
    const user = useSelector((state: RootState) => state.user.user);
    const doctorId = user?.user_id;

    const { data: appointmentsData, isLoading, error, refetch } = appointmentsAPI.useGetAppointmentsByDoctorIdQuery(
        doctorId ?? 0,
        {
            skip: !doctorId,
            refetchOnMountOrArgChange: true,
            pollingInterval: 60000,
        }
    );

    const [selectedAppointment, setSelectedAppointment] = useState<TDetailedAppointment | null>(null);
    const [appointmentToChangeStatus, setAppointmentToChangeStatus] = useState<TDetailedAppointment | null>(null);

    const handleEdit = (appointment: TDetailedAppointment) => {
        setSelectedAppointment(appointment);
        (document.getElementById('update_appointment_modal') as HTMLDialogElement)?.showModal();
    };

    const handleChangeStatus = (appointment: TDetailedAppointment) => {
        setAppointmentToChangeStatus(appointment);
        (document.getElementById('change_status_modal') as HTMLDialogElement)?.showModal();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Confirmed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatTimeSlot = (timeSlot: string) => {
        const [hours, minutes] = timeSlot.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-700 text-lg font-semibold">Error fetching appointments</p>
                <p className="text-red-600 mt-2">Please try again later</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Calendar className="h-7 w-7 text-teal-600" />
                            My Appointments
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Manage your patient appointments - {appointmentsData?.data?.length || 0} total appointments
                        </p>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <ChangeStatus appointment={appointmentToChangeStatus} refetch={refetch} />
            <UpdateAppointment appointment={selectedAppointment} refetch={refetch} />

            {/* Appointments Grid */}
            {appointmentsData && appointmentsData.data && appointmentsData.data.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {appointmentsData.data.map((appointment: TDetailedAppointment) => (
                        <div
                            key={appointment.appointmentId}
                            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden"
                        >
                            {/* Appointment Header */}
                            <div className="bg-gradient-to-r from-teal-50 to-pink-50 p-4 border-b">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">
                                            Appointment #{appointment.appointmentId}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Calendar className="h-4 w-4 text-teal-600" />
                                            <span className="text-sm text-gray-600">
                                                {new Date(appointment.appointmentDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(appointment.status)}`}>
                                        <Clock className="h-3 w-3" />
                                        {appointment.status}
                                    </span>
                                </div>
                            </div>

                            {/* Appointment Details */}
                            <div className="p-6">
                                {/* Patient Information */}
                                <div className="mb-4">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <User className="h-4 w-4 text-teal-600" />
                                        Patient Information
                                    </h4>
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <p className="font-medium text-gray-900">
                                            {appointment.patient?.name} {appointment.patient?.lastName}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Mail className="h-3 w-3 text-gray-400" />
                                            <span className="text-sm text-gray-600">{appointment.patient?.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Phone className="h-3 w-3 text-gray-400" />
                                            <span className="text-sm text-gray-600">{appointment.patient?.contactPhone}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Appointment Details */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <Clock className="h-4 w-4 text-teal-500" />
                                        <span className="text-sm">
                                            <span className="font-medium">Time:</span> {formatTimeSlot(appointment.timeSlot)}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <CreditCard className="h-4 w-4 text-teal-500" />
                                        <span className="text-sm">
                                            <span className="font-medium">Amount:</span> 
                                            <span className="text-lg font-bold text-teal-600 ml-1">
                                                KSh {parseFloat(appointment.totalAmount).toFixed(2)}
                                            </span>
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <button
                                        data-test="change-status-button"
                                        onClick={() => handleChangeStatus(appointment)}
                                        className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 border border-blue-200"
                                    >
                                        <CheckCircle className="h-4 w-4" />
                                        Status
                                    </button>
                                    <button
                                        data-test="edit-appointment-button"
                                        onClick={() => handleEdit(appointment)}
                                        className="flex-1 bg-teal-50 hover:bg-teal-100 text-teal-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 border border-teal-200"
                                    >
                                        <Edit className="h-4 w-4" />
                                        Edit
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
                    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No appointments scheduled</h3>
                    <p className="text-gray-600">Your appointments will appear here once patients book with you</p>
                </div>
            )}

            {/* Summary Stats */}
            {appointmentsData && appointmentsData.data && appointmentsData.data.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointments Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-teal-50 rounded-lg">
                            <div className="text-2xl font-bold text-teal-600">
                                {appointmentsData.data.length}
                            </div>
                            <div className="text-sm text-gray-600">Total Appointments</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                                {appointmentsData.data.filter((apt: TDetailedAppointment) => apt.status === 'Confirmed').length}
                            </div>
                            <div className="text-sm text-gray-600">Confirmed</div>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                            <div className="text-2xl font-bold text-yellow-600">
                                {appointmentsData.data.filter((apt: TDetailedAppointment) => apt.status === 'Pending').length}
                            </div>
                            <div className="text-sm text-gray-600">Pending</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-gray-600">
                                KSh {appointmentsData.data.reduce((total: number, apt: TDetailedAppointment) => total + parseFloat(apt.totalAmount), 0).toFixed(0)}
                            </div>
                            <div className="text-sm text-gray-600">Total Revenue</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorAppointments;