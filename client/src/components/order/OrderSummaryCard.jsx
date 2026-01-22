import OrderStatusBadge from './OrderStatusBadge';

const OrderSummaryCard = ({ order }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price) => {
        return `Rs. ${parseFloat(price).toFixed(2)}`;
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Order #{order.id}
                    </h2>
                    <p className="text-gray-600">
                        {formatDate(order.createdAt)}
                    </p>
                </div>
                <OrderStatusBadge status={order.status} />
            </div>

            <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h3>
                <div className="space-y-3">
                    {order.OrderItems?.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                            <div className="flex-1">
                                <p className="font-medium text-gray-800">
                                    {item.Product?.name || item.MenuItem?.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Quantity: {item.quantity}
                                </p>
                            </div>
                            <p className="font-semibold text-gray-800">
                                {formatPrice(item.price * item.quantity)}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="border-t border-gray-200 mt-4 pt-4">
                    <div className="flex justify-between items-center text-xl font-bold text-gray-800">
                        <span>Total</span>
                        <span>{formatPrice(order.totalAmount)}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        Payment Method: Cash on Collection
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OrderSummaryCard;
