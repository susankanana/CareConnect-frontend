import { useState, useMemo } from "react";
import { useGetAllPaymentsQuery } from "../../../../reducers/payments/paymentsAPI";
import { Loader2, CreditCard, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router";

const AdminPayments = () => {
  const { data, isLoading, isError, error } = useGetAllPaymentsQuery();

  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" }>({
    key: "paymentDate",
    direction: "desc",
  });

  const [filters, setFilters] = useState({
    method: "All",
    status: "All",
  });

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const revenueSummary = useMemo(() => {
    if (!data?.data) return { today: 0, week: 0, month: 0 };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    return data.data.reduce(
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
  }, [data]);

  const filteredAndSortedPayments = useMemo(() => {
    if (!data?.data) return [];

    let filtered = data.data;

    if (filters.method !== "All") {
      filtered = filtered.filter((p) => p.paymentMethod === filters.method);
    }
    if (filters.status !== "All") {
      filtered = filtered.filter((p) => p.paymentStatus === filters.status);
    }

    return [...filtered].sort((a, b) => {
      const aVal = a[sortConfig.key as keyof typeof a] ?? "";
      const bVal = b[sortConfig.key as keyof typeof b] ?? "";

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortConfig.direction === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
      }

      const dateA = new Date(aVal as string).getTime();
      const dateB = new Date(bVal as string).getTime();
      return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [data, filters, sortConfig]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  if (isError) {
    const errorMessage =
      (error as any)?.data?.message || (error as any)?.error || "An unknown error occurred.";
    return (
      <div className="flex justify-center items-center h-full text-red-500 text-lg">
        <p>Error: {errorMessage}</p>
      </div>
    );
  }

  if (!filteredAndSortedPayments.length) {
    return (
      <div className="flex justify-center items-center h-full text-gray-500 text-lg">
        <p>No payment records found.</p>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    Paid: "bg-green-100 text-green-800",
    Pending: "bg-yellow-100 text-yellow-800",
    Failed: "bg-red-100 text-red-800",
  };

  return (
    <div className="p-6 space-y-6">
      {/* Revenue Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-2xl shadow flex items-center space-x-4">
          <CheckCircle className="text-green-500" size={28} />
          <div>
            <h3 className="text-lg font-semibold">Today's Revenue</h3>
            <p className="text-xl font-bold text-green-600">KES {revenueSummary.today}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow flex items-center space-x-4">
          <CreditCard className="text-blue-500" size={28} />
          <div>
            <h3 className="text-lg font-semibold">This Week</h3>
            <p className="text-xl font-bold text-blue-600">KES {revenueSummary.week}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow flex items-center space-x-4">
          <AlertCircle className="text-purple-500" size={28} />
          <div>
            <h3 className="text-lg font-semibold">This Month</h3>
            <p className="text-xl font-bold text-purple-600">KES {revenueSummary.month}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <select
          value={filters.method}
          onChange={(e) => setFilters((prev) => ({ ...prev, method: e.target.value }))}
          className="border rounded-lg px-3 py-2"
        >
          <option value="All">All Methods</option>
          <option value="Card">Card</option>
          <option value="M-Pesa">M-Pesa</option>
          <option value="Cash">Cash</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
          className="border rounded-lg px-3 py-2"
        >
          <option value="All">All Status</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Amount", "Method", "Status", "Date"].map((col) => (
                <th
                  key={col}
                  onClick={() => handleSort(col.toLowerCase())}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                >
                  {col} {sortConfig.key === col.toLowerCase() ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAndSortedPayments.map((payment) => (
              <tr key={payment.paymentId} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap font-medium">KES {payment.amount || "0"}</td>
                <td className="px-6 py-4 whitespace-nowrap">{payment.paymentMethod || "N/A"}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      statusColors[payment.paymentStatus] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {payment.paymentStatus || "N/A"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(payment.paymentDate || payment.createdAt || "").toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-blue-600 hover:underline">
                  <Link to={`/admin/payments/${payment.paymentId}`}>View</Link>
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
