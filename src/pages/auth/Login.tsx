import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useLocation, useNavigate } from 'react-router';
import { loginAPI } from '../../../src/reducers/login/loginAPI';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../../src/reducers/login/userSlice';
import { Eye, EyeOff, Heart, ArrowRight } from 'lucide-react';

type LoginInputs = {
  email: string;
  password: string;
};

const schema = yup.object({
  email: yup
    .string()
    .email('Invalid email')
    .max(100, 'Max 100 characters')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Min 6 characters')
    .max(255, 'Max 255 characters')
    .required('Password is required'),
});

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const emailFromState = location.state?.email || '';

  const [loginUser, { isLoading }] = loginAPI.useLoginUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: emailFromState,
    },
  });

  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    try {
      const response = await loginUser(data).unwrap();
      dispatch(loginSuccess(response));
      toast.success('Login successful!');

      if (response.user.role === 'admin') {
        navigate('/admin/dashboard/users');
      } else if (response.user.role === 'doctor') {
        navigate('/doctor/dashboard/appointments');
      } else if (response.user.role === 'user') {
        navigate('/user/dashboard/appointments');
      }
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
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
      {/* Decorative background element */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] opacity-30 -z-10"></div>
        
        <div className="w-full max-w-110">
          <div className="bg-white rounded-[40px] shadow-2xl shadow-gray-200/50 p-10 border border-gray-50">
            <div className="mb-10">
                <h1 className="text-4xl font-black text-[#003d3d] tracking-tight mb-2">Welcome Back</h1>
                <p className="text-gray-400 font-bold text-sm uppercase tracking-tight">Enter your details to continue</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-[#003d3d] mb-2 ml-1">Email Address</label>
                <input
                  data-test="login-email-input"
                  type="email"
                  {...register('email')}
                  placeholder="name@example.com"
                  readOnly={!!emailFromState}
                  className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#00a18e] transition-all font-bold text-gray-700 placeholder:text-gray-300"
                />
                {errors.email && (
                  <span className="text-[#f43f8e] text-[11px] font-black uppercase mt-2 block ml-1">{errors.email.message}</span>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2 ml-1">
                    <label className="block text-xs font-black uppercase tracking-widest text-[#003d3d]">Password</label>
                    <a href="#" className="text-[11px] font-black text-[#f43f8e] uppercase tracking-tighter hover:underline">
                      Forgot?
                    </a>
                </div>
                <div className="relative">
                  <input
                    data-test="login-password-input"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    placeholder="••••••••"
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#00a18e] transition-all font-bold text-gray-700 placeholder:text-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-[#00a18e] transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-[#f43f8e] text-[11px] font-black uppercase mt-2 block ml-1">{errors.password.message}</span>
                )}
              </div>

              <button
                data-test="login-submit-button"
                type="submit"
                disabled={isLoading}
                className="w-full bg-linear-to-r from-[#00a18e] to-[#008d7c] text-white py-5 px-6 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-teal-100 disabled:opacity-50 mt-4"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Authenticating...
                  </span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-gray-50 text-center">
              <p className="text-gray-400 font-bold text-sm">
                New to CareConnect?{' '}
                <a href="/register" className="text-[#f43f8e] hover:underline font-black ml-1">
                  Create Account
                </a>
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
}

export default Login;