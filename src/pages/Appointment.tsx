import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { appointmentsAPI } from '../../src/reducers/appointments/appointmentsAPI';
import { paymentsAPI } from '../reducers/payments/paymentsAPI';
import { prescriptionsAPI } from '../reducers/prescriptions/prescriptionsAPI';
import { toast } from 'sonner';
import {
  Calendar,
  User,
  Stethoscope,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Shield,
  Star,
  Receipt,
  ArrowRight,
  Loader,
  Smartphone,
} from 'lucide-react';

// Import the doctors API hook and type
import { useGetDoctorsQuery, type TDoctor } from '../reducers/doctors/doctorsAPI';

// Define a default consultation fee
const DEFAULT_CONSULTATION_FEE = '6500.00'; // Example default fee

type AppointmentInputs = {
  doctorId: number;
  appointmentDate: string;
  timeSlot: string;
  totalAmount: string; // Added totalAmount back to the type
};

const schema = yup.object({
  doctorId: yup.number().required('Please select a doctor'),
  appointmentDate: yup
    .string()
    .required('Appointment date is required')
    .test('future-date', 'Appointment date must be in the future', function (value) {
      if (!value) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const appointmentDate = new Date(value);
      return appointmentDate >= today;
    }),
  timeSlot: yup.string().required('Please select a time slot'),
  totalAmount: yup.string().required(), // Schema for totalAmount
});

const timeSlots = [
  '09:00:00',
  '09:30:00',
  '10:00:00',
  '10:30:00',
  '11:00:00',
  '11:30:00',
  '14:00:00',
  '14:30:00',
  '15:00:00',
  '15:30:00',
  '16:00:00',
  '16:30:00',
];

