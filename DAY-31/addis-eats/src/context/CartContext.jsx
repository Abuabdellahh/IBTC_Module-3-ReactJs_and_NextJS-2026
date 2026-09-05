import { createContext, useContext, useState } from 'react'

const CartContext = createContext(null)

const EMPTY = { items: 0, total: 0 }

export function CartProvider({ children }) {
  const [cart, setCart] = useState(EMPTY)

  const addToCart = (price) =>
    setCart((c) => ({ items: c.items + 1, total: c.total + price }))

  const clearCart = () => setCart(EMPTY)

  return (
    <CartContext.Provider value={{ cart, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
