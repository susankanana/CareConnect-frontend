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
  ArrowUpRight} from 'lucide-react';
import { useGetAllPaymentsQuery ,type TPayment } from '../../../../reducers/payments/paymentsAPI';

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedPayment, setSelectedPayment] = useState<TPayment | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Fetch payments data
  const { data: paymentsData, isLoading, error } = useGetAllPaymentsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 30000, // Refresh every 30 seconds
  });

  const payments = paymentsData?.data || [];

  // Filter and search payments
  const filteredPayments = useMemo(() => {
    return payments.filter(payment => {
      const matchesSearch = 
        payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.paymentId.toString().includes(searchTerm) ||
        payment.appointmentId.toString().includes(searchTerm);
      
      const matchesStatus = statusFilter === 'All' || payment.paymentStatus === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [payments, searchTerm, statusFilter]);

  // Calculate payment statistics
  const paymentStats = useMemo(() => {
    const totalAmount = payments.reduce((sum, payment) => sum + parseFloat(payment.amount || '0'), 0);
    const successfulPayments = payments.filter(p => p.paymentStatus === 'Paid').length;
    const pendingPayments = payments.filter(p => p.paymentStatus === 'Pending').length;
    const failedPayments = payments.filter(p => p.paymentStatus === 'Failed').length;

    return {
      totalAmount,
      totalPayments: payments.length,
      successfulPayments,
      pendingPayments,
      failedPayments,
      successRate: payments.length > 0 ? ((successfulPayments / payments.length) * 100).toFixed(1) : '0'
    };
  }, [payments]);

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'Paid':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'Failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount?: string) => {
    if (!amount) return 'KSh 0';
    return `KSh ${parseFloat(amount).toLocaleString()}`;
  };

  const handleViewDetails = (payment: TPayment) => {
    setSelectedPayment(payment);
    setShowDetails(true);
  };

  const handleDownloadReceipt = (payment: TPayment) => {
    // Implementation for downloading receipt
    console.log('Downloading receipt for payment:', payment.paymentId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your payment history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg">Error loading payment data</p>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
              <p className="text-gray-600 mt-1">Track and manage your medical payment transactions</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="bg-gradient-to-r from-teal-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:from-teal-600 hover:to-pink-600 transition-all font-semibold flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export History
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatAmount(paymentStats.totalAmount.toString())}
                </p>
              </div>
              <div className="bg-gradient-to-r from-teal-100 to-pink-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-teal-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">+12% from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{paymentStats.totalPayments}</p>
              </div>
              <div className="bg-gradient-to-r from-teal-100 to-pink-100 p-3 rounded-full">
                <CreditCard className="h-6 w-6 text-teal-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-gray-500">
                {paymentStats.successfulPayments} successful
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">{paymentStats.successRate}%</p>
              </div>
              <div className="bg-gradient-to-r from-teal-100 to-pink-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-teal-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-green-500">Excellent rating</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{paymentStats.pendingPayments}</p>
              </div>
              <div className="bg-gradient-to-r from-teal-100 to-pink-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-teal-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-yellow-500">Awaiting processing</span>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by transaction ID, payment ID, or appointment ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="md:w-48">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="All">All Status</option>
                  <option value="Paid">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          </div>

          {filteredPayments.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No payments found</p>
              <p className="text-gray-400">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 hidden md:table-header-group">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 md:table-row-group block">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.paymentId} className="hover:bg-gray-50 transition-colors text-sm md:table-row block w-full border-b border-gray-100 md:border-0">
                      <td className="px-6 py-4 whitespace-nowrap block md:table-cell">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            #{payment.transactionId || `PAY-${payment.paymentId}`}
                          </div>
                          <div className="text-sm text-gray-500">
                            Appointment #{payment.appointmentId}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap block md:table-cell">
                        <div className="text-sm font-medium text-gray-900">
                          {formatAmount(payment.amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap block md:table-cell">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(payment.paymentStatus)}
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.paymentStatus)}`}>
                            {payment.paymentStatus || 'Unknown'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap block md:table-cell text-sm text-gray-500">
                        {formatDate(payment.paymentDate || payment.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium block md:table-cell">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewDetails(payment)}
                            className="text-teal-600 hover:text-teal-900 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {payment.paymentStatus === 'Paid' && (
                            <button
                              onClick={() => handleDownloadReceipt(payment)}
                              className="text-pink-600 hover:text-pink-900 transition-colors"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Payment Details Modal */}
      {showDetails && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Payment Details</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment ID:</span>
                <span className="font-medium">#{selectedPayment.paymentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-medium">{selectedPayment.transactionId || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Appointment ID:</span>
                <span className="font-medium">#{selectedPayment.appointmentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium text-lg">{formatAmount(selectedPayment.amount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status:</span>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(selectedPayment.paymentStatus)}
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedPayment.paymentStatus)}`}>
                    {selectedPayment.paymentStatus || 'Unknown'}
                  </span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Date:</span>
                <span className="font-medium">{formatDate(selectedPayment.paymentDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span className="font-medium">{formatDate(selectedPayment.createdAt)}</span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowDetails(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Close
              </button>
              {selectedPayment.paymentStatus === 'Paid' && (
                <button
                  onClick={() => handleDownloadReceipt(selectedPayment)}
                  className="flex-1 bg-gradient-to-r from-teal-500 to-pink-500 text-white py-2 px-4 rounded-lg hover:from-teal-600 hover:to-pink-600 transition-all font-medium flex items-center justify-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Receipt
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;