const Appointments = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<TDoctor | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState<any>(null);
  const [prescriptionAmount, setPrescriptionAmount] = useState('0.00');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'Stripe' | 'M-Pesa'>('Stripe');
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [isPollingPayment, setIsPollingPayment] = useState(false);

  const user = useSelector((state: RootState) => state.user.user);
  const isLoggedIn = useSelector((state: RootState) => !!state.user.token);

  const [createAppointment, { isLoading }] = appointmentsAPI.useCreateAppointmentMutation();
  const [createCheckoutSession, { isLoading: isCreatingSession }] =
    paymentsAPI.useCreateCheckoutSessionMutation();
  const [initiateMpesaPayment, { isLoading: isInitiatingMpesa }] =
    paymentsAPI.useInitiateMpesaPaymentMutation();

  // M-Pesa payment status polling
  const [checkPaymentStatus] = paymentsAPI.useLazyCheckPaymentStatusByAppointmentIdQuery();

  useEffect(() => {
    if (!isPollingPayment || !appointmentDetails?.appointmentId) return;

    const pollPaymentStatus = async () => {
      try {
        const result = await checkPaymentStatus(appointmentDetails.appointmentId).unwrap();

        if (result.status === 'Paid') {
          setIsPollingPayment(false);
          toast.success('M-Pesa payment confirmed!');
          setIsSubmitted(true); // Navigate to success page
        } else if (result.status === 'Failed') {
          setIsPollingPayment(false);
          toast.error('Payment failed. Please try again.');
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
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
      toast.error('Payment confirmation timeout. Please check your payment status.');
    }, 300000); // 5 minutes

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [isPollingPayment, appointmentDetails?.appointmentId, checkPaymentStatus]);

  // Get prescriptions for the appointment to calculate total
  const { data: prescriptionsData } = prescriptionsAPI.useGetPrescriptionsByPatientIdQuery(
    user?.user_id || 0,
    { skip: !user?.user_id }
  );

  // Fetch doctors data using the Redux Toolkit Query hook
  const {
    data: doctorsData,
    error: doctorsError,
    isLoading: doctorsLoading,
  } = useGetDoctorsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 60000,
  });

  // Access the data array from the response, default to empty array if not available
  const doctors = doctorsData?.data || [];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<AppointmentInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      totalAmount: DEFAULT_CONSULTATION_FEE, // Set default value for totalAmount
    },
  });

  const watchedValues = watch();

  // Update selected doctor when doctorId changes
  useEffect(() => {
    if (watchedValues.doctorId && doctors.length > 0) {
      const doctor = doctors.find(
        (d: TDoctor) => d.doctor?.doctorId === Number(watchedValues.doctorId)
      );
      setSelectedDoctor(doctor || null);
    }
  }, [watchedValues.doctorId, doctors]); // Add doctors to dependency array

  const formatTimeSlot = (timeSlot: string | undefined) => {
    if (!timeSlot) return 'N/A';
    const [hours, minutes] = timeSlot.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const isDateAvailable = (dateString: string, doctor: TDoctor) => {
    if (!doctor || !doctor.doctor?.availableDays) return false;

    const dayName = getDayName(dateString);
    return (
      Array.isArray(doctor.doctor.availableDays) && doctor.doctor.availableDays.includes(dayName)
    );
  };

  // Calculate total amount including prescriptions
  const calculateTotalAmount = () => {
    const consultationFee = parseFloat(DEFAULT_CONSULTATION_FEE);
    const totalPrescriptionAmount =
      prescriptionsData?.data?.reduce((sum, prescription) => {
        return sum + parseFloat(prescription.amount || '0.00');
      }, 0) || 0;

    return (consultationFee + totalPrescriptionAmount).toFixed(2);
  };

  // Handle proceeding to checkout
  const handleProceedToCheckout = async () => {
    if (!appointmentDetails?.appointmentId) {
      toast.error('No appointment found for checkout');
      return;
    }

    if (selectedPaymentMethod === 'M-Pesa') {
      if (!mpesaPhone || mpesaPhone.length < 10) {
        toast.error('Please enter a valid M-Pesa phone number');
        return;
      }

      try {
        await initiateMpesaPayment({
          appointmentId: appointmentDetails.appointmentId,
          phone: mpesaPhone,
        }).unwrap();

        toast.success('M-Pesa payment initiated! Please check your phone for the payment prompt.');
        setIsPollingPayment(true); // Start polling for payment status
      } catch (error: any) {
        console.error('M-Pesa payment error:', error);
        toast.error(error.data?.message || 'Failed to initiate M-Pesa payment');
      }
      return;
    }

    // Handle Stripe payment
    try {
      const response = await createCheckoutSession({
        appointmentId: appointmentDetails.appointmentId,
      }).unwrap();

      if (response.url) {
        window.location.href = response.url;
      } else {
        toast.error('Failed to create checkout session');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.data?.message || 'Failed to proceed to checkout');
    }
  };

  const onSubmit: SubmitHandler<AppointmentInputs> = async (data) => {
    if (!isLoggedIn || !user) {
      toast.error('Please login to book an appointment');
      return;
    }

    if (!selectedDoctor) {
      toast.error('Please select a doctor.');
      return;
    }

    if (!isDateAvailable(data.appointmentDate, selectedDoctor)) {
      toast.error(`Doctor is not available on ${getDayName(data.appointmentDate)}.`);
      return;
    }

    try {
      const appointmentData = {
        ...data,
        userId: user.user_id,
        doctorId: Number(data.doctorId),
        totalAmount: DEFAULT_CONSULTATION_FEE,
      };

      // The key change: Access response.data
      const response = await createAppointment(appointmentData).unwrap();

      setAppointmentDetails({
        ...response.data,
        doctor: selectedDoctor,
        patient: user,
      });
      setShowCheckout(true);
      setIsSubmitted(false);
      toast.success('Appointment booked successfully!');
    } catch (error: any) {
      console.error('Appointment booking error:', error);
      toast.error(error.data?.message || 'Failed to book appointment. Please try again.');
    }
  };

  // Checkout prompt after successful appointment booking
  if (showCheckout && appointmentDetails) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Appointment Booked!</h1>
              <p className="text-gray-600">
                Your appointment has been successfully scheduled. Please proceed to payment to
                confirm your booking.
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
                  <span>Doctor:</span>
                  <span className="font-medium">
                    {appointmentDetails.doctor?.user?.firstName}{' '}
                    {appointmentDetails.doctor?.user?.lastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Specialization:</span>
                  <span className="font-medium">
                    {appointmentDetails.doctor?.doctor?.specialization}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="font-medium">
                    {new Date(appointmentDetails.appointmentDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span className="font-medium">{formatTimeSlot(appointmentDetails.timeSlot)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Appointment ID:</span>
                  <span className="font-medium">#{appointmentDetails.appointmentId}</span>
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
                  <span>Consultation Fee:</span>
                  <span>KSh {parseFloat(DEFAULT_CONSULTATION_FEE).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Prescription Fee:</span>
                  <span>KSh {parseFloat(prescriptionAmount).toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Amount:</span>
                    <span className="text-teal-600">KSh {calculateTotalAmount()}</span>
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
                onClick={() => {
                  setShowCheckout(false);
                  setIsSubmitted(false);
                  setAppointmentDetails(null);
                  setSelectedDoctor(null);
                  setPrescriptionAmount('0.00');
                  setSelectedPaymentMethod('Stripe');
                  setMpesaPhone('');
                  setIsPollingPayment(false);
                  reset();
                }}
                className="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Back to Booking
              </button>
              <button
                onClick={handleProceedToCheckout}
                disabled={
                  isCreatingSession ||
                  isInitiatingMpesa ||
                  isPollingPayment ||
                  (selectedPaymentMethod === 'M-Pesa' && !mpesaPhone)
                }
                className="flex-1 bg-gradient-to-r from-teal-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-teal-600 hover:to-pink-600 transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreatingSession || isInitiatingMpesa || isPollingPayment ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    <span>
                      {isPollingPayment ? 'Waiting for payment confirmation...' : 'Processing...'}
                    </span>
                  </>
                ) : (
                  <>
                    <span>
                      {selectedPaymentMethod === 'M-Pesa'
                        ? 'Pay with M-Pesa'
                        : 'Proceed to Checkout'}
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
                      : 'Secure M-Pesa payment. You will receive an STK push notification on your phone.'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Final success page after payment
  if (isSubmitted && appointmentDetails) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
            <p className="text-gray-600 mb-8">
              Your appointment has been confirmed and payment processed. You will receive a
              confirmation email shortly.
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-gray-900 mb-4">Appointment Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Doctor:</span>{' '}
                  {appointmentDetails.doctor?.user?.firstName}{' '}
                  {appointmentDetails.doctor?.user?.lastName}
                </div>
                <div>
                  <span className="font-medium">Specialization:</span>{' '}
                  {appointmentDetails.doctor?.doctor?.specialization}
                </div>
                <div>
                  <span className="font-medium">Date:</span>{' '}
                  {new Date(appointmentDetails.appointmentDate).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">Time:</span>{' '}
                  {formatTimeSlot(appointmentDetails.timeSlot)}
                </div>
                <div>
                  <span className="font-medium">Total Paid:</span> KSh {calculateTotalAmount()}
                </div>
                <div>
                  <span className="font-medium">Appointment ID:</span> #
                  {appointmentDetails.appointmentId}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setShowCheckout(false);
                  setAppointmentDetails(null);
                  setSelectedDoctor(null);
                  setPrescriptionAmount('0.00');
                  setSelectedPaymentMethod('Stripe');
                  setMpesaPhone('');
                  setIsPollingPayment(false);
                  reset();
                }}
                className="bg-teal-600 text-white px-8 py-3 rounded-lg hover:bg-teal-700 transition-colors font-semibold"
              >
                Book Another Appointment
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="border-2 border-teal-600 text-teal-600 px-8 py-3 rounded-lg hover:bg-teal-50 transition-colors font-semibold"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-pink-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-white/20 p-3 rounded-full">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Book an Appointment</h1>
          </div>
          <p className="text-xl text-teal-100 max-w-2xl mx-auto">
            Schedule your consultation with our experienced medical professionals
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {!isLoggedIn && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-yellow-600" />
              <span className="text-yellow-800 font-medium">
                Please{' '}
                <a href="/login" className="text-teal-600 hover:underline">
                  login
                </a>{' '}
                to book an appointment
              </span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Doctor Selection */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Stethoscope className="h-6 w-6 text-teal-600" />
              Select a Doctor
            </h2>

            {doctorsLoading && <p className="text-center text-gray-700">Loading doctors...</p>}
            {!!doctorsError && (
              <p className="text-center text-red-500">
                Error fetching doctors. Please try again later.
              </p>
            )}

            {!doctorsLoading && !doctorsError && doctors.length === 0 && (
              <p className="text-center text-gray-700">No doctors available at this time.</p>
            )}

            {!doctorsLoading && !doctorsError && doctors.length > 0 && (
              <div className="grid md:grid-cols-3 gap-6">
                {doctors.map((doctor: TDoctor) => (
                  <div
                    key={doctor.doctor?.doctorId}
                    className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                      selectedDoctor?.doctor?.doctorId === doctor.doctor?.doctorId
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() =>
                      doctor.doctor?.doctorId && setValue('doctorId', doctor.doctor.doctorId)
                    }
                  >
                    <input
                      type="radio"
                      {...register('doctorId', { valueAsNumber: true })}
                      value={doctor.doctor?.doctorId || ''}
                      className="sr-only"
                    />
                    <img
                      src={doctor.user?.image_url || 'https://via.placeholder.com/400'}
                      alt={`${doctor.user?.firstName} ${doctor.user?.lastName}`}
                      className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
                    />
                    <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                      {doctor.user?.firstName} {doctor.user?.lastName}
                    </h3>
                    <p className="text-teal-600 font-medium text-center mb-2">
                      {doctor.doctor?.specialization}
                    </p>
                    <div className="flex items-center justify-center space-x-1 mb-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{doctor.doctor?.rating || 'N/A'}</span>
                    </div>
                    <p className="text-sm text-gray-600 text-center mb-3">
                      {doctor.doctor?.experience != null
                        ? `${doctor.doctor.experience} years experience`
                        : 'N/A'}
                    </p>
                    <div className="text-center">
                      <span className="text-lg font-bold text-gray-900">
                        KSh {parseFloat(DEFAULT_CONSULTATION_FEE).toFixed(2)}
                      </span>
                      <p className="text-xs text-gray-500">Consultation Fee</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {errors.doctorId && (
              <span className="text-red-600 text-sm mt-2 block">{errors.doctorId.message}</span>
            )}
          </div>

          {/* Date and Time Selection */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Calendar className="h-6 w-6 text-teal-600" />
              Select Date & Time
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Appointment Date
                </label>
                <input
                  type="date"
                  {...register('appointmentDate')}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
                {errors.appointmentDate && (
                  <span className="text-red-600 text-sm mt-1 block">
                    {errors.appointmentDate.message}
                  </span>
                )}

                {selectedDoctor && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Available Days:</strong>{' '}
                      {selectedDoctor.doctor?.availableDays?.join(', ') || 'Not specified'}
                    </p>
                    {watchedValues.appointmentDate &&
                      !isDateAvailable(watchedValues.appointmentDate, selectedDoctor) && (
                        <p className="text-sm text-red-600 mt-1">
                          Doctor is not available on {getDayName(watchedValues.appointmentDate)}
                        </p>
                      )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Slot</label>
                <select
                  {...register('timeSlot')}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  disabled={!selectedDoctor || !watchedValues.appointmentDate}
                >
                  <option value="">Select a time slot</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {formatTimeSlot(slot)}
                    </option>
                  ))}
                </select>
                {errors.timeSlot && (
                  <span className="text-red-600 text-sm mt-1 block">{errors.timeSlot.message}</span>
                )}
                {(!selectedDoctor || !watchedValues.appointmentDate) && (
                  <p className="text-sm text-gray-500 mt-2 p-2 bg-gray-100 rounded-lg">
                    Please select a doctor and an appointment date to see available time slots.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Summary */}
          {selectedDoctor && watchedValues.appointmentDate && watchedValues.timeSlot && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-teal-600" />
                Appointment Summary
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Doctor</p>
                      <p className="text-gray-600">
                        {selectedDoctor.user?.firstName} {selectedDoctor.user?.lastName}
                      </p>
                      <p className="text-sm text-teal-600">
                        {selectedDoctor.doctor?.specialization}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Date & Time</p>
                      <p className="text-gray-600">
                        {new Date(watchedValues.appointmentDate).toLocaleDateString()} at{' '}
                        {formatTimeSlot(watchedValues.timeSlot)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-teal-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium text-gray-900">Consultation Fee</span>
                    <span className="text-2xl font-bold text-teal-600">
                      KSh {parseFloat(DEFAULT_CONSULTATION_FEE).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-teal-700">
                    <CreditCard className="h-4 w-4" />
                    <span>Payment due at appointment</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={
                isLoading || !isLoggedIn || doctorsLoading || !!doctorsError || doctors.length === 0
              }
              className="bg-gradient-to-r from-teal-500 to-pink-500 text-white px-12 py-4 rounded-lg hover:from-teal-600 hover:to-pink-600 transition-all font-semibold text-lg flex items-center justify-center space-x-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  <span>Booking Appointment...</span>
                </>
              ) : (
                <>
                  <Calendar className="h-5 w-5" />
                  <span>Book Appointment</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Contact Information */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Need Help?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-teal-600" />
              <div>
                <p className="font-medium text-gray-900">Call Us</p>
                <p className="text-gray-600">+254 700 123 456</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-teal-600" />
              <div>
                <p className="font-medium text-gray-900">Email Us</p>
                <p className="text-gray-600">appointments@careconnect.co.ke</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-teal-600" />
              <div>
                <p className="font-medium text-gray-900">Visit Us</p>
                <p className="text-gray-600">123 Healthcare Avenue, Nairobi</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
