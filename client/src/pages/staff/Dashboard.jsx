import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PendingOrdersAlert from '../../components/staff/PendingOrdersAlert';
import api from '../../utils/api';

function Dashboard() {
    const [stats, setStats] = useState({
        pending: 0,
        preparing: 0,
        ready: 0,
        completedToday: 0,
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = useCallback(async () => {
        try {
            const response = await api.get('/orders', { params: { limit: 5 } });
            const data = response.data || {};
            const orders = Array.isArray(data) ? data : data.orders || [];
            const normalizedOrders = orders.map((order) => ({
                ...order,
                id: order._id || order.id,
                orderNumber: order.orderNumber || order.order_number,
                itemCount: order.itemCount ?? order.items?.length ?? 0,
            }));

            // Calculate stats from orders
            const pending = normalizedOrders.filter((o) => o.status === 'placed').length || 0;
            const preparing = normalizedOrders.filter((o) => o.status === 'preparing').length || 0;
            const ready = normalizedOrders.filter((o) => o.status === 'ready').length || 0;
            const completedToday =
                normalizedOrders.filter((o) => {
                    if (o.status !== 'completed') return false;
                    const updated = new Date(o.updatedAt || o.createdAt);
                    const now = new Date();
                    return (
                        updated.getFullYear() === now.getFullYear() &&
                        updated.getMonth() === now.getMonth() &&
                        updated.getDate() === now.getDate()
                    );
                }).length || 0;

            setStats({
                pending,
                preparing,
                ready,
                completedToday,
            });

            setRecentOrders(normalizedOrders.slice(0, 5));
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
        // Refresh every 30 seconds
        const interval = setInterval(fetchDashboardData, 30000);
        return () => clearInterval(interval);
    }, [fetchDashboardData]);

    const statCards = [
        {
            label: 'Pending Orders',
            value: stats.pending,
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-8 w-8"
                >
                    <path
                        fillRule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
                        clipRule="evenodd"
                    />
                </svg>
            ),
            color: 'text-yellow-600',
            bg: 'bg-yellow-50',
            border: 'border-yellow-200',
        },
        {
            label: 'Preparing',
            value: stats.preparing,
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-8 w-8"
                >
                    <path
                        fillRule="evenodd"
                        d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152-.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 011.925-3.545 3.75 3.75 0 013.255 3.717z"
                        clipRule="evenodd"
                    />
                </svg>
            ),
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            border: 'border-blue-200',
        },
        {
            label: 'Ready for Pickup',
            value: stats.ready,
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-8 w-8"
                >
                    <path
                        fillRule="evenodd"
                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                        clipRule="evenodd"
                    />
                </svg>
            ),
            color: 'text-green-600',
            bg: 'bg-green-50',
            border: 'border-green-200',
        },
        {
            label: 'Completed Today',
            value: stats.completedToday,
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-8 w-8"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.753 6.753 0 006.138 5.6 6.73 6.73 0 002.743 1.346A6.707 6.707 0 019.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 00-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 00.75-.75 2.25 2.25 0 00-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 01-1.112-3.173 6.73 6.73 0 002.743-1.347 6.753 6.753 0 006.139-5.6.75.75 0 00-.585-.858 47.077 47.077 0 00-3.07-.543V2.62a.75.75 0 00-.658-.744 49.22 49.22 0 00-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 00-.657.744zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 013.16 5.337a45.6 45.6 0 012.006-.343v.256zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 01-2.863 3.207 6.72 6.72 0 00.857-3.294z"
                        clipRule="evenodd"
                    />
                </svg>
            ),
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            border: 'border-purple-200',
        },
    ];

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-700',
            placed: 'bg-yellow-100 text-yellow-700',
            accepted: 'bg-blue-100 text-blue-700',
            preparing: 'bg-blue-100 text-blue-700',
            ready: 'bg-green-100 text-green-700',
            completed: 'bg-gray-100 text-gray-700',
            cancelled: 'bg-red-100 text-red-700',
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    };

    const getStatusLabel = (status) => (status === 'placed' ? 'pending' : status);

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = Math.floor((now - date) / 1000 / 60); // minutes

        if (diff < 1) return 'Just now';
        if (diff < 60) return `${diff}m ago`;
        if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
        return date.toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Staff Dashboard</h1>
                    <p className="text-sm text-gray-600">Monitor and manage orders in real-time</p>
                </div>
                <Link
                    to="/staff/orders"
                    className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
                >
                    View All Orders
                </Link>
            </div>

            <PendingOrdersAlert count={stats.pending} />

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat) => (
                    <div
                        key={stat.label}
                        className={`rounded-lg border ${stat.border} ${stat.bg} p-6`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                                <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                            <div className={stat.color}>{stat.icon}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">Quick Actions</h2>
                <div className="grid gap-4 sm:grid-cols-3">
                    <Link
                        to="/staff/orders?status=pending"
                        className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                    >
                        <div className="rounded-full bg-yellow-100 p-3 text-yellow-600">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="h-5 w-5"
                            >
                                <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625z" />
                                <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
                            </svg>
                        </div>
                        <div>
                            <div className="font-medium text-gray-900">Process Pending</div>
                            <div className="text-sm text-gray-600">Review new orders</div>
                        </div>
                    </Link>

                    <Link
                        to="/staff/orders?status=preparing"
                        className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                    >
                        <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="h-5 w-5"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152-.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 011.925-3.545 3.75 3.75 0 013.255 3.717z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div>
                            <div className="font-medium text-gray-900">In Kitchen</div>
                            <div className="text-sm text-gray-600">Track preparation</div>
                        </div>
                    </Link>

                    <Link
                        to="/staff/orders?status=ready"
                        className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                    >
                        <div className="rounded-full bg-green-100 p-3 text-green-600">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="h-5 w-5"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div>
                            <div className="font-medium text-gray-900">Ready Orders</div>
                            <div className="text-sm text-gray-600">Complete pickup</div>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="rounded-lg border border-gray-200 bg-white">
                <div className="flex items-center justify-between border-b border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                    <Link
                        to="/staff/orders"
                        className="text-sm font-medium text-orange-600 hover:text-orange-700"
                    >
                        View All
                    </Link>
                </div>
                <div className="divide-y divide-gray-200">
                    {recentOrders.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            No orders yet
                        </div>
                    ) : (
                        recentOrders.map((order) => (
                            <div key={order.id} className="p-4 hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <div className="font-medium text-gray-900">
                                                Order #{order.orderNumber?.toString().slice(-8) || order.id?.slice(-8)}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {order.itemCount || 0} items • {formatTime(order.createdAt)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(order.status)}`}
                                        >
                                            {getStatusLabel(order.status)}
                                        </span>
                                        <Link
                                            to="/staff/orders"
                                            className="text-orange-600 hover:text-orange-700"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                className="h-5 w-5"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
