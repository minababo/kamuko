import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ImageUploader from './ImageUploader';
import api from '../../utils/api';

function MenuItemForm({ item, categories, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        categoryId: '',
        imageUrl: '',
        isAvailable: true,
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (item) {
            setFormData({
                name: item.name || '',
                description: item.description || '',
                price: item.price || '',
                categoryId: item.categoryId || '',
                imageUrl: item.imageUrl || '',
                isAvailable: item.isAvailable ?? true,
            });
        }
    }, [item]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Item name is required';
        }

        if (!formData.price || formData.price <= 0) {
            newErrors.price = 'Valid price is required';
        }

        if (!formData.categoryId) {
            newErrors.categoryId = 'Category is required';
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
                ...formData,
                price: parseFloat(formData.price),
            };

            if (item) {
                await api.put(`/products/${item.id}`, payload);
                toast.success('Item updated successfully');
            } else {
                await api.post('/products', payload);
                toast.success('Item created successfully');
            }
            onSuccess();
        } catch (error) {
            console.error('Failed to save item:', error);
            toast.error(error.response?.data?.message || 'Failed to save item');
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

    const handleImageUpload = (url) => {
        setFormData((prev) => ({ ...prev, imageUrl: url }));
    };

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                            <h2 className="text-xl font-semibold text-gray-900">
                                {item ? 'Edit Menu Item' : 'Add New Menu Item'}
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
                        <form onSubmit={handleSubmit} className="space-y-6 px-6 py-4">
                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Name */}
                                <div className="md:col-span-2">
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Item Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full rounded-lg border ${errors.name ? 'border-red-300' : 'border-gray-300'
                                            } px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500`}
                                        placeholder="e.g., Margherita Pizza"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                    )}
                                </div>

                                {/* Category */}
                                <div>
                                    <label
                                        htmlFor="categoryId"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Category <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="categoryId"
                                        name="categoryId"
                                        value={formData.categoryId}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full rounded-lg border ${errors.categoryId ? 'border-red-300' : 'border-gray-300'
                                            } px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500`}
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.categoryId && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.categoryId}
                                        </p>
                                    )}
                                </div>

                                {/* Price */}
                                <div>
                                    <label
                                        htmlFor="price"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Price <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative mt-1">
                                        <span className="absolute left-4 top-2 text-gray-500">$</span>
                                        <input
                                            type="number"
                                            id="price"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            min="0"
                                            step="0.01"
                                            className={`block w-full rounded-lg border ${errors.price ? 'border-red-300' : 'border-gray-300'
                                                } py-2 pl-8 pr-4 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500`}
                                            placeholder="0.00"
                                        />
                                    </div>
                                    {errors.price && (
                                        <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="md:col-span-2">
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
                                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                                        placeholder="Brief description of the item"
                                    />
                                </div>

                                {/* Image Upload */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Item Image
                                    </label>
                                    <ImageUploader
                                        currentImageUrl={formData.imageUrl}
                                        onImageUpload={handleImageUpload}
                                    />
                                </div>

                                {/* Available Toggle */}
                                <div className="md:col-span-2">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            id="isAvailable"
                                            name="isAvailable"
                                            checked={formData.isAvailable}
                                            onChange={handleChange}
                                            className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                        />
                                        <label
                                            htmlFor="isAvailable"
                                            className="text-sm font-medium text-gray-700"
                                        >
                                            Available for ordering
                                        </label>
                                    </div>
                                </div>
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
                                    ) : item ? (
                                        'Update Item'
                                    ) : (
                                        'Create Item'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MenuItemForm;
