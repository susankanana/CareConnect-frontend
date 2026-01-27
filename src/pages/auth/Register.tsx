import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { usersAPI } from '../../../src/reducers/users/usersAPI';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { Heart, ArrowRight } from 'lucide-react';

type RegisterInputs = {
  firstName: string;
  lastName: string;
  email: string;
  contactPhone: string;
  address: string;
  password: string;
  confirmPassword: string;
};

const schema = yup.object({
  firstName: yup.string().max(50, 'Max 50 characters').required('First name is required'),
  lastName: yup.string().max(50, 'Max 50 characters').required('Last name is required'),
  email: yup
    .string()
    .email('Invalid email')
    .max(100, 'Max 100 characters')
    .required('Email is required'),
  contactPhone: yup.string().max(20, 'Max 20 characters').required('Phone number is required'),
  address: yup.string().max(255, 'Max 255 characters').required('Address is required'),
  password: yup
    .string()
    .min(6, 'Min 6 characters')
    .max(255, 'Max 255 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

function Register() {
  const navigate = useNavigate();

  const [createUser, { isLoading }] = usersAPI.useCreateUsersMutation({
    fixedCacheKey: 'createUser',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<RegisterInputs> = async (data) => {
    try {
      await createUser(data).unwrap();
      toast.success('Registration successful! Please verify your email.');

      setTimeout(() => {
        navigate('/register/verify', {
          state: { email: data.email },
        });
      }, 2000);
    } catch (error) {
      toast.error('Registration failed. Please try again.');
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
            <div className="text-[#00a18e] text-xs font-black uppercase tracking-widest bg-teal-50 px-4 py-2 rounded-full border border-teal-100">
              Registration
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] opacity-30 -z-10"></div>
        
        <div className="w-full max-w-137.5">
          <div className="bg-white rounded-[40px] shadow-2xl shadow-gray-200/50 p-10 border border-gray-50">
            <div className="mb-10 text-center lg:text-left">
                <h1 className="text-4xl font-black text-[#003d3d] tracking-tight mb-2">Create Account</h1>
                <p className="text-gray-400 font-bold text-sm uppercase tracking-tight">Join the CareConnect community today</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-[#003d3d] mb-2 ml-1">First Name</label>
                  <input
                    data-test="signup-firstname"
                    type="text"
                    {...register('firstName')}
                    placeholder="John"
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#00a18e] transition-all font-bold text-gray-700"
                  />
                  {errors.firstName && (
                    <span className="text-[#f43f8e] text-[10px] font-black uppercase mt-2 block ml-1">{errors.firstName.message}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-[#003d3d] mb-2 ml-1">Last Name</label>
                  <input
                    data-test="signup-lastname"
                    type="text"
                    {...register('lastName')}
                    placeholder="Doe"
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#00a18e] transition-all font-bold text-gray-700"
                  />
                  {errors.lastName && (
                    <span className="text-[#f43f8e] text-[10px] font-black uppercase mt-2 block ml-1">{errors.lastName.message}</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-[#003d3d] mb-2 ml-1">Email Address</label>
                <input
                  data-test="signup-email"
                  type="email"
                  {...register('email')}
                  placeholder="name@example.com"
                  className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#00a18e] transition-all font-bold text-gray-700"
                />
                {errors.email && (
                  <span className="text-[#f43f8e] text-[10px] font-black uppercase mt-2 block ml-1">{errors.email.message}</span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-[#003d3d] mb-2 ml-1">Phone Number</label>
                  <input
                    data-test="signup-phone"
                    type="tel"
                    {...register('contactPhone')}
                    placeholder="+254..."
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#00a18e] transition-all font-bold text-gray-700"
                  />
                  {errors.contactPhone && (
                    <span className="text-[#f43f8e] text-[10px] font-black uppercase mt-2 block ml-1">{errors.contactPhone.message}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-[#003d3d] mb-2 ml-1">Address</label>
                  <input
                    data-test="signup-address"
                    type="text"
                    {...register('address')}
                    placeholder="Nairobi, Kenya"
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#00a18e] transition-all font-bold text-gray-700"
                  />
                  {errors.address && (
                    <span className="text-[#f43f8e] text-[10px] font-black uppercase mt-2 block ml-1">{errors.address.message}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-[#003d3d] mb-2 ml-1">Password</label>
                  <input
                    data-test="signup-password"
                    type="password"
                    {...register('password')}
                    placeholder="••••••••"
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#00a18e] transition-all font-bold text-gray-700"
                  />
                  {errors.password && (
                    <span className="text-[#f43f8e] text-[10px] font-black uppercase mt-2 block ml-1">{errors.password.message}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-[#003d3d] mb-2 ml-1">Confirm</label>
                  <input
                    data-test="signup-confirmpassword"
                    type="password"
                    {...register('confirmPassword')}
                    placeholder="••••••••"
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#00a18e] transition-all font-bold text-gray-700"
                  />
                  {errors.confirmPassword && (
                    <span className="text-[#f43f8e] text-[10px] font-black uppercase mt-2 block ml-1">{errors.confirmPassword.message}</span>
                  )}
                </div>
              </div>

              <button
                data-test="signup-submitbtn"
                type="submit"
                disabled={isLoading}
                className="w-full bg-linear-to-r from-[#00a18e] to-[#008d7c] text-white py-5 px-6 rounded-2xl hover:scale-[1.01] active:scale-[0.99] transition-all font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-teal-100 disabled:opacity-50 mt-6"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Creating Account...
                  </span>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-gray-50 text-center">
              <p className="text-gray-400 font-bold text-sm">
                Already have an account?{' '}
                <a href="/login" className="text-[#f43f8e] hover:underline font-black ml-1">
                  Login Here
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

export default Register;