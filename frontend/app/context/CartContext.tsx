'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { showToast } from '@/components/ToastProvider';

interface CartItem {
  id: string;
  name: string;
  price: number;
  finalPrice: number;
  imageUrl: string;
  quantity: number;
  stock: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: any, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to load cart:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: any, quantity: number) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // Update quantity if item exists
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
          showToast.error('موجودی محصول کافی نیست');
          return prevItems;
        }
        
        showToast.success(`تعداد "${product.name}" در سبد خرید به روز شد`);
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        // Add new item
        if (quantity > product.stock) {
          showToast.error('موجودی محصول کافی نیست');
          return prevItems;
        }
        
        showToast.success(`"${product.name}" به سبد خرید اضافه شد`);
        return [...prevItems, {
          id: product.id,
          name: product.name,
          price: product.price,
          finalPrice: product.finalPrice,
          imageUrl: product.imageUrl || '/images/placeholder.jpg',
          quantity,
          stock: product.stock
        }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(prevItems => {
      const item = prevItems.find(i => i.id === productId);
      if (item) {
        showToast.info(`"${item.name}" از سبد خرید حذف شد`);
      }
      return prevItems.filter(item => item.id !== productId);
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems(prevItems =>
      prevItems.map(item => {
        if (item.id === productId) {
          if (quantity > item.stock) {
            showToast.error('موجودی محصول کافی نیست');
            return item;
          }
          if (quantity < 1) {
            removeFromCart(productId);
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    showToast.info('سبد خرید خالی شد');
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.finalPrice * item.quantity), 0);
  };

  const isInCart = (productId: string) => {
    return items.some(item => item.id === productId);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice,
      isInCart
    }}>
      {children}
    </CartContext.Provider>
  );
};