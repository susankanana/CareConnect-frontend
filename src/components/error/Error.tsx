import { Link, useRouteError, isRouteErrorResponse } from 'react-router';
import { ArrowLeft, AlertCircle, Home } from 'lucide-react';

const Error = () => {
  const error = useRouteError();
  
  // Logic to safely extract error details without TS errors
  let errorMessage = "An unexpected error occurred.";
  let errorStatus = "Error";

  if (isRouteErrorResponse(error)) {
    // Standard router errors (404, 500, etc)
    errorStatus = error.status.toString();
    errorMessage = error.statusText || error.data?.message || errorMessage;
  } else if (error !== null && typeof error === 'object' && 'message' in error) {
    // Narrowing 'unknown' to an object containing a message property
    errorMessage = (error as { message: string }).message;
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center px-4 pt-4 pb-4 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-[-10%] right-[-10%] w-125 h-125 bg-[#00a18e] rounded-full blur-[150px] opacity-[0.03] pointer-events-none"></div>

      <div className="max-w-2xl w-full text-center relative z-10">
        {/* Status Code Backdrop */}
        <div className="absolute inset-0 -top-20 flex justify-center items-center pointer-events-none opacity-[0.04] select-none">
          <span className="text-[250px] font-black text-[#003d3d] leading-none">
            {errorStatus}
          </span>
        </div>

        <div className="inline-flex p-4 rounded-3xl bg-teal-50 text-[#00a18e] mb-8 shadow-inner border border-teal-100/50">
          <AlertCircle size={48} strokeWidth={1.5} />
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-[#003d3d] tracking-tighter uppercase mb-6 italic">
          Lost in transit<span className="text-[#00a18e]">.</span>
        </h1>
        
        <p className="text-xl text-gray-600 font-medium max-w-lg mx-auto leading-relaxed mb-10">
          The page you are looking for has been moved, removed, or simply doesn't exist. Let's get your health journey back on track.
        </p>

        {/* Technical details (subtle) */}
        <div className="mb-12 inline-block px-4 py-2 bg-gray-100 rounded-full border border-gray-200">
          <code className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            System Log: {errorMessage}
          </code>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="group flex items-center gap-3 px-10 py-5 bg-[#003d3d] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-[#00a18e] transition-all shadow-xl shadow-teal-900/20 active:scale-95"
          >
            <Home size={18} />
            Back to home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="group flex items-center gap-3 px-10 py-5 bg-white text-[#003d3d] border-2 border-gray-100 rounded-2xl font-black uppercase tracking-widest hover:border-[#00a18e] transition-all active:scale-95"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Previous Page
          </button>
        </div>

        <div className="mt-16 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
          Need assistance? <Link to="/contact" className="text-[#f43f8e] hover:underline">Contact Support</Link>
        </div>
      </div>
    </div>
  );
};

export default Error;