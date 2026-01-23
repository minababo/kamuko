import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import OrderQueueCard from '../../components/staff/OrderQueueCard';
import OrderDetailPanel from '../../components/staff/OrderDetailPanel';

function OrderQueue() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');

    const fetchOrders = useCallback(async () => {
        try {
            const params = new URLSearchParams();
            if (statusFilter && statusFilter !== 'all') {
                params.append('status', statusFilter);
            }

            const response = await fetch(`/api/orders?${params}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setOrders(data.orders || []);
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    }, [statusFilter]);

    useEffect(() => {
        fetchOrders();
        // Auto-refresh every 15 seconds
        const interval = setInterval(fetchOrders, 15000);
        return () => clearInterval(interval);
    }, [fetchOrders]);

    useEffect(() => {
        const status = searchParams.get('status');
        if (status) {
            setStatusFilter(status);
        }
    }, [searchParams]);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const response = await fetch(`/api/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                // Refresh orders
                await fetchOrders();
                // Update selected order if it's open
                if (selectedOrder?.id === orderId) {
                    const updatedOrder = orders.find((o) => o.id === orderId);
                    if (updatedOrder) {
                        setSelectedOrder({ ...updatedOrder, status: newStatus });
                    }
                }
            }
        } catch (error) {
            console.error('Failed to update order status:', error);
        }
    };

    const handleFilterChange = (status) => {
        setStatusFilter(status);
        if (status === 'all') {
            searchParams.delete('status');
        } else {
            searchParams.set('status', status);
        }
        setSearchParams(searchParams);
    };

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            searchQuery === '' ||
            order.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.orderNumber?.toString().includes(searchQuery);
        return matchesSearch;
    });

    const statusOptions = [
        { value: 'all', label: 'All Orders', count: orders.length },
        {
            value: 'pending',
            label: 'Pending',
            count: orders.filter((o) => o.status === 'pending').length,
        },
        {
            value: 'accepted',
            label: 'Accepted',
            count: orders.filter((o) => o.status === 'accepted').length,
        },
        {
            value: 'preparing',
            label: 'Preparing',
            count: orders.filter((o) => o.status === 'preparing').length,
        },
        {
            value: 'ready',
            label: 'Ready',
            count: orders.filter((o) => o.status === 'ready').length,
        },
        {
            value: 'completed',
            label: 'Completed',
            count: orders.filter((o) => o.status === 'completed').length,
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Order Queue</h1>
                    <p className="text-sm text-gray-600">
                        Manage and track all orders in real-time
                    </p>
                </div>
                <button
                    type="button"
                    onClick={fetchOrders}
                    disabled={loading}
                    className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
                    >
                        <path
                            fillRule="evenodd"
                            d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Refresh
                </button>
            </div>

            {/* Search and Filter */}
            <div className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="mb-4">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by order number..."
                            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
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
                </div>

                {/* Status Filter Tabs */}
                <div className="flex flex-wrap gap-2">
                    {statusOptions.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => handleFilterChange(option.value)}
                            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${statusFilter === option.value
                                    ? 'border-orange-600 bg-orange-50 text-orange-600'
                                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            {option.label}
                            <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                                {option.count}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders List */}
            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600" />
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="mx-auto h-12 w-12 text-gray-400"
                    >
                        <path
                            fillRule="evenodd"
                            d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 00-.673-.05A3 3 0 0015 1.5h-1.5a3 3 0 00-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0012 4.5h4.5A1.5 1.5 0 0015 3h-1.5z"
                            clipRule="evenodd"
                        />
                        <path
                            fillRule="evenodd"
                            d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V9.375zm9.586 4.594a.75.75 0 00-1.172-.938l-2.476 3.096-.908-.907a.75.75 0 00-1.06 1.06l1.5 1.5a.75.75 0 001.116-.062l3-3.75z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No orders found</h3>
                    <p className="mt-2 text-sm text-gray-600">
                        {searchQuery
                            ? 'Try adjusting your search'
                            : statusFilter === 'all'
                                ? 'No orders yet'
                                : `No ${statusFilter} orders`}
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                    {filteredOrders.map((order) => (
                        <OrderQueueCard
                            key={order.id}
                            order={order}
                            onStatusChange={handleStatusChange}
                            onViewDetails={() => setSelectedOrder(order)}
                        />
                    ))}
                </div>
            )}

            {/* Order Detail Panel */}
            {selectedOrder && (
                <OrderDetailPanel
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onStatusChange={handleStatusChange}
                />
            )}
        </div>
    );
}

export default OrderQueue;
