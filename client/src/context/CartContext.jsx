import { createContext, useState, useEffect, useCallback, useMemo } from 'react';

export const CartContext = createContext(null);

const CART_STORAGE_KEY = 'shopping_cart';

export function CartProvider({ children }) {
    const [items, setItems] = useState([]);

    // Load cart from localStorage on mount
    useEffect(() => {
        const storedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (storedCart) {
            try {
                const parsedCart = JSON.parse(storedCart);
                setItems(parsedCart);
            } catch (error) {
                console.error('Error parsing cart from localStorage:', error);
                localStorage.removeItem(CART_STORAGE_KEY);
            }
        }
    }, []);

    // Persist cart to localStorage whenever items change
    useEffect(() => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    // Calculate totals automatically
    const total = useMemo(() => {
        return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }, [items]);

    const itemCount = useMemo(() => {
        return items.reduce((count, item) => count + item.quantity, 0);
    }, [items]);

    // Add item to cart
    const addItem = useCallback((item, quantity = 1) => {
        setItems((prevItems) => {
            const existingItemIndex = prevItems.findIndex((i) => i.id === item.id);

            if (existingItemIndex > -1) {
                // Item already exists, update quantity
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex] = {
                    ...updatedItems[existingItemIndex],
                    quantity: updatedItems[existingItemIndex].quantity + quantity,
                };
                return updatedItems;
            } else {
                // Add new item
                return [...prevItems, { ...item, quantity }];
            }
        });
    }, []);

    // Remove item from cart
    const removeItem = useCallback((itemId) => {
        setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    }, []);

    // Update item quantity
    const updateQuantity = useCallback((itemId, quantity) => {
        if (quantity <= 0) {
            // Remove item if quantity is 0 or less
            setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
        } else {
            setItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === itemId ? { ...item, quantity } : item
                )
            );
        }
    }, []);

    // Clear entire cart
    const clearCart = useCallback(() => {
        setItems([]);
        localStorage.removeItem(CART_STORAGE_KEY);
    }, []);

    const value = {
        items,
        total,
        itemCount,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}
