import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import OrderStatusBadge from './OrderStatusBadge';

const OrderHeader = ({ order }) => {
    if (!order) return null;

    // Format date and time
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    const isActiveOrder = order.status === 'pending' || order.status === 'preparing';

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Order Number and Date */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Order #{order.orderNumber || order.id}
                    </h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Placed on {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
                    </p>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-3">
                    <OrderStatusBadge status={order.status} />
                </div>
            </div>

            {/* Track Order Link for Active Orders */}
            {isActiveOrder && (
                <div className="mt-4 border-t border-gray-200 pt-4">
                    <Link
                        to={`/orders/${order.id}/track`}
                        className="inline-flex items-center text-orange-600 hover:text-orange-700 hover:underline"
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
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                        </svg>
                        Track Your Order
                    </Link>
                </div>
            )}
        </div>
    );
};

OrderHeader.propTypes = {
    order: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        orderNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        createdAt: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
    }),
};

export default OrderHeader;
