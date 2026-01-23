import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import MenuItemForm from './MenuItemForm';
import AvailabilityToggle from './AvailabilityToggle';
import FeaturedToggle from './FeaturedToggle';
import api from '../../utils/api';

function MenuItemTable() {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortKey, setSortKey] = useState('name');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchData();
    }, []);

    const normalizeCategory = (category) => ({
        ...category,
        id: category._id || category.id,
    });

    const normalizeItem = (item) => ({
        ...item,
        id: item._id || item.id,
        categoryId: item.category?._id || item.category || item.categoryId,
        categoryName: item.category?.name || item.categoryName,
        isFeatured: item.isFeatured ?? false,
    });

    const fetchData = async () => {
        try {
            const [itemsRes, categoriesRes] = await Promise.all([
                api.get('/products'),
                api.get('/categories/all'),
            ]);
            const itemData = itemsRes.data.products || itemsRes.data || [];
            const categoryData = categoriesRes.data.categories || categoriesRes.data || [];
            setItems(itemData.map(normalizeItem));
            setCategories(categoryData.map(normalizeCategory));
        } catch (error) {
            console.error('Failed to fetch data:', error);
            toast.error('Failed to load menu items');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingItem(null);
        setIsFormOpen(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setIsFormOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) {
            return;
        }

        try {
            await api.delete(`/products/${id}`);
            toast.success('Item deleted successfully');
            fetchData();
        } catch (error) {
            console.error('Failed to delete item:', error);
            toast.error(error.response?.data?.message || 'Failed to delete item');
        }
    };

    const handleFormSuccess = () => {
        setIsFormOpen(false);
        setEditingItem(null);
        fetchData();
    };

    // Filter and search
    const filteredItems = items.filter((item) => {
        const matchesSearch =
            searchQuery === '' ||
            item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.categoryName?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory =
            selectedCategory === 'all' || item.categoryId === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const sortedItems = [...filteredItems].sort((a, b) => {
        if (sortKey === 'price') {
            return (a.price || 0) - (b.price || 0);
        }
        if (sortKey === 'category') {
            return (a.categoryName || '').localeCompare(b.categoryName || '');
        }
        return (a.name || '').localeCompare(b.name || '');
    });

    // Pagination
    const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = sortedItems.slice(startIndex, startIndex + itemsPerPage);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Filters and Actions */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 flex-wrap gap-3">
                    {/* Search */}
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                        placeholder="Search products or categories..."
                            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>

                    {/* Category Filter */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => {
                            setSelectedCategory(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    >
                        <option value="all">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={sortKey}
                        onChange={(e) => setSortKey(e.target.value)}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    >
                        <option value="name">Sort: Name</option>
                        <option value="category">Sort: Category</option>
                        <option value="price">Sort: Price</option>
                    </select>
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
                    Add Product
                </button>
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-600">
                Showing {paginatedItems.length} of {sortedItems.length} products
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Image
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Category
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Available
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Featured
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {paginatedItems.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-12 text-center">
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="h-6 w-6 text-gray-400"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.625 1.5H9a3.75 3.75 0 013.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 013.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 01-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875zm6.905 9.97a.75.75 0 00-1.06 0l-3 3a.75.75 0 101.06 1.06l1.72-1.72V18a.75.75 0 001.5 0v-4.19l1.72 1.72a.75.75 0 101.06-1.06l-3-3z"
                                                clipRule="evenodd"
                                            />
                                            <path d="M14.25 5.25a5.23 5.23 0 00-1.279-3.434 9.768 9.768 0 016.963 6.963A5.23 5.23 0 0016.5 7.5h-1.875a.375.375 0 01-.375-.375V5.25z" />
                                        </svg>
                                    </div>
                                    <p className="mt-4 text-sm font-medium text-gray-900">
                                        No products found
                                    </p>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {searchQuery || selectedCategory !== 'all'
                                            ? 'Try adjusting your filters'
                                            : 'Get started by adding your first product'}
                                    </p>
                                </td>
                            </tr>
                        ) : (
                            paginatedItems.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="whitespace-nowrap px-6 py-4">
                                        {item.imageUrl ? (
                                            <img
                                                src={item.imageUrl}
                                                alt={item.name}
                                                className="h-12 w-12 rounded-lg object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                    className="h-6 w-6 text-gray-400"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{item.name}</div>
                                        <div className="max-w-xs truncate text-sm text-gray-500">
                                            {item.description}
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                        {item.categoryName ||
                                            categories.find((c) => c.id === item.categoryId)?.name ||
                                            '-'}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                        ${item.price?.toFixed(2)}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <AvailabilityToggle
                                            itemId={item.id}
                                            isAvailable={item.isAvailable}
                                            onToggle={fetchData}
                                        />
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <FeaturedToggle
                                            itemId={item.id}
                                            isFeatured={item.isFeatured}
                                            onToggle={fetchData}
                                        />
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                        <button
                                            type="button"
                                            onClick={() => handleEdit(item)}
                                            className="mr-3 text-orange-600 hover:text-orange-900"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(item.id)}
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

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                    <div className="flex flex-1 justify-between sm:hidden">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Page <span className="font-medium">{currentPage}</span> of{' '}
                                <span className="font-medium">{totalPages}</span>
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isFormOpen && (
                <MenuItemForm
                    item={editingItem}
                    categories={categories}
                    onClose={() => {
                        setIsFormOpen(false);
                        setEditingItem(null);
                    }}
                    onSuccess={handleFormSuccess}
                />
            )}
        </div>
    );
}

export default MenuItemTable;
