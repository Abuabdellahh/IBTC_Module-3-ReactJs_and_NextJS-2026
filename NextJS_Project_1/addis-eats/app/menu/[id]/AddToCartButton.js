'use client'

import { useState } from 'react'
import { useCart } from '../CartContext'

export default function AddToCartButton({ dish }) {
  const [count, setCount] = useState(0)
  const { addToCart } = useCart()

  const handleAdd = () => {
    setCount((c) => c + 1)
    addToCart(dish.price)
  }

  return (
    <button type="button" className="dish__add" onClick={handleAdd}>
      {count === 0 ? 'Add to order' : `Add again · ${count} added`}
    </button>
  )
}
