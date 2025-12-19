import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { ProductVariant, ProductWithVariants } from '../lib/database.types';

export interface CartItem {
  product: ProductWithVariants;
  variant: ProductVariant;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: ProductWithVariants, variant: ProductVariant) => void;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: ProductWithVariants, variant: ProductVariant) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.variant.id === variant.id);

      if (existingItem) {
        return currentItems.map(item =>
          item.variant.id === variant.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentItems, { product, variant, quantity: 1 }];
    });
  };

  const removeFromCart = (variantId: string) => {
    setItems(currentItems => currentItems.filter(item => item.variant.id !== variantId));
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(variantId);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.variant.id === variantId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.variant.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
