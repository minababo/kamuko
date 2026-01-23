import { useState, useEffect } from 'react';
import api from '../utils/api';
import OrderFilters from '../components/orders/OrderFilters';
import OrderHistoryList from '../components/orders/OrderHistoryList';
import Loader from '../components/common/Loader';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [activeFilter, setActiveFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch orders on component mount
    useEffect(() => {
        fetchOrders();
    }, []);

    // Filter orders when filter changes or orders update
    useEffect(() => {
        filterOrders();
    }, [activeFilter, orders]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get('/orders/my');
            const ordersData = response.data.data || response.data;

            const normalizedOrders = (Array.isArray(ordersData) ? ordersData : []).map((order) => ({
                ...order,
                id: order._id || order.id,
            }));

            // Sort orders by date (newest first)
            const sortedOrders = normalizedOrders.sort((a, b) => {
                const dateA = new Date(a.created_at || a.createdAt);
                const dateB = new Date(b.created_at || b.createdAt);
                return dateB - dateA;
            });

            setOrders(sortedOrders);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError(err.response?.data?.message || 'Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const filterOrders = () => {
        if (activeFilter === 'all') {
            setFilteredOrders(orders);
            return;
        }

        let filtered = [];

        switch (activeFilter) {
            case 'active':
                // Active orders: pending, preparing, or ready
                filtered = orders.filter(order =>
                    ['pending', 'preparing', 'ready'].includes(order.status?.toLowerCase())
                );
                break;
            case 'completed':
                filtered = orders.filter(order =>
                    order.status?.toLowerCase() === 'completed'
                );
                break;
            case 'cancelled':
                filtered = orders.filter(order =>
                    order.status?.toLowerCase() === 'cancelled'
                );
                break;
            default:
                filtered = orders;
        }

        setFilteredOrders(filtered);
    };

    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
    };

    const getEmptyMessage = () => {
        switch (activeFilter) {
            case 'active':
                return "You don't have any active orders at the moment.";
            case 'completed':
                return "You haven't completed any orders yet.";
            case 'cancelled':
                return "You don't have any cancelled orders.";
            default:
                return "You haven't placed any orders yet. Start exploring our menu!";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Order History
                    </h1>
                    <p className="text-gray-600">
                        View and track all your orders
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
                        {error}
                        <button
                            onClick={fetchOrders}
                            className="ml-4 underline hover:no-underline"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {/* Filters */}
                <OrderFilters
                    activeFilter={activeFilter}
                    onFilterChange={handleFilterChange}
                />

                {/* Orders List */}
                <OrderHistoryList
                    orders={filteredOrders}
                    emptyMessage={getEmptyMessage()}
                />

                {/* Pagination or Load More (placeholder for future implementation) */}
                {filteredOrders.length > 0 && (
                    <div className="mt-8 text-center text-gray-600 text-sm">
                        Showing {filteredOrders.length} of {filteredOrders.length} orders
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistory;
