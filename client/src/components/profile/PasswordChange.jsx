import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import api from '../../utils/api';

function PasswordChange() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    const newPassword = watch('newPassword');

    const togglePasswordVisibility = (field) => {
        setShowPassword((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            setErrorMessage('');
            setSuccessMessage('');

            await api.put('/me/password', {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            });

            setSuccessMessage('Password updated successfully!');
            reset();
            setTimeout(() => setSuccessMessage(''), 5000);
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update password';
            setErrorMessage(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
                {/* Current Password */}
                <div>
                    <label
                        htmlFor="currentPassword"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Current Password
                    </label>
                    <div className="relative mt-1">
                        <input
                            id="currentPassword"
                            type={showPassword.current ? 'text' : 'password'}
                            autoComplete="current-password"
                            className="block w-full rounded-md border border-gray-300 px-3 py-2 pr-10 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            {...register('currentPassword', {
                                required: 'Current password is required',
                            })}
                        />
                        <button
                            type="button"
                            onClick={() => togglePasswordVisibility('current')}
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                            {showPassword.current ? (
                                <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                            ) : (
                                <EyeIcon className="h-5 w-5 text-gray-400" />
                            )}
                        </button>
                    </div>
                    {errors.currentPassword && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.currentPassword.message}
                        </p>
                    )}
                </div>

                {/* New Password */}
                <div>
                    <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium text-gray-700"
                    >
                        New Password
                    </label>
                    <div className="relative mt-1">
                        <input
                            id="newPassword"
                            type={showPassword.new ? 'text' : 'password'}
                            autoComplete="new-password"
                            className="block w-full rounded-md border border-gray-300 px-3 py-2 pr-10 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            {...register('newPassword', {
                                required: 'New password is required',
                                minLength: {
                                    value: 8,
                                    message: 'Password must be at least 8 characters',
                                },
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                                    message:
                                        'Password must contain uppercase, lowercase, and number',
                                },
                            })}
                        />
                        <button
                            type="button"
                            onClick={() => togglePasswordVisibility('new')}
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                            {showPassword.new ? (
                                <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                            ) : (
                                <EyeIcon className="h-5 w-5 text-gray-400" />
                            )}
                        </button>
                    </div>
                    {errors.newPassword && (
                        <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                        Must be at least 8 characters with uppercase, lowercase, and number
                    </p>
                </div>

                {/* Confirm Password */}
                <div>
                    <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Confirm New Password
                    </label>
                    <div className="relative mt-1">
                        <input
                            id="confirmPassword"
                            type={showPassword.confirm ? 'text' : 'password'}
                            autoComplete="new-password"
                            className="block w-full rounded-md border border-gray-300 px-3 py-2 pr-10 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            {...register('confirmPassword', {
                                required: 'Please confirm your password',
                                validate: (value) =>
                                    value === newPassword || 'Passwords do not match',
                            })}
                        />
                        <button
                            type="button"
                            onClick={() => togglePasswordVisibility('confirm')}
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                            {showPassword.confirm ? (
                                <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                            ) : (
                                <EyeIcon className="h-5 w-5 text-gray-400" />
                            )}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </div>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div className="rounded-md bg-green-50 p-4">
                    <p className="text-sm font-medium text-green-800">{successMessage}</p>
                </div>
            )}

            {/* Error Message */}
            {errorMessage && (
                <div className="rounded-md bg-red-50 p-4">
                    <p className="text-sm font-medium text-red-800">{errorMessage}</p>
                </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end border-t pt-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
                >
                    {isSubmitting ? (
                        <>
                            <svg
                                className="mr-2 h-4 w-4 animate-spin text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Updating...
                        </>
                    ) : (
                        'Update Password'
                    )}
                </button>
            </div>
        </form>
    );
}

export default PasswordChange;
