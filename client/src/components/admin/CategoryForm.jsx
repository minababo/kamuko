import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';

function CategoryForm({ category, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        displayOrder: 0,
        isActive: true,
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name || '',
                description: category.description || '',
                displayOrder: category.displayOrder ?? 0,
                isActive: category.isActive ?? true,
            });
        }
    }, [category]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Category name is required';
        }

        if (formData.displayOrder < 0) {
            newErrors.displayOrder = 'Display order must be 0 or greater';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const payload = {
                name: formData.name,
                description: formData.description,
                displayOrder: Number(formData.displayOrder) || 0,
                isActive: formData.isActive,
            };

            if (category) {
                await api.put(`/categories/${category.id || category._id}`, payload);
                toast.success('Category updated successfully');
            } else {
                await api.post('/categories', payload);
                toast.success('Category created successfully');
            }
            onSuccess();
        } catch (error) {
            console.error('Failed to save category:', error);
            toast.error(error.response?.data?.message || error.response?.data?.error || 'Failed to save category');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="w-full max-w-lg rounded-lg bg-white shadow-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {category ? 'Edit Category' : 'Add New Category'}
                        </h2>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg p-1 text-gray-500 hover:bg-gray-100"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="h-6 w-6"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4 px-6 py-4">
                        {/* Name */}
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Category Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`mt-1 block w-full rounded-lg border ${errors.name ? 'border-red-300' : 'border-gray-300'
                                    } bg-white px-4 py-2 text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500`}
                                placeholder="e.g., Main Courses"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label
                                htmlFor="description"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                                placeholder="Brief description of this category"
                            />
                        </div>

                        {/* Display Order */}
                        <div>
                            <label
                                htmlFor="displayOrder"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Display Order
                            </label>
                            <input
                                type="number"
                                id="displayOrder"
                                name="displayOrder"
                                value={formData.displayOrder}
                                onChange={handleChange}
                                min="0"
                                className={`mt-1 block w-full rounded-lg border ${errors.displayOrder ? 'border-red-300' : 'border-gray-300'
                                    } bg-white px-4 py-2 text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500`}
                            />
                            {errors.displayOrder && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.displayOrder}
                                </p>
                            )}
                            <p className="mt-1 text-sm text-gray-500">
                                Categories are sorted by this value (lowest first)
                            </p>
                        </div>

                        {/* Active Status */}
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="isActive"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                                className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                            />
                            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                                Active (visible to customers)
                            </label>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 border-t border-gray-200 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg
                                            className="h-4 w-4 animate-spin"
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
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>
                                        Saving...
                                    </span>
                                ) : category ? (
                                    'Update Category'
                                ) : (
                                    'Create Category'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default CategoryForm;
