import { createContext, useContext, useEffect, useState } from 'react';
import { getSession } from '../lib/api';

// The cart is kept in the browser, one per signed-in user, until checkout turns it into a
// real order (POST /api/v1/orders). The server re-reads each product's price at checkout.
const CartContext = createContext(null);

const storageKey = () => `bulldogex_cart_${getSession()?.user?._id ?? 'guest'}`;

const loadCart = () => {
  try {
    return JSON.parse(localStorage.getItem(storageKey())) ?? [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    localStorage.setItem(storageKey(), JSON.stringify(items));
  }, [items]);

  const addItem = (product, quantity = 1) =>
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === product._id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product._id ? { ...item, quantity: item.quantity + quantity } : item,
        );
      }
      return [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity,
        },
      ];
    });

  const setQuantity = (productId, quantity) =>
    setItems((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity: Math.max(1, quantity) } : item)),
    );

  const removeItem = (productId) => setItems((prev) => prev.filter((item) => item.productId !== productId));
  const clearCart = () => setItems([]);

  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, count, subtotal, addItem, setQuantity, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);
