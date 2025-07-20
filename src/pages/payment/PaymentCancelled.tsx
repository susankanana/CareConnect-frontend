import { XCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

const PaymentCancelled = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-pink-50 flex items-center justify-center px-4">
      <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-lg w-full">
        <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Cancelled</h1>
        <p className="text-gray-600 mb-6">
          Your payment was cancelled. If this was a mistake, please try again or contact support.
        </p>

        <div className="flex justify-center">
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-teal-500 to-pink-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-teal-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2"
          >
            Go to Homepage <ArrowLeft className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelled;
