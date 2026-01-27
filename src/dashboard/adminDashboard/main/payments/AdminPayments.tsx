import { useState, useMemo } from 'react';
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Eye,
  Download,
  FileText,
  Filter,
  FileDown,
  CreditCard,
  Search,
  ArrowUpRight,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { FaDollarSign } from 'react-icons/fa';
import { useGetAllPaymentsQuery, type TPayment } from '../../../../reducers/payments/paymentsAPI';

const AdminPayments = () => {
  const {
    data: paymentsData,
    isLoading,
    error,
  } = useGetAllPaymentsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 30000,
  });

  const payments: TPayment[] = paymentsData?.data || [];
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: 'paymentDate',
    direction: 'desc',
  });

  const [filters, setFilters] = useState({
    method: 'All',
    status: 'All',
  });

  const [selectedPayment, setSelectedPayment] = useState<TPayment | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const revenueSummary = useMemo(() => {
    if (!paymentsData?.data) return { today: 0, week: 0, month: 0 };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    return paymentsData.data.reduce(
      (acc, payment) => {
        const paymentDate = payment.paymentDate ? new Date(payment.paymentDate) : new Date(payment.createdAt || '');
        if (isNaN(paymentDate.getTime())) return acc;
        const normalizedDate = new Date(paymentDate);
        normalizedDate.setHours(0, 0, 0, 0);
        const amount = parseFloat(payment.amount || '0');
        if (isNaN(amount)) return acc;

        if (normalizedDate.getTime() === today.getTime()) acc.today += amount;
        if (normalizedDate >= startOfWeek) acc.week += amount;
        if (normalizedDate >= startOfMonth) acc.month += amount;
        return acc;
      },
      { today: 0, week: 0, month: 0 }
    );
  }, [paymentsData]);

  const filteredAndSortedPayments = useMemo(() => {
    let filtered = payments;
    if (filters.method !== 'All') filtered = filtered.filter((p) => p.paymentMethod === filters.method);
    if (filters.status !== 'All') filtered = filtered.filter((p) => p.paymentStatus === filters.status);
    if (search.trim() !== '') {
      const lower = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.paymentId?.toString().toLowerCase().includes(lower) ||
          p.appointmentId?.toString().toLowerCase().includes(lower) ||
          p.paymentMethod?.toLowerCase().includes(lower) ||
          p.paymentStatus?.toLowerCase().includes(lower)
      );
    }

    return [...filtered].sort((a, b) => {
      let aVal: any = a[sortConfig.key as keyof TPayment];
      let bVal: any = b[sortConfig.key as keyof TPayment];
      if (sortConfig.key.includes('Date')) {
        aVal = new Date(aVal || a.createdAt || '').getTime();
        bVal = new Date(bVal || b.createdAt || '').getTime();
      }
      if (sortConfig.key === 'amount') {
        aVal = parseFloat(aVal || '0');
        bVal = parseFloat(bVal || '0');
      }
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [payments, filters, sortConfig, search]);

  const formatAmount = (amount?: string | number) => {
    const value = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `kes ${value?.toLocaleString() || 0}`;
  };

  if (isLoading) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <Loader2 className="h-12 w-12 text-teal-600 animate-spin mb-4" />
      <p className="text-gray-400 font-medium italic">Synchronizing financial records...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafbfc] pb-20">
      {/* Sophisticated Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-teal-50 p-2 rounded-xl">
                <TrendingUp className="h-6 w-6 text-teal-600" />
              </div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Financial Oversight</h1>
            </div>
            <p className="text-gray-400 font-medium">Tracking {payments.length} transactions across the network</p>
          </div>
          <button
            onClick={() => {}} // Export function
            className="flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-3.5 rounded-2xl font-bold text-sm hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
          >
            <FileDown size={18} /> export report
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8">
        {/* Revenue Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: "Today's take", val: revenueSummary.today, icon: <ArrowUpRight />, color: "bg-teal-600", light: "bg-teal-50" },
            { label: "Weekly cycle", val: revenueSummary.week, icon: <CreditCard />, color: "bg-pink-500", light: "bg-pink-50" },
            { label: "Monthly projection", val: revenueSummary.month, icon: <FaDollarSign />, color: "bg-indigo-600", light: "bg-indigo-50" },
          ].map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:border-teal-200 transition-all">
              <div>
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                <h2 className="text-2xl font-black text-gray-900 italic lowercase">{formatAmount(item.val)}</h2>
              </div>
              <div className={`${item.light} p-4 rounded-2xl text-gray-900 group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-[2rem] p-4 border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
            <input
              type="text"
              placeholder="Search by ID or method..."
              className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-teal-500/20 text-gray-600 font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <select 
              className="bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-gray-500 focus:ring-2 focus:ring-teal-500/20"
              value={filters.method}
              onChange={(e) => setFilters(prev => ({ ...prev, method: e.target.value }))}
            >
              <option value="All">all methods</option>
              <option value="Stripe">stripe</option>
              <option value="M-Pesa">m-pesa</option>
            </select>
            <select 
              className="bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-gray-500 focus:ring-2 focus:ring-teal-500/20"
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="All">all status</option>
              <option value="Paid">paid</option>
              <option value="Pending">pending</option>
            </select>
          </div>
        </div>

        {/* Data List */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">Transaction</th>
                  <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                  <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">Method</th>
                  <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                  <th className="px-8 py-6 text-right text-[11px] font-black text-gray-400 uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredAndSortedPayments.map((p) => (
                  <tr key={p.paymentId} className="hover:bg-teal-50/30 transition-colors group">
                    <td className="px-8 py-5">
                      <span className="text-sm font-black text-gray-900 italic lowercase">#tr-{p.paymentId}</span>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Appt #{p.appointmentId}</p>
                    </td>
                    <td className="px-8 py-5 text-sm font-black text-gray-900 italic">{formatAmount(p.amount)}</td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-gray-100 rounded-lg text-[10px] font-black text-gray-500 uppercase">{p.paymentMethod}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        p.paymentStatus === 'Paid' ? 'text-teal-600 bg-teal-50' : 'text-amber-600 bg-amber-50'
                      }`}>
                        <div className={`h-1.5 w-1.5 rounded-full ${p.paymentStatus === 'Paid' ? 'bg-teal-500' : 'bg-amber-500'}`} />
                        {p.paymentStatus}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-xs text-gray-400 font-medium">
                      {p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : 'n/a'}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => {setSelectedPayment(p); setShowDetails(true)}}
                        className="p-2 hover:bg-white rounded-xl transition-all text-gray-400 hover:text-teal-600"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Final Chique Footer Summary */}
        <div className="mt-12 bg-gradient-to-br from-[#004d4d] to-[#006666] rounded-[3.5rem] p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-black italic mb-2 tracking-tight">System Liquidity Summary</h2>
              <p className="text-teal-100/60 text-sm font-medium">real-time reconciliation of all digital and physical assets</p>
            </div>
            <div className="h-12 w-px bg-white/10 hidden md:block" />
            <div className="flex gap-12">
              <div className="text-center">
                <p className="text-[10px] font-black text-teal-200/50 uppercase tracking-[0.2em] mb-2">Net Volume</p>
                <p className="text-3xl font-black italic">{formatAmount(revenueSummary.month)}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-black text-teal-200/50 uppercase tracking-[0.2em] mb-2">Success Rate</p>
                <p className="text-3xl font-black italic">98.4%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPayments;