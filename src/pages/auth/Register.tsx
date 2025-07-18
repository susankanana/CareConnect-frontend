import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { usersAPI } from '../../../src/reducers/users/usersAPI';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { Heart } from 'lucide-react';

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
    email: yup.string().email('Invalid email').max(100, 'Max 100 characters').required('Email is required'),
    contactPhone: yup.string().max(20, 'Max 20 characters').required('Phone number is required'),
    address: yup.string().max(255, 'Max 255 characters').required('Address is required'),
    password: yup.string().min(6, 'Min 6 characters').max(255, 'Max 255 characters').required('Password is required'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required'),
});

function Register() {
    const navigate = useNavigate();
    
    const [createUser, { isLoading }] = usersAPI.useCreateUsersMutation({
        fixedCacheKey: 'createUser'
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterInputs>({
        resolver: yupResolver(schema),
    });

    const onSubmit: SubmitHandler<RegisterInputs> = async (data) => {
        console.log(data);
        
        try {
            const response = await createUser(data).unwrap();
            console.log("response here...", response);
            toast.success("Registration successful! Please check your email to verify your account.");
            
            setTimeout(() => {
                navigate('/register/verify', {
                    state: { email: data.email }
                });
            }, 2000);
        } catch (error) {
            console.log("Error", error);
            toast.error("Registration failed. Please try again.");
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
                            Register
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-8">Create Account</h1>
                        
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        {...register('firstName')}
                                        placeholder="First name"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                    />
                                    {errors.firstName && (
                                        <span className="text-red-600 text-sm mt-1 block">{errors.firstName.message}</span>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        {...register('lastName')}
                                        placeholder="Last name"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                    />
                                    {errors.lastName && (
                                        <span className="text-red-600 text-sm mt-1 block">{errors.lastName.message}</span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    {...register('email')}
                                    placeholder="Enter your email address"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                />
                                {errors.email && (
                                    <span className="text-red-600 text-sm mt-1 block">{errors.email.message}</span>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    {...register('contactPhone')}
                                    placeholder="Enter your phone number"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                />
                                {errors.contactPhone && (
                                    <span className="text-red-600 text-sm mt-1 block">{errors.contactPhone.message}</span>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    {...register('address')}
                                    placeholder="Enter your address"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                />
                                {errors.address && (
                                    <span className="text-red-600 text-sm mt-1 block">{errors.address.message}</span>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    {...register('password')}
                                    placeholder="Create password"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                />
                                {errors.password && (
                                    <span className="text-red-600 text-sm mt-1 block">{errors.password.message}</span>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    {...register('confirmPassword')}
                                    placeholder="Confirm password"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                />
                                {errors.confirmPassword && (
                                    <span className="text-red-600 text-sm mt-1 block">{errors.confirmPassword.message}</span>
                                )}
                            </div>

                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3 px-6 rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all font-semibold text-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        <span>Creating Account...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Create Account</span>
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
                                Already have an account?{' '}
                                <a href="/login" className="text-teal-600 hover:text-teal-700 font-semibold">
                                    Login here
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;