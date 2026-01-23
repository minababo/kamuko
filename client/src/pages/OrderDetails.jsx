import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useCart } from '../hooks/useCart';
import Loader from '../components/common/Loader';
import OrderHeader from '../components/order/OrderHeader';
import OrderItemsTable from '../components/order/OrderItemsTable';
import OrderTotals from '../components/order/OrderTotals';
import OrderPickupInfo from '../components/order/OrderPickupInfo';

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addItem } = useCart();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reordering, setReordering] = useState(false);

    // Fetch order details
    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/orders/my/${id}`);
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

    // Handle reorder - add all items to cart
    const handleReorder = async () => {
        if (!order?.items || order.items.length === 0) {
            toast.error('No items to reorder');
            return;
        }

        try {
            setReordering(true);

            // Add each item to cart
            order.items.forEach((orderItem) => {
                // Extract item details from different possible structures
                const itemData = {
                    id:
                        orderItem.menuItemId ||
                        orderItem.productId ||
                        orderItem.product ||
                        orderItem.id,
                    name:
                        orderItem.name ||
                        orderItem.menuItem?.name ||
                        orderItem.product?.name ||
                        'Unknown Item',
                    price:
                        orderItem.unitPrice ||
                        orderItem.price ||
                        orderItem.menuItem?.price ||
                        orderItem.product?.price ||
                        0,
                    image: orderItem.image || orderItem.menuItem?.image || orderItem.product?.image,
                };

                addItem(itemData, orderItem.quantity);
            });

            toast.success('Items added to cart!');
            navigate('/cart');
        } catch (err) {
            console.error('Error reordering:', err);
            toast.error('Failed to add items to cart');
        } finally {
            setReordering(false);
        }
    };

    // Loading state
    if (loading) {
        return <Loader />;
    }

    // Error state
    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="rounded-lg bg-red-50 p-8 text-center">
                    <h2 className="mb-4 text-xl font-semibold text-red-800">{error}</h2>
                    <button
                        onClick={() => navigate('/orders')}
                        className="text-red-700 underline hover:text-red-900"
                    >
                        Back to Orders
                    </button>
                </div>
            </div>
        );
    }

    // No order found
    if (!order) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="rounded-lg bg-gray-50 p-8 text-center">
                    <p className="text-gray-600">Order not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mx-auto max-w-4xl">
                {/* Back button */}
                <button
                    onClick={() => navigate('/orders')}
                    className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
                >
                    <svg
                        className="mr-2 h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    Back to Orders
                </button>

                {/* Order Header */}
                <OrderHeader order={order} />

                {/* Main Content Grid */}
                <div className="mt-8 grid gap-8 lg:grid-cols-3">
                    {/* Left Column - Order Items and Totals */}
                    <div className="space-y-8 lg:col-span-2">
                        {/* Order Items Table */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-lg font-semibold text-gray-900">Order Items</h2>
                            <OrderItemsTable items={order.items} />
                        </div>

                        {/* Order Totals */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-lg font-semibold text-gray-900">Order Summary</h2>
                            <OrderTotals order={order} />
                        </div>
                    </div>

                    {/* Right Column - Pickup Info */}
                    <div className="space-y-8 lg:col-span-1">
                        {/* Pickup Information */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <OrderPickupInfo order={order} />
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={handleReorder}
                                disabled={reordering}
                                className="w-full rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {reordering ? 'Adding to Cart...' : 'Reorder'}
                            </button>

                            {(order.status === 'pending' || order.status === 'preparing') && (
                                <button
                    onClick={() => navigate(`/orders/${order._id || order.id}/track`)}
                                    className="w-full rounded-lg border-2 border-orange-600 px-6 py-3 font-semibold text-orange-600 transition hover:bg-orange-50"
                                >
                                    Track Order
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
