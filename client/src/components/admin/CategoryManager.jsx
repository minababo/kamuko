import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import CategoryForm from './CategoryForm';
import api from '../../utils/api';

function CategoryManager() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data.categories || response.data || []);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingCategory(null);
        setIsFormOpen(true);
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setIsFormOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) {
            return;
        }

        try {
            await api.delete(`/categories/${id}`);
            toast.success('Category deleted successfully');
            fetchCategories();
        } catch (error) {
            console.error('Failed to delete category:', error);
            toast.error(error.response?.data?.message || 'Failed to delete category');
        }
    };

    const handleToggleActive = async (id, currentStatus) => {
        try {
            await api.patch(`/categories/${id}`, { isActive: !currentStatus });
            toast.success('Category status updated');
            fetchCategories();
        } catch (error) {
            console.error('Failed to update category:', error);
            toast.error('Failed to update category status');
        }
    };

    const handleFormSuccess = () => {
        setIsFormOpen(false);
        setEditingCategory(null);
        fetchCategories();
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between">
                <div className="text-sm text-gray-600">
                    {categories.length} {categories.length === 1 ? 'category' : 'categories'}
                </div>
                <button
                    type="button"
                    onClick={handleAdd}
                    className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5"
                    >
                        <path
                            fillRule="evenodd"
                            d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Add Category
                </button>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Description
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Order
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Status
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {categories.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center">
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="h-6 w-6 text-gray-400"
                                        >
                                            <path d="M11.644 1.59a.75.75 0 01.712 0l9.75 5.25a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.712 0l-9.75-5.25a.75.75 0 010-1.32l9.75-5.25z" />
                                            <path d="M3.265 10.602l7.668 4.129a2.25 2.25 0 002.134 0l7.668-4.13 1.37.739a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.71 0l-9.75-5.25a.75.75 0 010-1.32l1.37-.738z" />
                                            <path d="M10.933 19.231l-7.668-4.13-1.37.739a.75.75 0 000 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 000-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 01-2.134-.001z" />
                                        </svg>
                                    </div>
                                    <p className="mt-4 text-sm font-medium text-gray-900">
                                        No categories yet
                                    </p>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Get started by creating a new category
                                    </p>
                                </td>
                            </tr>
                        ) : (
                            categories.map((category) => (
                                <tr key={category.id} className="hover:bg-gray-50">
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="font-medium text-gray-900">
                                            {category.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="max-w-xs truncate text-sm text-gray-600">
                                            {category.description || '-'}
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                        {category.displayOrder ?? '-'}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleToggleActive(
                                                    category.id,
                                                    category.isActive
                                                )
                                            }
                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${category.isActive
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-700'
                                                }`}
                                        >
                                            {category.isActive ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                        <button
                                            type="button"
                                            onClick={() => handleEdit(category)}
                                            className="mr-3 text-orange-600 hover:text-orange-900"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(category.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {isFormOpen && (
                <CategoryForm
                    category={editingCategory}
                    onClose={() => {
                        setIsFormOpen(false);
                        setEditingCategory(null);
                    }}
                    onSuccess={handleFormSuccess}
                />
            )}
        </div>
    );
}

export default CategoryManager;
