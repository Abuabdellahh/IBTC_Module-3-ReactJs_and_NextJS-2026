import { createContext, useContext } from "react";
import { useCartStore } from "../store/cartStore";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  return <CartContext.Provider value={true}>{children}</CartContext.Provider>;
}

// Throws without a provider; use narrow selectors via the store directly.
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return useCartStore;
}
