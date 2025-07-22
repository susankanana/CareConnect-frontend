import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../app/store";
import { appointmentsAPI, type TDetailedAppointment } from "../../../../reducers/appointments/appointmentsAPI";
import { paymentsAPI } from "../../../../reducers/payments/paymentsAPI";
import { prescriptionsAPI } from "../../../../reducers/prescriptions/prescriptionsAPI";
import { Calendar, Stethoscope, Clock, CreditCard, XCircle, Plus, ArrowRight, Loader, Shield, Receipt, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import CreateAppointment from "./CreateAppointment";

const PatientAppointments = () => {
    const [showCheckout, setShowCheckout] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<TDetailedAppointment | null>(null);
    const [prescriptionAmount, setPrescriptionAmount] = useState("0.00");

    const user = useSelector((state: RootState) => state.user.user);
    const userId = user?.user_id;

    const { data: appointmentsData, isLoading, error, refetch } = appointmentsAPI.useGetAppointmentsByUserIdQuery(
        userId ?? 0,
        {
            skip: !userId,
            refetchOnMountOrArgChange: true,
            pollingInterval: 60000,
        }
    );

    const [createCheckoutSession, { isLoading: isCreatingSession }] = paymentsAPI.useCreateCheckoutSessionMutation();
    
    // Get prescriptions for calculating total amount
    const { data: prescriptionsData } = prescriptionsAPI.useGetPrescriptionsByPatientIdQuery(
        userId || 0,
        { skip: !userId }
    );

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

    // Calculate total amount including prescriptions for a specific appointment
    const calculateTotalAmount = (appointmentId: number) => {
        const appointmentPrescriptions = prescriptionsData?.data?.filter(
            prescription => prescription.appointmentId === appointmentId
        ) || [];
        
        const prescriptionTotal = appointmentPrescriptions.reduce((sum, prescription) => {
            return sum + parseFloat(prescription.amount || "0.00");
        }, 0);
        
        return prescriptionTotal.toFixed(2);
    };

    // Handle payment initiation
    const handlePayNow = (appointment: TDetailedAppointment) => {
        setSelectedAppointment(appointment);
        setPrescriptionAmount(calculateTotalAmount(appointment.appointmentId));
        setShowCheckout(true);
    };

    // Handle proceeding to checkout
    const handleProceedToCheckout = async () => {
        if (!selectedAppointment?.appointmentId) {
            toast.error("No appointment selected for payment");
            return;
        }

        try {
            const response = await createCheckoutSession({
                appointmentId: selectedAppointment.appointmentId
            }).unwrap();

            if (response.url) {
                window.location.href = response.url;
            } else {
                toast.error("Failed to create checkout session");
            }
        } catch (error: any) {
            console.error("Checkout error:", error);
            toast.error(error.data?.message || "Failed to proceed to checkout");
        }
    };

    // Check if appointment needs payment (you might want to add a payment status field to your appointment data)
    const needsPayment = (appointment: TDetailedAppointment) => {
        // For now, we'll assume confirmed appointments that haven't been paid need payment
        // You might want to add a paymentStatus field to your appointment data structure
        return appointment.status === 'Confirmed';
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

    // Checkout screen
    if (showCheckout && selectedAppointment) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-2xl mx-auto px-4">
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CreditCard className="h-12 w-12 text-teal-600" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">Complete Payment</h1>
                            <p className="text-gray-600">
                                Please proceed to payment to complete your appointment booking.
                            </p>
                        </div>

                        {/* Appointment Summary */}
                        <div className="bg-gray-50 rounded-lg p-6 mb-8">
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Receipt className="h-5 w-5 text-teal-600" />
                                Appointment Summary
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span>Appointment ID:</span>
                                    <span className="font-medium">#{selectedAppointment.appointmentId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Doctor:</span>
                                    <span className="font-medium">
                                        Dr. {selectedAppointment.doctor?.name} {selectedAppointment.doctor?.lastName}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Specialization:</span>
                                    <span className="font-medium">{selectedAppointment.doctor?.specialization}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Date:</span>
                                    <span className="font-medium">
                                        {new Date(selectedAppointment.appointmentDate).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Time:</span>
                                    <span className="font-medium">{formatTimeSlot(selectedAppointment.timeSlot)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Breakdown */}
                        <div className="bg-teal-50 rounded-lg p-6 mb-8">
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-teal-600" />
                                Payment Breakdown
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span>Total Amount:</span>
                                    <span className="text-lg font-bold text-teal-600">
                                        KSh {parseFloat(selectedAppointment.totalAmount).toFixed(2)}
                                    </span>
                                </div>
                                {parseFloat(prescriptionAmount) > 0 && (
                                    <div className="text-xs text-gray-600">
                                        (Includes consultation fee and prescription charges)
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => {
                                    setShowCheckout(false);
                                    setSelectedAppointment(null);
                                    setPrescriptionAmount("0.00");
                                }}
                                className="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                            >
                                Back to Appointments
                            </button>
                            <button
                                onClick={handleProceedToCheckout}
                                disabled={isCreatingSession}
                                className="flex-1 bg-gradient-to-r from-teal-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-teal-600 hover:to-pink-600 transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isCreatingSession ? (
                                    <>
                                        <Loader className="h-5 w-5 animate-spin" />
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Proceed to Checkout</span>
                                        <ArrowRight className="h-5 w-5" />
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Security Notice */}
                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <Shield className="h-5 w-5 text-blue-600" />
                                <span className="text-sm text-blue-800 font-medium">
                                    Secure payment powered by Stripe. Your payment information is encrypted and protected.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
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
                            View your medical appointments - {appointmentsData?.data?.length || 0} total appointments
                        </p>
                    </div>
                    <button
                        className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 shadow-md"
                        onClick={() => (document.getElementById('create_appointment_modal') as HTMLDialogElement)?.showModal()}
                    >
                        <Plus className="h-5 w-5" />
                        Book New Appointment
                    </button>
                </div>
            </div>

            {/* Modal */}
            <CreateAppointment refetch={refetch} />

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
                                {/* Doctor Information */}
                                <div className="mb-4">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <Stethoscope className="h-4 w-4 text-teal-600" />
                                        Doctor Information
                                    </h4>
                                    <div className="bg-teal-50 rounded-lg p-3">
                                        <p className="font-medium text-gray-900">
                                            Dr. {appointment.doctor?.name} {appointment.doctor?.lastName}
                                        </p>
                                        <p className="text-sm text-teal-600 font-medium">
                                            {appointment.doctor?.specialization}
                                        </p>
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

                                {/* Action Section */}
                                {needsPayment(appointment) ? (
                                    <button
                                        onClick={() => handlePayNow(appointment)}
                                        className="w-full bg-gradient-to-r from-teal-500 to-pink-500 text-white px-4 py-3 rounded-lg hover:from-teal-600 hover:to-pink-600 transition-all font-semibold flex items-center justify-center gap-2"
                                    >
                                        <CreditCard className="h-4 w-4" />
                                        Pay Now
                                    </button>
                                ) : (
                                    <div className={`p-3 rounded-lg text-center ${
                                        appointment.status === 'Confirmed' ? 'bg-green-50 border border-green-200' :
                                        appointment.status === 'Pending' ? 'bg-yellow-50 border border-yellow-200' :
                                        'bg-red-50 border border-red-200'
                                    }`}>
                                        <p className={`text-sm font-medium ${
                                            appointment.status === 'Confirmed' ? 'text-green-800' :
                                            appointment.status === 'Pending' ? 'text-yellow-800' :
                                            'text-red-800'
                                        }`}>
                                            {appointment.status === 'Confirmed' && 'Payment completed - Appointment confirmed'}
                                            {appointment.status === 'Pending' && 'Awaiting doctor confirmation'}
                                            {appointment.status === 'Cancelled' && 'This appointment was cancelled'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
                    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No appointments found</h3>
                    <p className="text-gray-600 mb-6">Book your first appointment with our medical professionals</p>
                    <button
                        className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 mx-auto"
                        onClick={() => (document.getElementById('create_appointment_modal') as HTMLDialogElement)?.showModal()}
                    >
                        <Plus className="h-5 w-5" />
                        Book Your First Appointment
                    </button>
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
                            <div className="text-sm text-gray-600">Total Spent</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientAppointments;