import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../hooks/useAuth';

function Login() {
    const { login, isLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const form = useForm({
        mode: 'onTouched',
        defaultValues: {
            email: '',
            password: '',
            remember: true,
        },
    });

    const onSubmit = async (values) => {
        const { email, password } = values;
        const result = await login(email, password);

        if (result.success) {
            toast.success('Welcome back!');
            const destination = location.state?.from?.pathname || '/menu';
            navigate(destination, { replace: true });
            return;
        }

        toast.error(result.error || 'Login failed');
    };

    const isSubmitting = form.formState.isSubmitting || isLoading;

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-12">
            <div className="mx-auto w-full max-w-md rounded-xl bg-white p-6 shadow-md sm:p-8">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-semibold text-gray-900">Sign in</h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Enter your credentials to access your account.
                    </p>
                </div>

                <LoginForm form={form} onSubmit={onSubmit} isSubmitting={isSubmitting} />

                <p className="mt-6 text-center text-sm text-gray-600">
                    Don&apos;t have an account?{' '}
                    <Link className="font-medium text-blue-600 hover:text-blue-700" to="/register">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
