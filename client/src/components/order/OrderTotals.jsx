import PropTypes from 'prop-types';

const OrderTotals = ({ order }) => {
    if (!order) return null;

    // Calculate subtotal from items
    const calculateSubtotal = () => {
        if (!order.items || order.items.length === 0) return 0;

        return order.items.reduce((sum, item) => {
            const itemPrice = item.price || item.menuItem?.price || item.product?.price || 0;
            const itemQuantity = item.quantity || 1;
            return sum + (itemPrice * itemQuantity);
        }, 0);
    };

    const subtotal = calculateSubtotal();
    const total = order.totalAmount || order.total || subtotal;

    return (
        <div className="space-y-3">
            {/* Subtotal */}
            <div className="flex items-center justify-between text-gray-700">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
            </div>

            {/* Tax (if exists) */}
            {order.tax && order.tax > 0 && (
                <div className="flex items-center justify-between text-gray-700">
                    <span>Tax</span>
                    <span>${order.tax.toFixed(2)}</span>
                </div>
            )}

            {/* Service Fee (if exists) */}
            {order.serviceFee && order.serviceFee > 0 && (
                <div className="flex items-center justify-between text-gray-700">
                    <span>Service Fee</span>
                    <span>${order.serviceFee.toFixed(2)}</span>
                </div>
            )}

            {/* Divider */}
            <div className="border-t border-gray-200 pt-3">
                {/* Total Amount */}
                <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                    <span className="text-lg font-bold text-gray-900">${total.toFixed(2)}</span>
                </div>

                {/* Payment Method */}
                <div className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">Payment Method:</span> Cash on Pickup
                </div>
            </div>
        </div>
    );
};

OrderTotals.propTypes = {
    order: PropTypes.shape({
        items: PropTypes.array,
        totalAmount: PropTypes.number,
        total: PropTypes.number,
        tax: PropTypes.number,
        serviceFee: PropTypes.number,
    }),
};

export default OrderTotals;
