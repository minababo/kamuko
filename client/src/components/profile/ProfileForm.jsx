import { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../utils/api';

function ProfileForm({ user, setProfileData }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
    } = useForm({
        defaultValues: {
            username: user.username || '',
            email: user.email || '',
            phone: user.phone || '',
        },
    });

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            setErrorMessage('');
            setSuccessMessage('');

            const response = await api.patch('/users/me', {
                username: data.username,
                phone: data.phone,
            });

            const updatedUser = response.data?.user || response.data;
            setProfileData(updatedUser);

            // Update localStorage
            const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            const mergedUser = { ...storedUser, ...updatedUser };
            localStorage.setItem('user', JSON.stringify(mergedUser));

            setSuccessMessage('Profile updated successfully!');
            setTimeout(() => setSuccessMessage(''), 5000);
        } catch (error) {
            const message =
                error.response?.data?.message || error.response?.data?.error || 'Failed to update profile';
            setErrorMessage(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
                {/* Username */}
                <div>
                    <label
                        htmlFor="username"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        {...register('username', {
                            required: 'Username is required',
                            minLength: {
                                value: 3,
                                message: 'Username must be at least 3 characters',
                            },
                            maxLength: {
                                value: 50,
                                message: 'Username must not exceed 50 characters',
                            },
                        })}
                    />
                    {errors.username && (
                        <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                    )}
                </div>

                {/* Email (Display only) */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        disabled
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500 shadow-sm"
                        {...register('email')}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        Email cannot be changed. Contact support if needed.
                    </p>
                </div>

                {/* Phone */}
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone Number
                    </label>
                    <input
                        id="phone"
                        type="tel"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        {...register('phone', {
                            pattern: {
                                value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                                message: 'Enter a valid phone number',
                            },
                        })}
                    />
                    {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
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
            <div className="flex items-center justify-between border-t pt-4">
                <p className="text-sm text-gray-500">
                    {isDirty ? 'You have unsaved changes' : 'No changes to save'}
                </p>
                <button
                    type="submit"
                    disabled={isSubmitting || !isDirty}
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
                            Saving...
                        </>
                    ) : (
                        'Save Changes'
                    )}
                </button>
            </div>
        </form>
    );
}

export default ProfileForm;
