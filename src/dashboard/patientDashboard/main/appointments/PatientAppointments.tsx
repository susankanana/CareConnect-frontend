import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../app/store";
import { appointmentsAPI, type TDetailedAppointment } from "../../../../reducers/appointments/appointmentsAPI";
import { paymentsAPI} from "../../../../reducers/payments/paymentsAPI";
import { CreditCard, ArrowRight, Loader, Shield, Receipt, Smartphone, CheckCircle, XCircle, Calendar, Plus, Clock, Stethoscope} from "lucide-react";
import { toast } from "sonner";
import CreateAppointment from "./CreateAppointment";
import { prescriptionsAPI } from "../../../../reducers/prescriptions/prescriptionsAPI";

const PatientAppointments = () => {
    const [showCheckout, setShowCheckout] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<TDetailedAppointment | null>(null);
    const [prescriptionAmount, setPrescriptionAmount] = useState("0.00");
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'Stripe' | 'M-Pesa'>('Stripe');
    const [mpesaPhone, setMpesaPhone] = useState('');
    const [isPollingPayment, setIsPollingPayment] = useState(false);

    const user = useSelector((state: RootState) => state.user.user);
    const userId = user?.user_id;

    const [createCheckoutSession, { isLoading: isCreatingSession }] = paymentsAPI.useCreateCheckoutSessionMutation();
    const [initiateMpesaPayment, { isLoading: isInitiatingMpesa }] = paymentsAPI.useInitiateMpesaPaymentMutation();

    const { data: appointmentsData, isLoading, error, refetch } = appointmentsAPI.useGetAppointmentsByUserIdQuery(
        userId ?? 0,
        {
            skip: !userId,
            refetchOnMountOrArgChange: true,
            pollingInterval: 60000,
        }
    );
    
    // Get prescriptions for calculating total amount
    const { data: prescriptionsData } = prescriptionsAPI.useGetPrescriptionsByPatientIdQuery(
        userId || 0,
        { skip: !userId }
    );

    // M-Pesa payment status polling
    const [checkPaymentStatus] = paymentsAPI.useLazyCheckPaymentStatusByAppointmentIdQuery();

    useEffect(() => {
        if (!isPollingPayment || !selectedAppointment?.appointmentId) return;

        const pollPaymentStatus = async () => {
            try {
                const result = await checkPaymentStatus(selectedAppointment.appointmentId).unwrap();
                
                if (result.status === 'Paid' || result.status === 'completed' || result.status === 'success') {
                    setIsPollingPayment(false);
                    toast.success("M-Pesa payment confirmed!");
                    setShowSuccess(true); // Show success page
                } else if (result.status === 'Failed' || result.status === 'failed' || result.status === 'cancelled') {
                    setIsPollingPayment(false);
                    toast.error("Payment failed. Please try again.");
                }
            } catch (error) {
                console.error("Error checking payment status:", error);
                // Continue polling on error, don't stop
            }
        };

        // Poll immediately, then every 5 seconds
        pollPaymentStatus();
        const intervalId = setInterval(pollPaymentStatus, 5000);

        // Stop polling after 5 minutes (60 attempts)
        const timeoutId = setTimeout(() => {
            clearInterval(intervalId);
            setIsPollingPayment(false);
            toast.error("Payment confirmation timeout. Please check your payment status.");
        }, 300000); // 5 minutes

        return () => {
            clearInterval(intervalId);
            clearTimeout(timeoutId);
        };
    }, [isPollingPayment, selectedAppointment?.appointmentId, checkPaymentStatus]);
    
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
    

    // Handle proceeding to checkout
    const handleProceedToCheckout = async () => {
        if (!selectedAppointment?.appointmentId) {
            toast.error("No appointment selected for payment");
            return;
        }

        if (selectedPaymentMethod === 'M-Pesa') {
            if (!mpesaPhone || mpesaPhone.length < 10) {
                toast.error("Please enter a valid M-Pesa phone number");
                return;
            }

            try {
                await initiateMpesaPayment({
                    appointmentId: selectedAppointment.appointmentId,
                    phone: mpesaPhone
                }).unwrap();

                toast.success("M-Pesa payment initiated! Please check your phone for the payment prompt.");
                setIsPollingPayment(true); // Start polling for payment status
            } catch (error: any) {
                console.error("M-Pesa payment error:", error);
                toast.error(error.data?.message || "Failed to initiate M-Pesa payment");
            }
            return;
        }

        // Handle Stripe payment
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

    // Payment success screen
    if (showSuccess && selectedAppointment) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-2xl mx-auto px-4">
                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="h-12 w-12 text-green-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
                        <p className="text-gray-600 mb-8">
                            Your payment has been confirmed and your appointment is now secured. You will receive a confirmation email shortly.
                        </p>

                        <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                            <h3 className="font-semibold text-gray-900 mb-4">Payment Details</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-medium">Appointment ID:</span> #{selectedAppointment.appointmentId}
                                </div>
                                <div>
                                    <span className="font-medium">Doctor:</span> Dr. {selectedAppointment.doctor?.name} {selectedAppointment.doctor?.lastName}
                                </div>
                                <div>
                                    <span className="font-medium">Date:</span> {new Date(selectedAppointment.appointmentDate).toLocaleDateString()}
                                </div>
                                <div>
                                    <span className="font-medium">Time:</span> {formatTimeSlot(selectedAppointment.timeSlot)}
                                </div>
                                <div>
                                    <span className="font-medium">Amount Paid:</span> KSh {parseFloat(selectedAppointment.totalAmount).toFixed(2)}
                                </div>
                                <div>
                                    <span className="font-medium">Payment Method:</span> {selectedPaymentMethod}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => {
                                    setShowSuccess(false);
                                    setShowCheckout(false);
                                    setSelectedAppointment(null);
                                    setPrescriptionAmount("0.00");
                                    setSelectedPaymentMethod('Stripe');
                                    setMpesaPhone('');
                                    setIsPollingPayment(false);
                                    refetch(); // Refresh appointments list
                                }}
                                className="bg-teal-600 text-white px-8 py-3 rounded-lg hover:bg-teal-700 transition-colors font-semibold"
                            >
                                Back to Appointments
                            </button>
                            <button
                                onClick={() => (document.getElementById('create_appointment_modal') as HTMLDialogElement)?.showModal()}
                                className="border-2 border-teal-600 text-teal-600 px-8 py-3 rounded-lg hover:bg-teal-50 transition-colors font-semibold"
                            >
                                Book Another Appointment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

     if (showCheckout && selectedAppointment) {
        return (
            <div className="bg-gray-50 min-h-screen p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Receipt className="h-6 w-6 text-teal-600" />
                            Payment Summary
                        </h2>
                            
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3">Appointment Details</h3>
                                <div className="space-y-2 text-sm">
                                    <p><span className="font-medium">Date:</span> {new Date(selectedAppointment.appointmentDate).toLocaleDateString()}</p>
                                    <p><span className="font-medium">Time:</span> {selectedAppointment.timeSlot}</p>
                                    <p><span className="font-medium">Doctor:</span> Dr. {selectedAppointment.doctor.name} {selectedAppointment.doctor.lastName}</p>
                                    <p><span className="font-medium">Specialty:</span> {selectedAppointment.doctor.specialization}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3">Payment Breakdown</h3>
                                <div className="bg-teal-50 rounded-xl shadow-md p-6 mb-8 border border-teal-100">
                                    <h3 className="text-lg font-semibold text-teal-700 mb-6 flex items-center gap-2">
                                    <CreditCard className="h-5 w-5 text-teal-600" />
                                        Payment Breakdown
                                    </h3>

                                    <div className="space-y-4 text-sm text-gray-700">
                                        <div className="flex justify-between">
                                            <span>Consultation Fee</span>
                                            <span className="font-medium text-gray-900">
                                                KSh 6,500
                                            </span>
                                        </div>

                                        true && (
                                        <div className="flex justify-between">
                                            <span>Prescription Charges</span>
                                            <span className="font-medium text-gray-900">
                                                KSh {parseFloat(prescriptionAmount).toFixed(2)}
                                            </span>
                                        </div>
                                      )

                                        <hr className="border-t border-gray-200" />

                                        <div className="flex justify-between items-center pt-2">
                                            <span className="text-base font-semibold text-gray-900">Total Amount</span>
                                            <span className="text-xl font-bold text-teal-600">
                                                KSh {parseFloat(selectedAppointment.totalAmount).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Payment Method Selection */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-teal-600" />
                            Select Payment Method
                        </h3>
                            
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            {/* Stripe Option */}
                            <div
                                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                                    selectedPaymentMethod === 'Stripe'
                                        ? 'border-teal-500 bg-teal-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => setSelectedPaymentMethod('Stripe')}
                            >
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="Stripe"
                                        checked={selectedPaymentMethod === 'Stripe'}
                                        onChange={() => setSelectedPaymentMethod('Stripe')}
                                        className="text-teal-600 focus:ring-teal-500"
                                    />
                                    <CreditCard className="h-6 w-6 text-blue-600" />
                                    <div>
                                        <p className="font-medium text-gray-900">Credit/Debit Card</p>
                                        <p className="text-sm text-gray-600">Secure payment via Stripe</p>
                                    </div>
                                </div>
                            </div>

                            {/* M-Pesa Option */}
                            <div
                                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                                    selectedPaymentMethod === 'M-Pesa'
                                        ? 'border-teal-500 bg-teal-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => setSelectedPaymentMethod('M-Pesa')}
                            >
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="M-Pesa"
                                        checked={selectedPaymentMethod === 'M-Pesa'}
                                        onChange={() => setSelectedPaymentMethod('M-Pesa')}
                                        className="text-teal-600 focus:ring-teal-500"
                                    />
                                    <Smartphone className="h-6 w-6 text-green-600" />
                                    <div>
                                        <p className="font-medium text-gray-900">M-Pesa</p>
                                        <p className="text-sm text-gray-600">Mobile money payment</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* M-Pesa Phone Number Input */}
                        {selectedPaymentMethod === 'M-Pesa' && (
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    M-Pesa Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={mpesaPhone}
                                    onChange={(e) => setMpesaPhone(e.target.value)}
                                    placeholder="254712345678"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Enter your M-Pesa registered phone number (format: 254XXXXXXXXX)
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            data-test="back-to-appointments-btn"
                            onClick={() => {
                                setShowCheckout(false);
                                setSelectedAppointment(null);
                                setPrescriptionAmount("0.00");
                                setSelectedPaymentMethod('Stripe');
                                setMpesaPhone('');
                                setIsPollingPayment(false);
                            }}
                            className="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                        >
                            Back to Appointments
                        </button>
                        <button
                            data-test="proceed-to-checkout-btn"
                            onClick={handleProceedToCheckout}
                            disabled={isCreatingSession || isInitiatingMpesa || isPollingPayment || (selectedPaymentMethod === 'M-Pesa' && !mpesaPhone)}
                            className="flex-1 bg-gradient-to-r from-teal-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-teal-600 hover:to-pink-600 transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {(isCreatingSession || isInitiatingMpesa || isPollingPayment) ? (
                                <>
                                    <Loader className="h-5 w-5 animate-spin" />
                                    <span>
                                        {isPollingPayment ? 'Waiting for payment confirmation...' : 'Processing...'}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span>
                                        {selectedPaymentMethod === 'M-Pesa' ? 'Pay with M-Pesa' : 'Proceed to Checkout'}
                                    </span>
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
                                {selectedPaymentMethod === 'Stripe' 
                                    ? 'Secure payment powered by Stripe. Your payment information is encrypted and protected.'
                                    : isPollingPayment 
                                        ? 'Please complete the payment on your phone. We are waiting for confirmation...'
                                        : 'Secure M-Pesa payment. You will receive an STK push notification on your phone.'
                                }
                            </span>
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
                        data-test="book-appointment-btn"
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
                                        data-test="pay-now-btn"
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