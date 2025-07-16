import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useLocation, useNavigate } from 'react-router';
import { loginAPI } from '../../reducers/login/loginAPI';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../reducers/login/userSlice';

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

    const emailFromState = location.state?.email || ''

    const [loginUser, { isLoading }] = loginAPI.useLoginUserMutation()


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
            const response = await loginUser(data).unwrap()
            dispatch(loginSuccess(response)) // you're dispatching an action with response as the payload

            console.log("Login response:", response);
            toast.success("Login successful!");

            if (response.user.role === 'admin') {
                navigate('/admin/dashboard/todos');
            } else if (response.user.role === 'user') {
                navigate('/user/dashboard/todos');
            }

        } catch (error) {
            console.log("Login error:", error);
            toast.error("Login failed. Please check your credentials and try again.");
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-base-200 ">
            <div className="w-full max-w-lg p-8 rounded-xl shadow-lg bg-white">
                <h1 className="text-3xl font-bold mb-6 text-center">Login to Your Account</h1>
                {/* Display any error messages here if needed */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    <input
                        type="email"
                        {...register('email')}
                        placeholder="Email"
                        className='input border border-gray-300 rounded w-full p-2 focus:ring-2 focus:ring-blue-500 text-lg '
                        readOnly={!!emailFromState} // Prevent editing if email is passed from state
                    />
                    {errors.email && (
                        <span className="text-sm  text-red-700">{errors.email.message}</span>
                    )}

                    <input
                        type="password"
                        {...register('password')}
                        placeholder="Password"
                        className='input border border-gray-300 rounded w-full p-2 focus:ring-2 focus:ring-blue-500 text-lg '
                    />
                    {errors.password && (
                        <span className="text-sm text-red-700">{errors.password.message}</span>
                    )}


                    <button type="submit" className="btn btn-primary w-full mt-4" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <span className="loading loading-spinner text-primary" /> Logining...
                            </>
                        ) : "Login"}
                    </button>
                </form>
                <div className="mt-6 flex flex-col items-center space-y-2">
                    <p className="text-gray-600">
                        Don't have an account?{' '}
                        <a href="/register" className="text-blue-600 hover:underline">
                            Register
                        </a>
                    </p>
                    <p className="text-gray-600">
                        <a href="/" className="text-blue-600 hover:underline">
                            Back to Home
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
