import { useState, useEffect } from "react";
import { Link } from "react-router";
import { FaCalendarDay, FaCalendarWeek, FaCalendarAlt } from "react-icons/fa";
import { useGetAllPaymentsQuery, type TPayment } from '../../../../reducers/payments/paymentsAPI';

interface RevenueSummary {
  today: number;
  week: number;
  month: number;
}

const AdminPayments = () => {
  const { data, isLoading, isError} = useGetAllPaymentsQuery();

  const [revenueSummary, setRevenueSummary] = useState<RevenueSummary>({
    today: 0,
    week: 0,
    month: 0,
  });

  // Calculate revenue summary whenever the data changes
  useEffect(() => {
    if (data?.data) {
      calculateRevenueSummary(data.data);
    }
  }, [data]);

  const calculateRevenueSummary = (allPayments: TPayment[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to the start of the day
    
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    let dailyRevenue = 0;
    let weeklyRevenue = 0;
    let monthlyRevenue = 0;

    allPayments.forEach((payment) => {
      // Use a fallback for payment.paymentDate, and ensure the date is valid
      const paymentDate = payment.paymentDate
        ? new Date(payment.paymentDate)
        : new Date(payment.createdAt || '2025-01-01'); // Fallback to createdAt or a default date
      
      // Check if the date is valid before proceeding
      if (isNaN(paymentDate.getTime())) {
          console.error('Invalid date found for payment:', payment);
          return;
      }

      // Convert the amount string to a number, handling potential parsing errors
      const amount = parseFloat(payment.amount || '0');
      if (isNaN(amount)) {
          console.error('Invalid amount found for payment:', payment);
          return;
      }

      // Normalize the payment date for accurate comparison
      const normalizedPaymentDate = new Date(paymentDate);
      normalizedPaymentDate.setHours(0, 0, 0, 0);

      if (normalizedPaymentDate.getTime() === today.getTime()) {
        dailyRevenue += amount;
      }

      if (normalizedPaymentDate >= startOfWeek) {
        weeklyRevenue += amount;
      }

      if (normalizedPaymentDate >= startOfMonth) {
        monthlyRevenue += amount;
      }
    });

    setRevenueSummary({
      today: dailyRevenue,
      week: weeklyRevenue,
      month: monthlyRevenue,
    });
  };

  // Conditional rendering based on RTK Query states
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full text-lg text-gray-600">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <span className="ml-4">Loading payments data...</span>
      </div>
    );
  }

  if (isError) {
    // The error object from RTK Query might have a `message` property
    const errorMessage = 'An unknown error occurred.';
    return (
      <div className="flex justify-center items-center h-full text-red-500 text-lg">
        <p>Error: {errorMessage}</p>
      </div>
    );
  }
  
  // Use the data from the query hook directly
  const payments = data?.data || [];

  // No payments found state
  if (payments.length === 0) {
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Payments Dashboard</h1>
            <Link to="/admin/dashboard" className="text-blue-600 hover:text-blue-800 transition-colors">
              &larr; Back to Dashboard
            </Link>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center text-gray-500 text-lg">
              No payments found.
          </div>
        </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Payments Dashboard</h1>
        <Link to="/admin/dashboard" className="text-blue-600 hover:text-blue-800 transition-colors">
          &larr; Back to Dashboard
        </Link>
      </div>

      {/* Revenue Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center">
          <div className="bg-green-100 text-green-600 p-3 rounded-full mr-4">
            <FaCalendarDay size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Daily Revenue</p>
            <p className="text-2xl font-semibold text-gray-900">
              Ksh {revenueSummary.today.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center">
          <div className="bg-blue-100 text-blue-600 p-3 rounded-full mr-4">
            <FaCalendarWeek size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Weekly Revenue</p>
            <p className="text-2xl font-semibold text-gray-900">
              Ksh {revenueSummary.week.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center">
          <div className="bg-purple-100 text-purple-600 p-3 rounded-full mr-4">
            <FaCalendarAlt size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Monthly Revenue</p>
            <p className="text-2xl font-semibold text-gray-900">
              Ksh {revenueSummary.month.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">All Payments</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Appointment ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Method
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment.paymentId}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.paymentId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <Link to={`/admin/appointments/${payment.appointmentId}`} className="text-blue-600 hover:underline">
                    {payment.appointmentId}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Ksh {payment.amount ? parseFloat(payment.amount).toFixed(2) : '0.00'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payment.paymentMethod || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      payment.paymentStatus === "Paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {payment.paymentStatus || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payment.transactionId || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPayments;
