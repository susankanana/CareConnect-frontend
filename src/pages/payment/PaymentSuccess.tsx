import { CheckCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router';
import { useEffect } from 'react';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    console.log('Payment success for session:', sessionId);
  }, [sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-teal-50 to-pink-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-lg w-full text-center">
        
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
        <p className="text-gray-600 mb-4">
          Thank you for your payment. Your appointment has been confirmed, and all associated fees, including any prescriptions, have been settled.
        </p>

        <div className="bg-gray-100 text-gray-700 text-sm font-mono px-4 py-2 rounded-lg break-all mb-6">
          <span className="font-semibold">Session ID:</span><br />
          {sessionId}
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-teal-400 to-pink-500 hover:from-teal-500 hover:to-pink-600 text-white font-semibold py-2 px-6 rounded-full shadow-md transition-all"
          >
            Go to Homepage →
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default PaymentSuccess;
