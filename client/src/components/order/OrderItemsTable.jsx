import PropTypes from 'prop-types';

const OrderItemsTable = ({ items }) => {
    if (!items || items.length === 0) {
        return (
            <div className="rounded-lg bg-gray-50 p-8 text-center">
                <p className="text-gray-600">No items found in this order</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-200 text-left text-sm font-semibold text-gray-700">
                        <th className="pb-3 pr-4">Item</th>
                        <th className="pb-3 px-4 text-center">Quantity</th>
                        <th className="pb-3 px-4 text-right">Unit Price</th>
                        <th className="pb-3 pl-4 text-right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => {
                        // Handle different data structures (MenuItem vs Product)
                        const itemName = item.name || item.menuItem?.name || item.product?.name || 'Unknown Item';
                        const itemPrice = item.price || item.menuItem?.price || item.product?.price || 0;
                        const itemQuantity = item.quantity || 1;
                        const itemImage = item.image || item.menuItem?.image || item.product?.image;
                        const itemTotal = itemPrice * itemQuantity;
                        const specialInstructions = item.specialInstructions || item.customizations || item.notes;

                        return (
                            <tr
                                key={item.id || index}
                                className="border-b border-gray-100 last:border-0"
                            >
                                {/* Item Name and Image */}
                                <td className="py-4 pr-4">
                                    <div className="flex items-center gap-3">
                                        {/* Item Image Thumbnail */}
                                        {itemImage && (
                                            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                                <img
                                                    src={itemImage}
                                                    alt={itemName}
                                                    className="h-full w-full object-cover"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                                                        e.target.parentElement.innerHTML = '<svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>';
                                                    }}
                                                />
                                            </div>
                                        )}
                                        {/* Item Name and Details */}
                                        <div>
                                            <p className="font-medium text-gray-900">{itemName}</p>
                                            {specialInstructions && (
                                                <p className="mt-1 text-xs text-gray-500">
                                                    {Array.isArray(specialInstructions)
                                                        ? specialInstructions.join(', ')
                                                        : specialInstructions}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </td>

                                {/* Quantity */}
                                <td className="py-4 px-4 text-center">
                                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-900">
                                        {itemQuantity}
                                    </span>
                                </td>

                                {/* Unit Price */}
                                <td className="py-4 px-4 text-right">
                                    <span className="text-gray-900">${itemPrice.toFixed(2)}</span>
                                </td>

                                {/* Total */}
                                <td className="py-4 pl-4 text-right">
                                    <span className="font-semibold text-gray-900">
                                        ${itemTotal.toFixed(2)}
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

OrderItemsTable.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            name: PropTypes.string,
            price: PropTypes.number,
            quantity: PropTypes.number,
            image: PropTypes.string,
            specialInstructions: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
            customizations: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
            notes: PropTypes.string,
            menuItem: PropTypes.object,
            product: PropTypes.object,
        })
    ),
};

export default OrderItemsTable;
