import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, Package } from 'lucide-react';
import OrderStatusBadge from '../order/OrderStatusBadge';
import ReorderButton from './ReorderButton';

const OrderCard = ({ order }) => {
    const navigate = useNavigate();

    // Format date and time
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    // Get first 2-3 items as preview
    const getItemsPreview = () => {
        if (!order.items || order.items.length === 0) return 'No items';

        const itemNames = order.items.slice(0, 3).map(item =>
            item.product_name || item.name
        );

        const preview = itemNames.join(', ');
        const remaining = order.items.length - 3;

        return remaining > 0 ? `${preview}, +${remaining} more` : preview;
    };

    // Check if order is active (pending, preparing, or ready)
    const isActive = () => {
        const activeStatuses = ['pending', 'preparing', 'ready'];
        return activeStatuses.includes(order.status?.toLowerCase());
    };

    const handleCardClick = () => {
        navigate(`/orders/${order.id}`);
    };

    const handleTrackOrder = (e) => {
        e.stopPropagation(); // Prevent card click
        navigate(`/orders/${order.id}`);
    };

    return (
        <div
            onClick={handleCardClick}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer p-6 border border-gray-200"
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order.id?.toString().padStart(6, '0') || order.order_number}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Clock size={16} />
                        <span>{formatDate(order.created_at || order.createdAt)}</span>
                        <span>•</span>
                        <span>{formatTime(order.created_at || order.createdAt)}</span>
                    </div>
                </div>
                <OrderStatusBadge status={order.status} />
            </div>

            {/* Items Preview */}
            <div className="mb-4">
                <div className="flex items-start gap-2 text-sm text-gray-700">
                    <Package size={16} className="mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{getItemsPreview()}</span>
                </div>
            </div>

            {/* Pickup Location (if available) */}
            {order.pickup_location && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <MapPin size={16} />
                    <span>{order.pickup_location}</span>
                </div>
            )}

            {/* Footer */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div>
                    <div className="text-sm text-gray-600">
                        {order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'items'}
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                        ${(order.total_amount || order.total || 0).toFixed(2)}
                    </div>
                </div>

                <div className="flex gap-2">
                    {isActive() && (
                        <button
                            onClick={handleTrackOrder}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Track
                        </button>
                    )}
                    <ReorderButton order={order} />
                </div>
            </div>
        </div>
    );
};

export default OrderCard;
