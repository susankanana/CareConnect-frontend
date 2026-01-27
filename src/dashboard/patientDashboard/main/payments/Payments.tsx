import { useState, useMemo } from 'react';
import {
  CreditCard,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Eye,
  Download,
  DollarSign,
  TrendingUp,
  FileText,
  ArrowUpRight,
  ChevronDown,
} from 'lucide-react';
import { useGetAllPaymentsQuery, type TPayment } from '../../../../reducers/payments/paymentsAPI';

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedPayment, setSelectedPayment] = useState<TPayment | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const {
    data: paymentsData,
    isLoading,
    error,
  } = useGetAllPaymentsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 30000,
  });

  const payments = paymentsData?.data || [];

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const matchesSearch =
        payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.paymentId.toString().includes(searchTerm) ||
        payment.appointmentId.toString().includes(searchTerm);
      const matchesStatus = statusFilter === 'All' || payment.paymentStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [payments, searchTerm, statusFilter]);

  const paymentStats = useMemo(() => {
    const totalAmount = payments.reduce((sum, p) => sum + parseFloat(p.amount || '0'), 0);
    const successful = payments.filter((p) => p.paymentStatus === 'Paid').length;
    return {
      totalAmount,
      totalPayments: payments.length,
      successfulPayments: successful,
      pendingPayments: payments.filter((p) => p.paymentStatus === 'Pending').length,
      successRate: payments.length > 0 ? ((successful / payments.length) * 100).toFixed(1) : '0',
    };
  }, [payments]);

  const getStatusConfig = (status?: string) => {
    switch (status) {
      case 'Paid':
        return {
          icon: <CheckCircle size={14} />,
          color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        };
      case 'Pending':
        return { icon: <Clock size={14} />, color: 'bg-amber-50 text-amber-600 border-amber-100' };
      case 'Failed':
        return { icon: <XCircle size={14} />, color: 'bg-red-50 text-red-600 border-red-100' };
      default:
        return {
          icon: <AlertCircle size={14} />,
          color: 'bg-gray-50 text-gray-500 border-gray-100',
        };
    }
  };

  const formatAmount = (amount?: string) => `KSh ${parseFloat(amount || '0').toLocaleString()}`;

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner text-teal-600 w-12"></span>
          <p className="font-black text-gray-400 uppercase tracking-widest text-xs">
            Securing Connection...
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-20">
      {/* Premium Sticky Header */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Financial Records</h1>
            <p className="text-gray-500 text-sm font-medium">
              Manage your healthcare transactions and invoices
            </p>
          </div>
          <button className="bg-gray-900 text-white px-8 py-3.5 rounded-2xl font-black text-sm flex items-center gap-2 shadow-xl shadow-gray-200 hover:scale-105 transition-transform active:scale-95">
            <Download size={18} /> Export CSV
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-10 space-y-10">
        {/* Modern Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              label: 'Total Volume',
              value: formatAmount(paymentStats.totalAmount.toString()),
              icon: <DollarSign />,
              trend: '+12.5%',
              color: 'teal',
            },
            {
              label: 'Transactions',
              value: paymentStats.totalPayments,
              icon: <CreditCard />,
              trend: 'Lifetime',
              color: 'pink',
            },
            {
              label: 'Success Rate',
              value: `${paymentStats.successRate}%`,
              icon: <TrendingUp />,
              trend: 'Stable',
              color: 'emerald',
            },
            {
              label: 'Awaiting',
              value: paymentStats.pendingPayments,
              icon: <Clock />,
              trend: 'In Review',
              color: 'amber',
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600`}>
                  {stat.icon}
                </div>
                <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
                  {stat.trend}
                </span>
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {stat.label}
              </p>
              <p className="text-2xl font-black text-gray-900 mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm">
          <div className="relative flex-1 group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-500 transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder="Search transaction ID or appointment..."
              className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-teal-500/20 font-medium text-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative md:w-64 group">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select
              className="w-full pl-12 pr-10 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-teal-500/20 font-black text-xs uppercase tracking-wider appearance-none cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Transactions</option>
              <option value="Paid">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
            <ChevronDown
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={16}
            />
          </div>
        </div>

        {/* Premium Table Area */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                {['Transaction', 'Method', 'Amount', 'Status', 'Actions'].map((h) => (
                  <th
                    key={h}
                    className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredPayments.map((payment) => {
                const status = getStatusConfig(payment.paymentStatus);
                return (
                  <tr
                    key={payment.paymentId}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <p className="font-black text-gray-900 text-sm">
                        #{payment.transactionId || `PAY-${payment.paymentId}`}
                      </p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">
                        Appt #{payment.appointmentId}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-xs font-bold text-gray-600 bg-white border border-gray-100 px-3 py-1 rounded-lg shadow-sm">
                        {payment.paymentMethod || 'M-Pesa'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="font-black text-gray-900">
                        {formatAmount(payment.amount)}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${status.color}`}
                      >
                        {status.icon} {payment.paymentStatus}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedPayment(payment);
                            setShowDetails(true);
                          }}
                          className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-teal-600 hover:border-teal-100 transition-all shadow-sm"
                        >
                          <Eye size={18} />
                        </button>
                        {payment.paymentStatus === 'Paid' && (
                          <button className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-pink-600 hover:border-pink-100 transition-all shadow-sm">
                            <Download size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredPayments.length === 0 && (
            <div className="p-20 text-center">
              <FileText className="mx-auto text-gray-200 mb-4" size={64} />
              <p className="text-xl font-black text-gray-900">No Records Found</p>
              <p className="text-gray-400 font-medium">Try refining your search parameters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modern Slide-up/Fade-in Modal */}
      {showDetails && selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-sm bg-gray-900/20">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="bg-gray-900 p-8 text-white relative">
              <button
                onClick={() => setShowDetails(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
              >
                <XCircle size={24} />
              </button>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-400 mb-2">
                Transaction Receipt
              </p>
              <h2 className="text-3xl font-black">{formatAmount(selectedPayment.amount)}</h2>
            </div>

            <div className="p-10 space-y-6">
              {[
                { label: 'Reference ID', value: selectedPayment.transactionId || 'Pending' },
                { label: 'Appointment', value: `#${selectedPayment.appointmentId}` },
                {
                  label: 'Payment Gateway',
                  value: selectedPayment.paymentMethod || 'Mobile Money',
                },
                { label: 'Status', value: selectedPayment.paymentStatus, isStatus: true },
                {
                  label: 'Timestamp',
                  value: new Date(selectedPayment.createdAt || '').toLocaleString(),
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center border-b border-gray-50 pb-4"
                >
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    {item.label}
                  </span>
                  {item.isStatus ? (
                    <span
                      className={`px-4 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusConfig(selectedPayment.paymentStatus).color}`}
                    >
                      {item.value}
                    </span>
                  ) : (
                    <span className="font-black text-gray-900 text-sm">{item.value}</span>
                  )}
                </div>
              ))}

              <div className="flex gap-4 mt-10">
                <button
                  onClick={() => setShowDetails(false)}
                  className="flex-1 py-4 rounded-2xl font-black text-gray-400 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                {selectedPayment.paymentStatus === 'Paid' && (
                  <button className="flex-1 bg-teal-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-teal-100 flex items-center justify-center gap-2 active:scale-95 transition-transform">
                    <Download size={18} /> Get PDF
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
