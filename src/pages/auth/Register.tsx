import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { usersAPI } from '../../reducers/users/usersAPI';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

type RegisterInputs = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
};

const schema = yup.object({
    firstName: yup.string().max(50, 'Max 50 characters').required('First name is required'),
    lastName: yup.string().max(50, 'Max 50 characters').required('Last name is required'),
    email: yup.string().email('Invalid email').max(100, 'Max 100 characters').required('Email is required'),
    password: yup.string().min(6, 'Min 6 characters').max(255, 'Max 255 characters').required('Password is required'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required'),
});

function Register() {
    const navigate = useNavigate();
    /*createApi Generates Hooks: When you define an endpoint in createApi using builder.mutation (for POST, PUT, DELETE operations)
     or builder.query (for GET operations), RTK Query automatically generates a React Hook for you.
     Naming Convention: The hook name is derived from your endpoint name. For an endpoint named createUsers, RTK Query generates a hook called useCreateUsersMutation.*/
    // const [createUser] = usersAPI.useCreateUsersMutation()
    const [createUser, { isLoading }] = usersAPI.useCreateUsersMutation(
        { fixedCacheKey: 'createUser' } // Ensures the mutation is not re-fetched unnecessarily
    )

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterInputs>({
        resolver: yupResolver(schema),
    });

    const onSubmit: SubmitHandler<RegisterInputs> = async (data) => {
        console.log(data);
        //Api
        try {
            const response = await createUser(data).unwrap() //.unwrap() will return the actual data from the successful response and will throw an error when API call results in error
            console.log("response here...", response);
            toast.success("Registration successful! Please check your email to verify your account.");
            // Redirect to verification page or login page
            setTimeout(() => {
                navigate('/register/verify', {
                    state: { email: data.email }
                });
            }, 2000);
        } catch (error) {
            console.log("Error", error);

        }

    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-base-200 ">
            <div className="w-full max-w-lg p-8 rounded-xl shadow-lg bg-white">
                <h1 className="text-3xl font-bold mb-6 text-center">Account Registration</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    <input
                        type="text"
                        {...register('firstName')}
                        placeholder="First Name"
                        className='input border border-gray-300 rounded w-full p-2 focus:ring-2 focus:ring-blue-500 text-lg '
                    />

                    {errors.firstName && (
                        <span className=" text-red-700 text-sm">{errors.firstName.message}</span>
                    )}

                    <input
                        type="text"
                        {...register('lastName')}
                        placeholder="Last Name"
                        className='input border border-gray-300 rounded w-full p-2 focus:ring-2 focus:ring-blue-500 text-lg '
                    />

                    {errors.lastName && (
                        <span className=" text-red-700 text-sm">{errors.lastName.message}</span>
                    )}

                    <input
                        type="email"
                        {...register('email')}
                        placeholder="Email"
                        className='input border border-gray-300 rounded w-full p-2 focus:ring-2 focus:ring-blue-500 text-lg '
                    />

                    {errors.email && (
                        <span className=" text-red-700 text-sm">{errors.email.message}</span>
                    )}

                    <input
                        type="password"
                        {...register('password')}
                        placeholder="Password"
                        className='input border border-gray-300 rounded w-full p-2 focus:ring-2 focus:ring-blue-500 text-lg '
                    />

                    {errors.password && (
                        <span className=" text-red-700 text-sm">{errors.password.message}</span>
                    )}

                    <input
                        type="password"
                        {...register('confirmPassword')}
                        placeholder="Confirm Password"
                        className='input border border-gray-300 rounded w-full p-2 focus:ring-2 focus:ring-blue-500 text-lg '
                    />

                    {errors.confirmPassword && (
                        <span className=" text-red-700 text-sm">{errors.confirmPassword.message}</span>
                    )}

                    <button type="submit" className="btn btn-primary w-full mt-4" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <span className="loading loading-spinner text-primary" /> Registering...
                            </>
                        ) : "Register"}
                    </button>

                </form>
                <p className="mt-6 text-center text-gray-600">
                    Already have an account?{' '}
                    <a href="/login" className="text-blue-600 hover:underline">
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
}

export default Register;
