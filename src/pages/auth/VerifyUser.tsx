import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { usersAPI } from '../../../src/reducers/users/usersAPI';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Heart, ArrowRight, ShieldCheck } from 'lucide-react';

type VerifyInputs = {
  email: string;
  code: string;
};

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  code: yup
    .string()
    .matches(/^\d{6}$/, 'Code must be a 6 digit number')
    .required('Verification code is required'),
});

const VerifyUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email || '';

  const [verifyUser, { isLoading }] = usersAPI.useVerifyUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: emailFromState,
    },
  });

  const onSubmit: SubmitHandler<VerifyInputs> = async (data) => {
    try {
      await verifyUser(data).unwrap();
      toast.success('Account verified successfully!');
      setTimeout(() => {
        navigate('/login', {
          state: { email: data.email },
        });
      }, 2000);
    } catch (error) {
      toast.error('Verification failed. Please check your code.');
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      {/* Brand Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4 cursor-pointer" onClick={() => navigate('/')}>
              <div className="bg-linear-to-br from-[#00a18e] to-[#f43f8e] p-2.5 rounded-2xl shadow-lg shadow-pink-100">
                <Heart className="h-7 w-7 text-white" />
              </div>
              <div>
                <div className="text-2xl font-black tracking-tight leading-none">
                  <span className="text-[#00a18e]">Care</span>
                  <span className="text-[#f43f8e]">Connect</span>
                </div>
                <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">
                  Healthcare with passion
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] opacity-30 -z-10"></div>
        
        <div className="w-full max-w-120">
          <div className="bg-white rounded-[40px] shadow-2xl shadow-gray-200/50 p-10 border border-gray-50 text-center">
            <div className="mb-8 flex flex-col items-center">
                <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-6 border border-teal-100">
                    <ShieldCheck className="h-8 w-8 text-[#00a18e]" />
                </div>
                <h1 className="text-4xl font-black text-[#003d3d] tracking-tight mb-3">Verify Identity</h1>
                <p className="text-gray-500 font-medium text-sm leading-relaxed max-w-75">
                  We've sent a 6-digit security code to your email address.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-[#003d3d] mb-2 ml-1">Confirm Email</label>
                <input
                  type="email"
                  {...register('email')}
                  readOnly={!!emailFromState}
                  className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#00a18e] transition-all font-bold text-gray-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-[#003d3d] mb-2 ml-1">Verification Code</label>
                <input
                  type="text"
                  {...register('code')}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-5 py-5 border-2 border-gray-100 rounded-2xl focus:ring-0 focus:border-[#00a18e] transition-all font-black text-3xl text-center tracking-[0.5em] text-[#003d3d] placeholder:text-gray-100"
                />
                {errors.code && (
                  <span className="text-[#f43f8e] text-[11px] font-black uppercase mt-3 block text-center">{errors.code.message}</span>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-linear-to-r from-[#00a18e] to-[#008d7c] text-white py-5 px-6 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-teal-100 disabled:opacity-50 mt-4"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Verifying...
                  </span>
                ) : (
                  <>
                    <span>Verify Account</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-gray-50">
              <p className="text-gray-400 font-bold text-sm">
                Didn't receive a code?{' '}
                <button className="text-[#f43f8e] hover:underline font-black ml-1">
                  Resend Code
                </button>
              </p>
              <div className="mt-6">
                <a href="/" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 hover:text-[#003d3d] transition-colors">
                  ← Back to Home
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyUser;