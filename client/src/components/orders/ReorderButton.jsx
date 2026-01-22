import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { ShoppingCart } from 'lucide-react';

const ReorderButton = ({ order }) => {
    const navigate = useNavigate();
    const { addItem } = useCart();
    const [isLoading, setIsLoading] = useState(false);

    const handleReorder = async () => {
        try {
            setIsLoading(true);

            // Add all items from the order to the cart
            if (order.items && order.items.length > 0) {
                order.items.forEach((orderItem) => {
                    // Create cart item from order item
                    const cartItem = {
                        id: orderItem.product_id || orderItem.productId,
                        name: orderItem.product_name || orderItem.name,
                        price: orderItem.price,
                        image: orderItem.image || orderItem.product_image
                    };

                    addItem(cartItem, orderItem.quantity);
                });

                // Show success toast (you can integrate a toast library here)
                alert('Items added to cart!');

                // Navigate to cart
                navigate('/cart');
            }
        } catch (error) {
            console.error('Error reordering:', error);
            alert('Failed to add items to cart. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleReorder}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <ShoppingCart size={18} />
            {isLoading ? 'Adding...' : 'Reorder'}
        </button>
    );
};

export default ReorderButton;
