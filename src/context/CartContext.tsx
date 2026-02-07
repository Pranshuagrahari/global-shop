import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { ICartItem } from '../shared/types';

interface CartContextType {
    cartItems: ICartItem[];
    addToCart: (item: ICartItem) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, delta: number) => void;
    clearCart: () => void;
    cartTotal: number;
    itemsBySeller: Record<string, ICartItem[]>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<ICartItem[]>(() => {
        try {
            const stored = localStorage.getItem('global-shop-cart');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error("Failed to load cart", error);
            return [];
        }
    });

    // Persistence
    useEffect(() => {
        try {
            localStorage.setItem('global-shop-cart', JSON.stringify(cartItems));
        } catch (error) {
            console.error("Failed to save cart", error);
        }
    }, [cartItems]);

    const addToCart = (newItem: ICartItem) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.productId === newItem.productId);
            if (existing) {
                return prev.map(item =>
                    item.productId === newItem.productId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, newItem];
        });
    };

    const removeFromCart = (productId: string) => {
        setCartItems(prev => prev.filter(item => item.productId !== productId));
    };

    const updateQuantity = (productId: string, delta: number) => {
        setCartItems(prev => prev.map(item => {
            if (item.productId === productId) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const clearCart = () => setCartItems([]);

    // Computed
    const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const itemsBySeller = cartItems.reduce((acc, item) => {
        if (!acc[item.sellerId]) acc[item.sellerId] = [];
        acc[item.sellerId].push(item);
        return acc;
    }, {} as Record<string, ICartItem[]>);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartTotal,
            itemsBySeller
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
};
