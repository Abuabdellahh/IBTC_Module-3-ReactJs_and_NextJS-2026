'use client'

import { useCart } from './CartContext'

export default function CartBadge() {
  const { cart } = useCart()
  if (cart.items === 0) return null
  return <span className="nav__badge">{cart.items}</span>
}
