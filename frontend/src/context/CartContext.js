import { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

// Item shape: { menuItemId, name, price, quantity, restaurantId }
export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const add = (newItem) => {
    setItems((prev) => {
      const idx = prev.findIndex(p => p.menuItemId === newItem.menuItemId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + (newItem.quantity || 1) };
        return copy;
      }
      return [...prev, { ...newItem, quantity: newItem.quantity || 1 }];
    });
  };

  const remove = (menuItemId) => setItems(prev => prev.filter(p => p.menuItemId !== menuItemId));
  const updateQty = (menuItemId, qty) =>
    setItems(prev => prev.map(p => p.menuItemId === menuItemId ? { ...p, quantity: Math.max(1, qty) } : p));
  const clear = () => setItems([]);
  const subtotal = useMemo(() => items.reduce((s, it) => s + Number(it.price) * Number(it.quantity), 0), [items]);

  return (
    <CartContext.Provider value={{ items, add, remove, updateQty, clear, subtotal }}>
      {children}
    </CartContext.Provider>
  );
};
