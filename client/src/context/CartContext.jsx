import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('User'));
    if (user) {
      setUserId(user._id);
      // Load cart items for this user from localStorage
      const savedCart = localStorage.getItem(`cart_${user._id}`);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    }
  }, []);

  const addToCart = (product) => {
    setCart(prevCart => {
      // Check if product already exists in cart
      const existingItemIndex = prevCart.findIndex(item => item._id === product._id);
      
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: product.quantity
        };
        localStorage.setItem(`cart_${userId}`, JSON.stringify(updatedCart));
        return updatedCart;
      } else {
        // Add new item if it doesn't exist
        const updatedCart = [...prevCart, { ...product, userId }];
        localStorage.setItem(`cart_${userId}`, JSON.stringify(updatedCart));
        return updatedCart;
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => {
      const updatedCart = prevCart.filter(item => item._id !== productId);
      localStorage.setItem(`cart_${userId}`, JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const updateQuantity = (productId, quantity) => {
    setCart(prevCart => {
      const updatedCart = prevCart.map(item => 
        item._id === productId ? { ...item, quantity } : item
      );
      localStorage.setItem(`cart_${userId}`, JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    if (userId) {
      localStorage.removeItem(`cart_${userId}`);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
