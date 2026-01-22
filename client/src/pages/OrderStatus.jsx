import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/common/Loader';
import OrderStatusTracker from '../components/order/OrderStatusTracker';
import StatusTimeline from '../components/order/StatusTimeline';
import OrderItemsList from '../components/order/OrderItemsList';
import OrderActions from '../components/order/OrderActions';

const OrderStatus = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('tracker'); // 'tracker' or 'timeline'

    // Fetch order details
    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/orders/${id}`);
                setOrder(response.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching order:', err);
                setError(err.response?.status === 404 ? 'Order not found' : 'Failed to load order');
                if (err.response?.status === 404) {
                    toast.error('Order not found');
                }
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchOrder();
        }
    }, [id]);

    // WebSocket connection for real-time updates
    useEffect(() => {
        if (!user?.id) return;

        const socketUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
        const newSocket = io(socketUrl, {
            transports: ['websocket', 'polling'],
        });

        newSocket.on('connect', () => {
            console.log('WebSocket connected');
            newSocket.emit('join', { userId: user.id });
        });

        newSocket.on('order.status.updated', (payload) => {
            console.log('Order status updated:', payload);

            // Check if this is the current order
            if (payload.orderId === id) {
                setOrder(prevOrder => ({
                    ...prevOrder,
                    status: payload.status,
                    statusHistory: payload.statusHistory || prevOrder.statusHistory,
                    updatedAt: payload.updatedAt || new Date().toISOString(),
                }));

                // Show notification
                toast.info(`Order status updated to: ${payload.status}`, {
                    autoClose: 5000,
                });
            }
        });

        newSocket.on('disconnect', () => {
            console.log('WebSocket disconnected');
        });

        newSocket.on('connect_error', (err) => {
            console.error('WebSocket connection error:', err);
        });

        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
        };
    }, [user?.id, id]);

    // Handle order cancellation
    const handleCancelOrder = async () => {
        try {
            await api.patch(`/orders/${id}/cancel`);
            setOrder(prev => ({ ...prev, status: 'Cancelled' }));
            toast.success('Order cancelled successfully');
        } catch (err) {
            console.error('Error cancelling order:', err);
            toast.error(err.response?.data?.message || 'Failed to cancel order');
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-100 items-center justify-center">
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                    <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <h2 className="mb-2 text-2xl font-semibold text-gray-900">{error}</h2>
                <p className="mb-6 text-gray-600">The order you're looking for doesn't exist or has been removed.</p>
                <button
                    onClick={() => navigate('/orders')}
                    className="rounded-lg bg-orange-500 px-6 py-2 font-medium text-white transition hover:bg-orange-600"
                >
                    View All Orders
                </button>
            </div>
        );
    }

    if (!order) {
        return null;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Order Status</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Order #{order.id} · Placed {new Date(order.createdAt).toLocaleString()}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setViewMode('tracker')}
                            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${viewMode === 'tracker'
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Tracker View
                        </button>
                        <button
                            onClick={() => setViewMode('timeline')}
                            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${viewMode === 'timeline'
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Timeline View
                        </button>
                    </div>
                </div>
            </div>

            {/* Status Visualization */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
                {viewMode === 'tracker' ? (
                    <OrderStatusTracker status={order.status} />
                ) : (
                    <StatusTimeline statusHistory={order.statusHistory} status={order.status} />
                )}
            </div>

            {/* Order Details Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Order Items */}
                <div className="lg:col-span-2">
                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-gray-900">Order Items</h2>
                        <OrderItemsList items={order.items || order.orderItems} />

                        {/* Totals */}
                        <div className="mt-6 space-y-2 border-t pt-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium text-gray-900">${order.subtotal?.toFixed(2) || '0.00'}</span>
                            </div>
                            {order.tax > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="font-medium text-gray-900">${order.tax.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between border-t pt-2 text-base font-semibold">
                                <span className="text-gray-900">Total</span>
                                <span className="text-orange-600">${order.total?.toFixed(2) || '0.00'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Info & Actions */}
                <div className="space-y-6">
                    {/* Pickup Information */}
                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-gray-900">Pickup Information</h2>
                        <div className="space-y-3 text-sm">
                            <div>
                                <p className="text-gray-600">Customer</p>
                                <p className="font-medium text-gray-900">{order.customerName || user?.name}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Phone</p>
                                <p className="font-medium text-gray-900">{order.customerPhone || user?.phone || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Payment Method</p>
                                <p className="font-medium text-gray-900">{order.paymentMethod || 'Credit Card'}</p>
                            </div>
                            {order.notes && (
                                <div>
                                    <p className="text-gray-600">Special Instructions</p>
                                    <p className="font-medium text-gray-900">{order.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Actions */}
                    <OrderActions
                        order={order}
                        onCancel={handleCancelOrder}
                    />
                </div>
            </div>
        </div>
    );
};

export default OrderStatus;
