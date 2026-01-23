function LoginForm({ form, onSubmit, isSubmitting }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = form;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                    autoComplete="current-password"
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    {...register('password', {
                        required: 'Password is required',
                    })}
                />
                {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
            </div>

            <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2 text-sm text-gray-600">
                    <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        {...register('remember')}
                    />
                    Remember me
                </label>
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                    Forgot password?
                </a>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-70"
            >
                {isSubmitting && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}
                {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
        </form>
    );
}

export default LoginForm;
