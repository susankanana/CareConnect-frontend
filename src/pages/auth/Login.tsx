import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useLocation, useNavigate } from 'react-router';
import { loginAPI } from '../../../src/reducers/login/loginAPI';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../../src/reducers/login/userSlice';
import { Eye, EyeOff, Heart } from 'lucide-react';

type LoginInputs = {
    email: string;
    password: string;
};

const schema = yup.object({
    email: yup.string().email('Invalid email').max(100, 'Max 100 characters').required('Email is required'),
    password: yup.string().min(6, 'Min 6 characters').max(255, 'Max 255 characters').required('Password is required'),
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
        }
    });

    const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
        console.log('Login data:', data);

        try {
            const response = await loginUser(data).unwrap();
            dispatch(loginSuccess(response));

            console.log("Login response:", response);
            toast.success("Login successful!");

            if (response.user.role === 'admin') {
                navigate('/admin/dashboard/users');
            } else if (response.user.role === 'doctor') {
                navigate('/doctor/dashboard/appointments');
            } else if (response.user.role === 'user') {
                navigate('/user/dashboard/appointments');
            }

        } catch (error) {
            console.log("Login error:", error);
            toast.error("Login failed. Please check your credentials and try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="bg-gradient-to-r from-teal-500 to-pink-500 p-2 rounded-full">
                                <Heart className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">
                                    <span className="text-teal-600">Care</span>
                                    <span className="text-pink-500">Connect</span>
                                </div>
                                <div className="text-sm text-gray-600 italic">With passion we deliver healthcare</div>
                            </div>
                        </div>
                        <div className="text-teal-600 text-lg font-semibold">
                            Login
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-8">Login</h1>
                        
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Username
                                </label>
                                <input
                                    data-test="login-email-input"
                                    type="email"
                                    {...register('email')}
                                    placeholder="Enter your email address"
                                    readOnly={!!emailFromState}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-lg"
                                />
                                {errors.email && (
                                    <span className="text-red-600 text-sm mt-1 block">{errors.email.message}</span>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input  
                                        data-test="login-password-input"
                                        type={showPassword ? "text" : "password"}
                                        {...register('password')}
                                        placeholder="Enter your password"
                                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <span className="text-red-600 text-sm mt-1 block">{errors.password.message}</span>
                                )}
                            </div>

                            <div className="text-left">
                                <a href="#" className="text-sm text-gray-600 hover:text-teal-600 underline">
                                    Lost your password?
                                </a>
                            </div>

                            <button 
                                data-test="login-submit-button"
                                type="submit" 
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3 px-6 rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all font-semibold text-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        <span>Signing In...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Sign In</span>
                                        <span>→</span>
                                    </>
                                )}
                            </button>

                            <div className="text-center">
                                <a 
                                    href="/" 
                                    className="text-sm text-gray-600 hover:text-teal-600 underline"
                                >
                                    Back to main website
                                </a>
                            </div>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-gray-600">
                                Don't have an account?{' '}
                                <a href="/register" className="text-teal-600 hover:text-teal-700 font-semibold">
                                    Register here
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;