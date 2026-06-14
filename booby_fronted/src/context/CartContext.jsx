import { createContext, useContext,useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {

  const [cartItems, setCartItems] = useState(() => {
  return JSON.parse(localStorage.getItem("cart")) || [];
});

useEffect(() => {
  localStorage.setItem("cart", JSON.stringify(cartItems));
}, [cartItems]);

  const addToCart = (product) => {

  setCartItems((prev) => {

    const existing = prev.find((item) => item.id === product.id);

    const incomingQty = product.qty || 1; 

    if (existing) {
      return prev.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + incomingQty }
          : item
      );
    }

    return [
      ...prev,
      {
        ...product,
        quantity: incomingQty, 
        months: 3
      }
    ];
  });

};

  const decreaseQuantity = (id) => {

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
          : item
      )
    );

  };

  const removeFromCart = (id) => {

    setCartItems((prev) =>
      prev.filter((item) => item.id !== id)
    );

  };

  const updateMonths = (id, months) => {

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, months: Number(months) }
          : item
      )
    );

  };

  const clearCart = () => {
  setCartItems([]);
};

  return (
    <CartContext.Provider
      value={{
        cartItems,
        clearCart,
        addToCart,
        removeFromCart,
        decreaseQuantity,
        updateMonths
      }}
    >
      {children}
    </CartContext.Provider>
  );

};

export const useCart = () =>
  { return useContext(CartContext);
  }
