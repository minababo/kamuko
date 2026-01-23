import PropTypes from 'prop-types';

const OrderItemsList = ({ items }) => {
    if (!items || items.length === 0) {
        return (
            <div className="rounded-lg bg-gray-50 p-8 text-center">
                <p className="text-gray-600">No items found in this order</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {items.map((item, index) => {
                // Handle different data structures (MenuItem vs Product)
                const itemName = item.name || item.menuItem?.name || item.product?.name || 'Unknown Item';
                const itemPrice = item.price || item.menuItem?.price || item.product?.price || 0;
                const itemQuantity = item.quantity || 1;
                const itemImage = item.image || item.menuItem?.image || item.product?.image;
                const itemTotal = itemPrice * itemQuantity;

                return (
                    <div
                        key={item.id || index}
                        className="flex items-center gap-4 rounded-lg border border-gray-200 p-4 transition hover:border-gray-300"
                    >
                        {/* Item Image */}
                        {itemImage && (
                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                <img
                                    src={itemImage}
                                    alt={itemName}
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            </div>
                        )}

                        {/* Item Details */}
                        <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{itemName}</h3>
                            <p className="mt-1 text-sm text-gray-600">
                                ${itemPrice.toFixed(2)} each
                            </p>
                            {item.customizations && item.customizations.length > 0 && (
                                <p className="mt-1 text-xs text-gray-500">
                                    {item.customizations.join(', ')}
                                </p>
                            )}
                        </div>

                        {/* Quantity */}
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-gray-100 px-3 py-1">
                                <span className="text-sm font-medium text-gray-900">
                                    Qty: {itemQuantity}
                                </span>
                            </div>

                            {/* Item Total */}
                            <div className="text-right">
                                <p className="font-semibold text-gray-900">
                                    ${itemTotal.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

OrderItemsList.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            name: PropTypes.string,
            price: PropTypes.number,
            quantity: PropTypes.number,
            image: PropTypes.string,
            customizations: PropTypes.arrayOf(PropTypes.string),
            menuItem: PropTypes.shape({
                name: PropTypes.string,
                price: PropTypes.number,
                image: PropTypes.string,
            }),
            product: PropTypes.shape({
                name: PropTypes.string,
                price: PropTypes.number,
                image: PropTypes.string,
            }),
        })
    ).isRequired,
};

export default OrderItemsList;
