import { useState, useCallback } from 'react';
import api from '../utils/api';
import { OrderContext } from './OrderContext';

export function OrderProvider({ children }) {
    const [currentOrder, setCurrentOrder] = useState(null);
    const [orderHistory, setOrderHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Create a new order
    const createOrder = useCallback(async (cartItems, address) => {
        try {
            setIsLoading(true);
            setError(null);

            const orderData = {
                items: cartItems.map((item) => ({
                    productId: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                })),
                address,
                total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
            };

            const response = await api.post('/orders', orderData);
            const newOrder = response.data.order;

            setCurrentOrder(newOrder);
            setOrderHistory((prev) => [newOrder, ...prev]);

            return { success: true, order: newOrder };
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to create order';
            setError(message);
            return { success: false, error: message };
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Get order status by ID
    const getOrderStatus = useCallback(async (orderId) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await api.get(`/orders/${orderId}`);
            const order = response.data.order;

            // Update current order if it matches
            if (currentOrder?.id === orderId) {
                setCurrentOrder(order);
            }

            // Update order in history
            setOrderHistory((prev) =>
                prev.map((o) => (o.id === orderId ? order : o))
            );

            return { success: true, order };
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to get order status';
            setError(message);
            return { success: false, error: message };
        } finally {
            setIsLoading(false);
        }
    }, [currentOrder?.id]);

    // Fetch order history
    const fetchOrderHistory = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await api.get('/orders');
            setOrderHistory(response.data.orders || []);

            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to fetch order history';
            setError(message);
            return { success: false, error: message };
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Clear current order
    const clearCurrentOrder = useCallback(() => {
        setCurrentOrder(null);
    }, []);

    const value = {
        currentOrder,
        orderHistory,
        isLoading,
        error,
        createOrder,
        getOrderStatus,
        fetchOrderHistory,
        clearCurrentOrder,
    };

    return (
        <OrderContext.Provider value={value}>
            {children}
        </OrderContext.Provider>
    );
}
