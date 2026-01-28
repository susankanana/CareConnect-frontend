import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../app/store';
import {
  appointmentsAPI,
  type TDetailedAppointment,
} from '../../../../reducers/appointments/appointmentsAPI';
import { paymentsAPI } from '../../../../reducers/payments/paymentsAPI';
import { prescriptionsAPI } from '../../../../reducers/prescriptions/prescriptionsAPI';
import {
  CreditCard,
  Loader,
  CheckCircle,
  Calendar,
  Plus,
  Clock,
  Stethoscope,
  Video,
  Smartphone,
  Receipt,
  CalendarClock,
} from 'lucide-react';
import { toast } from 'sonner';
import CreateAppointment from './CreateAppointment';

const PatientAppointments = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'Stripe' | 'M-Pesa'>('Stripe');
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [isPollingPayment, setIsPollingPayment] = useState(false);
  const [activeAppointmentId, setActiveAppointmentId] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const user = useSelector((state: RootState) => state.user.user);
  const userId = user?.user_id;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const [createCheckoutSession] = paymentsAPI.useCreateCheckoutSessionMutation();
  const [initiateMpesaPayment] = paymentsAPI.useInitiateMpesaPaymentMutation();
  const [checkPaymentStatus] = paymentsAPI.useLazyCheckPaymentStatusByAppointmentIdQuery();

  const {
    data: appointmentsData,
    isLoading,
    refetch,
  } = appointmentsAPI.useGetAppointmentsByUserIdQuery(userId ?? 0, {
    skip: !userId,
  });

  const { data: prescriptionsData } = prescriptionsAPI.useGetPrescriptionsByPatientIdQuery(
    userId ?? 0,
    {
      skip: !userId,
    }
  );

  // Polling Logic with Timeout Protection
  useEffect(() => {
    if (!isPollingPayment || !activeAppointmentId) return;

    const timeoutId = setTimeout(() => {
      setIsPollingPayment(false);
      setActiveAppointmentId(null);
      toast.error('Payment confirmation timed out.');
    }, 300000);

    const poll = async () => {
      try {
        const result = await checkPaymentStatus(activeAppointmentId).unwrap();
        // Added 'success' and 'Paid' to match all possible backend returns
        if (['Paid', 'completed', 'success', 'Confirmed'].includes(result.status)) {
          clearTimeout(timeoutId);
          setIsPollingPayment(false);
          setActiveAppointmentId(null);
          toast.success('Payment Confirmed!');
          refetch();
        }
      } catch (e) {
        console.error('Polling error:', e);
      }
    };

    // TRIGGER IMMEDIATELY
    poll();

    const interval = setInterval(poll, 5000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeoutId);
    };
  }, [isPollingPayment, activeAppointmentId, checkPaymentStatus, refetch]);

  const calculateDisplayAmount = (appointmentId: number) => {
    const BASE_FEE = 6500;
    const appointmentPrescriptions =
      prescriptionsData?.data?.filter((p) => p.appointmentId === appointmentId) || [];
    const prescriptionCost = appointmentPrescriptions.reduce(
      (sum, p) => sum + parseFloat(p.amount || '0'),
      0
    );
    return BASE_FEE + prescriptionCost;
  };

  const handlePayment = async (appointmentId: number) => {
    if (selectedPaymentMethod === 'M-Pesa') {
      // 1. Sanitize: Remove '+' and spaces, then ensure 254 format
      let cleanPhone = mpesaPhone.trim().replace(/\+/g, '');

      if (cleanPhone.startsWith('0')) {
        cleanPhone = '254' + cleanPhone.substring(1);
      } else if (cleanPhone.startsWith('7') || cleanPhone.startsWith('1')) {
        cleanPhone = '254' + cleanPhone;
      }

      // 2. Validate length (exactly 12 digits: 254XXXXXXXXX)
      if (cleanPhone.length !== 12) {
        return toast.error('Enter valid number (e.g., 2547XXXXXXXX)');
      }

      try {
        // 3. Explicitly cast ID to Number for the API
        await initiateMpesaPayment({
          appointmentId: Number(appointmentId),
          phone: cleanPhone,
        }).unwrap();

        setActiveAppointmentId(appointmentId);
        setIsPollingPayment(true);
        toast.info('STK Push sent to your phone');
      } catch (e: any) {
        console.error('M-Pesa Mutation Error:', e);
        const serverMsg = e?.data?.message || 'Check your phone format or balance';
        toast.error(`M-Pesa Error: ${serverMsg}`);
      }
    } else {
      // Stripe Logic
      try {
        const res = await createCheckoutSession({ appointmentId: Number(appointmentId) }).unwrap();
        if (res.url) window.location.href = res.url;
      } catch (e) {
        toast.error('Stripe initiation failed');
      }
    }
  };

  const canJoinVideoCall = (apt: TDetailedAppointment) => {
    if (!apt.videoUrl || apt.status !== 'Confirmed') return false;
    const [h, m] = apt.timeSlot.split(':').map(Number);
    const aptDate = new Date(apt.appointmentDate);
    aptDate.setHours(h, m, 0);
    return aptDate.getTime() - currentTime.getTime() <= 10 * 60 * 1000;
  };

  if (isLoading)
    return (
      <div className="flex justify-center p-20">
        <Loader className="animate-spin text-teal-600" size={40} />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-4xl border border-gray-100 shadow-sm gap-4">
        <div className="flex items-center gap-4">
          {/* icon container height matches the combined height of the text block */}
          <div className="bg-[#14b8a6] p-2.5 rounded-[15px] text-white shadow-md shadow-teal-100/50 flex items-center justify-center shrink-0">
            <CalendarClock size={24} strokeWidth={2.5} />
          </div>

          <div className="flex flex-col justify-center">
            <h1 className="text-2xl font-black text-[#003d3d] tracking-tight leading-none mb-1">
              My Medical History
            </h1>
            <p className="text-gray-400 text-xs font-medium leading-none">
              Manage your consultations and payments
            </p>
          </div>
        </div>

        <button
          onClick={() => (document.getElementById('create_appointment_modal') as any)?.showModal()}
          className="group relative flex items-center gap-2 bg-[#003d3d] hover:bg-[#00a18e] text-white px-8 py-4 rounded-2xl font-bold text-[11px] uppercase tracking-[0.15em] transition-all duration-300 shadow-xl shadow-[#003d3d]/10 active:scale-95"
        >
          <Plus size={16} className="transition-transform group-hover:rotate-90" />
          <span>book appointment</span>
        </button>
      </div>

      <CreateAppointment refetch={refetch} />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {appointmentsData?.data?.map((apt) => {
          const total = calculateDisplayAmount(apt.appointmentId);
          const isPaid = apt.status === 'Confirmed' && apt.videoUrl;
          const isPending = apt.status === 'Pending';
          const isConfirmedWaitPayment = apt.status === 'Confirmed' && !apt.videoUrl;

          return (
            <div
              key={apt.appointmentId}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col"
            >
              <div
                className={`p-4 border-b flex justify-between items-center ${isPaid ? 'bg-green-50/50' : 'bg-gray-50/50'}`}
              >
                <div className="flex items-center gap-2">
                  <Receipt size={16} className="text-gray-400" />
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Appointment ID: #{apt.appointmentId}
                  </span>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${isPaid ? 'bg-white border-green-200 text-green-600' : isPending ? 'bg-white border-yellow-200 text-yellow-600' : 'bg-white border-blue-200 text-blue-600'}`}
                >
                  {apt.status}
                </div>
              </div>

              <div className="p-5 space-y-4 grow">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700">
                    <Stethoscope size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 leading-tight">
                      Dr. {apt.doctor?.name} {apt.doctor?.lastName}
                    </h3>
                    <p className="text-xs text-teal-600 font-medium">
                      {apt.doctor?.specialization}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 py-3 border-y border-dashed border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={14} />
                    <span className="text-xs font-medium">
                      {new Date(apt.appointmentDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 justify-end">
                    <Clock size={14} />
                    <span className="text-xs font-medium">{apt.timeSlot}</span>
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                      Total Payable
                    </p>
                    <p className="text-xl font-black text-gray-900">KSh {total.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 mt-auto space-y-3">
                {apt.status === 'Confirmed' && apt.videoUrl && (
                  <button
                    disabled={!canJoinVideoCall(apt)}
                    onClick={() => window.open(apt.videoUrl!, '_blank')}
                    className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md ${canJoinVideoCall(apt) ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer' : 'bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-300'}`}
                  >
                    <Video size={18} />{' '}
                    {canJoinVideoCall(apt) ? 'Join Video Call' : `Join at ${apt.timeSlot}`}
                  </button>
                )}

                {isPaid ? (
                  <div className="w-full py-3 rounded-xl bg-green-50 text-green-700 border border-green-100 flex items-center justify-center gap-2">
                    <CheckCircle size={18} />
                    <span className="font-bold text-sm">Payment Verified</span>
                  </div>
                ) : isConfirmedWaitPayment ? (
                  <div className="space-y-3 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedPaymentMethod('Stripe')}
                        className={`flex-1 py-2 text-xs rounded-lg font-bold flex items-center justify-center gap-1 transition-all ${selectedPaymentMethod === 'Stripe' ? 'bg-white shadow-sm text-blue-600 border border-blue-100' : 'text-gray-400'}`}
                      >
                        <CreditCard size={14} /> Stripe
                      </button>
                      <button
                        onClick={() => setSelectedPaymentMethod('M-Pesa')}
                        className={`flex-1 py-2 text-xs rounded-lg font-bold flex items-center justify-center gap-1 transition-all ${selectedPaymentMethod === 'M-Pesa' ? 'bg-white shadow-sm text-green-600 border border-green-100' : 'text-gray-400'}`}
                      >
                        <Smartphone size={14} /> M-Pesa
                      </button>
                    </div>
                    {selectedPaymentMethod === 'M-Pesa' && (
                      <input
                        type="text"
                        placeholder="M-Pesa Number (e.g 07...)"
                        className="w-full text-sm border-gray-200 border p-2.5 rounded-xl outline-none"
                        value={mpesaPhone}
                        onChange={(e) => setMpesaPhone(e.target.value)}
                      />
                    )}
                    <button
                      disabled={isPollingPayment && activeAppointmentId === apt.appointmentId}
                      onClick={() => handlePayment(apt.appointmentId)}
                      className="w-full bg-linear-to-r from-teal-500 to-pink-500 text-white py-3.5 rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                      {isPollingPayment && activeAppointmentId === apt.appointmentId ? (
                        <>
                          <Loader className="animate-spin" size={18} /> Awaiting Confirmation...
                        </>
                      ) : (
                        <>Pay KSh {total.toLocaleString()}</>
                      )}
                    </button>
                  </div>
                ) : isPending ? (
                  <div className="w-full py-4 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center gap-2">
                    <Clock size={18} className="animate-pulse" />
                    <span className="text-sm font-medium">Awaiting doctor confirmation</span>
                  </div>
                ) : (
                  <div className="text-center p-3 text-red-500 text-sm font-bold bg-red-50 rounded-xl border border-red-100">
                    Appointment Cancelled
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {/* Summary Stats */}
      {appointmentsData?.data && appointmentsData.data.length > 0 && (
        <div className="mt-12 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-[#d91e5b] rounded-full" />
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">
              Appointments <span className="text-[#003d3d]/40 font-medium">Summary</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Card */}
            <div className="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-teal-50 rounded-2xl text-teal-600">
                  <Calendar size={20} />
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Lifetime
                </span>
              </div>
              <div className="text-3xl font-black text-gray-900 leading-none">
                {appointmentsData.data.length}
              </div>
              <div className="text-sm font-bold text-gray-500 mt-2">Total Bookings</div>
            </div>

            {/* Confirmed Card */}
            <div className="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-50 rounded-2xl text-green-600">
                  <CheckCircle size={20} />
                </div>
                <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">
                  Verified
                </span>
              </div>
              <div className="text-3xl font-black text-gray-900 leading-none">
                {
                  appointmentsData.data.filter(
                    (apt: TDetailedAppointment) => apt.status === 'Confirmed'
                  ).length
                }
              </div>
              <div className="text-sm font-bold text-gray-500 mt-2">Confirmed</div>
            </div>

            {/* Pending Card */}
            <div className="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-amber-50 rounded-2xl text-amber-600">
                  <Clock size={20} />
                </div>
                <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">
                  In Review
                </span>
              </div>
              <div className="text-3xl font-black text-gray-900 leading-none">
                {
                  appointmentsData.data.filter(
                    (apt: TDetailedAppointment) => apt.status === 'Pending'
                  ).length
                }
              </div>
              <div className="text-sm font-bold text-gray-500 mt-2">Pending</div>
            </div>

            {/* Total Spent Card - Highlighted */}
            <div className="bg-[#003d3d] p-6 rounded-4xl shadow-lg shadow-teal-900/20">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/10 rounded-2xl text-teal-400">
                  <CreditCard size={20} />
                </div>
                <span className="text-[10px] font-black text-teal-400/50 uppercase tracking-widest">
                  Payments
                </span>
              </div>
              <div className="text-2xl font-black text-white flex items-baseline gap-1 leading-none">
                <span className="text-xs font-bold text-teal-400">KSh</span>
                {appointmentsData.data
                  .reduce(
                    (total: number, apt: TDetailedAppointment) =>
                      total + parseFloat(apt?.totalAmount || '0'),
                    0
                  )
                  .toLocaleString()}
              </div>
              <div className="text-sm font-bold text-teal-100/40 mt-2 tracking-tight">
                Total Investment
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientAppointments;
