import { useState, useMemo } from "react";
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
  Search
} from "lucide-react";
import { FaDollarSign } from "react-icons/fa";
import { useGetAllPaymentsQuery, type TPayment } from "../../../../reducers/payments/paymentsAPI";

const AdminPayments = () => {
  const { data: paymentsData, isLoading, error } = useGetAllPaymentsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 30000,
  });

  const payments: TPayment[] = paymentsData?.data || [];
  const [search, setSearch] = useState("");

  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" }>({
    key: "paymentDate",
    direction: "desc",
  });

  const [filters, setFilters] = useState({
    method: "All",
    status: "All",
  });

  const [selectedPayment, setSelectedPayment] = useState<TPayment | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Sorting handler
  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
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
        const paymentDate = payment.paymentDate
           ? new Date(payment.paymentDate)
           : new Date(payment.createdAt || "");

        if (isNaN(paymentDate.getTime())) return acc;

        const normalizedPaymentDate = new Date(paymentDate);
        normalizedPaymentDate.setHours(0, 0, 0, 0);

        const amount = parseFloat(payment.amount || "0");
        if (isNaN(amount)) return acc;

        if (normalizedPaymentDate.getTime() === today.getTime()) acc.today += amount;
        if (normalizedPaymentDate >= startOfWeek) acc.week += amount;
        if (normalizedPaymentDate >= startOfMonth) acc.month += amount;

        return acc;
      },
      { today: 0, week: 0, month: 0 }
    );
  }, [paymentsData]);


  // Filtering + Sorting
  const filteredAndSortedPayments = useMemo(() => {
    let filtered = payments;

    if (filters.method !== "All") {
      filtered = filtered.filter((p) => p.paymentMethod === filters.method);
    }
    if (filters.status !== "All") {
      filtered = filtered.filter((p) => p.paymentStatus === filters.status);
    }

    // Apply search filter
    if (search.trim() !== "") {
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

      // Special case for dates
      if (sortConfig.key.includes("Date")) {
        aVal = new Date(aVal || a.createdAt || "").getTime();
        bVal = new Date(bVal || b.createdAt || "").getTime();
      }

      // Numeric sort
      if (sortConfig.key === "amount") {
        aVal = parseFloat(aVal || "0");
        bVal = parseFloat(bVal || "0");
      }

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [payments, filters, sortConfig, search]);

  // Helpers
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount?: string) => {
    if (!amount) return "KES 0";
    return `KES ${parseFloat(amount).toLocaleString()}`;
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "Paid":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "Pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "Failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewDetails = (payment: TPayment) => {
    setSelectedPayment(payment);
    setShowDetails(true);
  };

  const handleDownloadReceipt = (payment: TPayment) => {
    console.log("Downloading receipt for payment:", payment.paymentId);
  };

  const exportToCSV = () => {
    const headers = ["PaymentID", "AppointmentID", "Method", "Amount", "Date"];
    const rows = filteredAndSortedPayments.map(p => [p.paymentId, p.appointmentId, p.paymentMethod, p.amount, formatDate(p.paymentDate || p.createdAt)]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "payments_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Failed to load payments
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FaDollarSign className="h-7 w-7 text-green-600" />
            Payments Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Manage all payments – {payments.length} total payments
          </p>
        </div>
      </div>

     {/* Revenue Summary */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-2xl shadow flex items-center space-x-4">
          <CheckCircle className="text-green-500" size={28} />
          <div>
            <h3 className="text-lg font-semibold">Today's Revenue</h3>
            <p className="text-xl font-bold text-green-600">KES {formatAmount(revenueSummary.today.toString())}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow flex items-center space-x-4">
          <CreditCard className="text-blue-500" size={28} />
          <div>
            <h3 className="text-lg font-semibold">This Week</h3>
            <p className="text-xl font-bold text-blue-600">KES {formatAmount(revenueSummary.week.toString())}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow flex items-center space-x-4">
          <AlertCircle className="text-purple-500" size={28} />
          <div>
            <h3 className="text-lg font-semibold">This Month</h3>
            <p className="text-xl font-bold text-purple-600">KES {formatAmount(revenueSummary.month.toString())}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
      
                    {/* Search Input */}
                    <div className="relative w-full md:flex-1">
                        <input
                            type="text"
                            placeholder="Search payments..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                        <Search
                            className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                    </div>

                    {/* Method Filter */}
                    <div className="relative w-full md:w-48">
                        <select
                            value={filters.method}
                            onChange={(e) => setFilters((prev) => ({ ...prev, method: e.target.value }))}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none bg-white"
                        >
                            <option value="All">All Methods</option>
                            <option value="Stripe">Stripe</option>
                            <option value="M-Pesa">M-Pesa</option>
                            <option value="Cash">Cash</option>
                        </select>
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    </div>

                    {/* Status Filter */}
                    <div className="relative w-full md:w-48">
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none bg-white"
                        >
                            <option value="All">All Status</option>
                            <option value="Paid">Paid</option>
                            <option value="Pending">Pending</option>
                            <option value="Failed">Failed</option>
                        </select>
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    </div>

                    {/* Export Button */}
                    <button
                        onClick={exportToCSV}
                        className="w-full md:w-auto flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-3 rounded-lg shadow hover:bg-green-700 transition"
                   >
                        <FileDown size={18} /> Export CSV Report
                    </button>
                </div>
            </div>
        </div>


        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            </div>
            {filteredAndSortedPayments.length === 0 ? (
                <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No payments found</p>
                </div>
            ) : (
            <>
            {/* Desktop Table */}
            <div className="overflow-x-auto hidden md:block">
                <table className="min-w-[700px] w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Appointment ID</th>
                            <th
                                onClick={() => handleSort("amount")}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                            >
                                Amount {sortConfig.key === "amount" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th
                                onClick={() => handleSort("paymentDate")}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                            >
                                Date {sortConfig.key === "paymentDate" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredAndSortedPayments.map((payment) => (
                        <tr key={payment.paymentId} className="hover:bg-gray-50 text-sm">
                            <td className="px-6 py-4 font-medium text-gray-900">#{payment.paymentId}</td>
                            <td className="px-6 py-4 text-gray-700">#{payment.appointmentId}</td>
                            <td className="px-6 py-4">{formatAmount(payment.amount)}</td>
                            <td className="px-6 py-4">{payment.paymentMethod || "N/A"}</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center space-x-2">
                                    {getStatusIcon(payment.paymentStatus)}
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.paymentStatus)}`}>
                                        {payment.paymentStatus || "Unknown"}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-gray-500">
                                {formatDate(payment.paymentDate || payment.createdAt)}
                            </td>
                            <td className="px-6 py-4 flex items-center space-x-2">
                                <button
                                    onClick={() => handleViewDetails(payment)}
                                    className="text-teal-600 hover:text-teal-900"
                                >
                                    <Eye className="h-4 w-4" />
                                </button>
                                {payment.paymentStatus === "Paid" && (
                                <button
                                    onClick={() => handleDownloadReceipt(payment)}
                                    className="text-pink-600 hover:text-pink-900"
                                >
                                    <Download className="h-4 w-4" />
                                </button>
                            )}
                           </td>
                        </tr>
                     ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-200">
                {filteredAndSortedPayments.map((payment) => (
                <div key={payment.paymentId} className="p-4 space-y-2">
                    <p className="text-sm font-medium text-gray-900">Payment ID: #{payment.paymentId}</p>
                    <p className="text-sm text-gray-700">Appointment ID: #{payment.appointmentId}</p>
                    <p className="text-sm">Amount: {formatAmount(payment.amount)}</p>
                    <p className="text-sm">Method: {payment.paymentMethod || "N/A"}</p>
                    <div className="flex items-center space-x-2">
                        {getStatusIcon(payment.paymentStatus)}
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.paymentStatus)}`}>
                            {payment.paymentStatus || "Unknown"}
                        </span>
                    </div>
                    <p className="text-xs text-gray-500">
                        {formatDate(payment.paymentDate || payment.createdAt)}
                    </p>
                    <div className="flex items-center space-x-2 pt-2">
                        <button
                            onClick={() => handleViewDetails(payment)}
                            className="text-teal-600 hover:text-teal-900"
                        >
                            <Eye className="h-4 w-4" />
                        </button>
                        {payment.paymentStatus === "Paid" && (
                        <button
                            onClick={() => handleDownloadReceipt(payment)}
                            className="text-pink-600 hover:text-pink-900"
                        >
                            <Download className="h-4 w-4" />
                        </button>
                    )}
                    </div>
                </div>
                ))}
            </div>
            </>
          )}
        </div>

      </div>

      {/* Details Modal */}
      {showDetails && selectedPayment && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Payment Details</h3>
              <button onClick={() => setShowDetails(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between"><span>Payment ID:</span><span>#{selectedPayment.paymentId}</span></div>
              <div className="flex justify-between"><span>Appointment ID:</span><span>#{selectedPayment.appointmentId}</span></div>
              <div className="flex justify-between"><span>Method:</span><span>{selectedPayment.paymentMethod || "N/A"}</span></div>
              <div className="flex justify-between"><span>Amount:</span><span>{formatAmount(selectedPayment.amount)}</span></div>
              <div className="flex justify-between items-center">
                <span>Status:</span>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(selectedPayment.paymentStatus)}
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedPayment.paymentStatus)}`}>
                    {selectedPayment.paymentStatus || "Unknown"}
                  </span>
                </div>
              </div>
              <div className="flex justify-between"><span>Date:</span><span>{formatDate(selectedPayment.paymentDate)}</span></div>
              <div className="flex justify-between"><span>Created:</span><span>{formatDate(selectedPayment.createdAt)}</span></div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowDetails(false)} className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200">
                Close
              </button>
              {selectedPayment.paymentStatus === "Paid" && (
                <button
                  onClick={() => handleDownloadReceipt(selectedPayment)}
                  className="flex-1 bg-gradient-to-r from-teal-500 to-pink-500 text-white py-2 px-4 rounded-lg hover:from-teal-600 hover:to-pink-600 flex items-center justify-center gap-2"
                >
                  <Download className="h-4 w-4" /> Receipt
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;
