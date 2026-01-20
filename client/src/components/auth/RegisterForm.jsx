function RegisterForm({ form, onSubmit, isSubmitting }) {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = form;

    const passwordValue = watch('password');

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="username">
                    Username
                </label>
                <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    {...register('username', {
                        required: 'Username is required',
                    })}
                />
                {errors.username && (
                    <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    {...register('email', {
                        required: 'Email is required',
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Enter a valid email address',
                        },
                    })}
                />
                {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    {...register('password', {
                        required: 'Password is required',
                        minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters',
                        },
                    })}
                />
                {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
            </div>

            <div>
                <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="confirmPassword"
                >
                    Confirm password
                </label>
                <input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: (value) =>
                            value === passwordValue || 'Passwords do not match',
                    })}
                />
                {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="phone">
                    Phone (optional)
                </label>
                <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    {...register('phone')}
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-70"
            >
                {isSubmitting && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}
                {isSubmitting ? 'Creating account...' : 'Create account'}
            </button>
        </form>
    );
}

export default RegisterForm;
