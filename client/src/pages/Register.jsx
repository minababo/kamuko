import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import RegisterForm from '../components/auth/RegisterForm';
import { useAuth } from '../hooks/useAuth';

function Register() {
    const { register: registerUser, isLoading } = useAuth();
    const navigate = useNavigate();

    const form = useForm({
        mode: 'onTouched',
        defaultValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            phone: '',
        },
    });

    const onSubmit = async (values) => {
        const payload = {
            username: values.username,
            email: values.email,
            password: values.password,
            ...(values.phone ? { phone: values.phone } : {}),
        };

        const result = await registerUser(payload);

        if (result.success) {
            toast.success('Account created successfully!');
            navigate('/menu', { replace: true });
            return;
        }

        toast.error(result.error || 'Registration failed');
    };

    const isSubmitting = form.formState.isSubmitting || isLoading;

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-12">
            <div className="mx-auto w-full max-w-md rounded-xl bg-white p-6 shadow-md sm:p-8">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-semibold text-gray-900">Create account</h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Join us and start ordering your favorites.
                    </p>
                </div>

                <RegisterForm form={form} onSubmit={onSubmit} isSubmitting={isSubmitting} />

                <p className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link className="font-medium text-blue-600 hover:text-blue-700" to="/login">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
