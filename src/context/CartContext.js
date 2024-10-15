import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a CartContext
const CartContext = createContext();

// CartProvider component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Load cart from localStorage when the component mounts
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage', error);
        localStorage.removeItem('cart'); // Clear invalid data
      }
    }
  }, []);

  // Updated addToCart function with size instead of variant
  const addToCart = (product, size) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id && item.size === size);
      const updatedCart = existingItem
        ? prevCart.map(item =>
            item.product.id === product.id && item.size === size
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...prevCart, { product, size, quantity: 1 }];

      // Save updated cart to localStorage
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  // Updated removeFromCart function with size
  const removeFromCart = (productId, size) => {
    setCart(prevCart => {
      const updatedCart = prevCart.filter(item => !(item.product.id === productId && item.size === size));

      // Save updated cart to localStorage
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  // Updated updateQuantity function with size
  const updateQuantity = (productId, size, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
    } else {
      setCart(prevCart => {
        const updatedCart = prevCart.map(item =>
          item.product.id === productId && item.size === size
            ? { ...item, quantity }
            : item
        );

        // Save updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        return updatedCart;
      });
    }
  };

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0); // Calculate total items in the cart
  const clearCart = () => {
    setCart([]);
    // Clear the cart in localStorage
    localStorage.removeItem('cart');
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook to use the CartContext
export const useCart = () => {
  return useContext(CartContext);
};
