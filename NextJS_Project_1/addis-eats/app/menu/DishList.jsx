'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from './CartContext'

function DishItem({ dish }) {
  const [count, setCount] = useState(0)
  const { addToCart } = useCart()

  const handleAdd = () => {
    setCount((c) => c + 1)
    addToCart(dish.price)
  }

  return (
    <li className={`card dish ${count > 0 ? 'dish--ordered' : ''}`}>
      <div className="dish__row">
        <h3 className="dish__name">
          <Link href={`/menu/${dish.id}`} className="dish__link">
            {dish.name}
          </Link>
          {dish.spicy && <span className="badge">Spicy</span>}
        </h3>
        <span className="dish__dots" aria-hidden="true" />
        <span className="dish__price">{dish.price} ETB</span>
      </div>
      {dish.description && (
        <p className="dish__description">{dish.description}</p>
      )}
      <div className="dish__actions">
        {count > 0 && (
          <span className="dish__count">
            {count} × {dish.price * count} ETB
          </span>
        )}
        <button
          type="button"
          className="dish__add"
          onClick={handleAdd}
          aria-label={`Add ${dish.name} to order`}
        >
          Add{count > 0 && ` · ${count}`}
        </button>
      </div>
    </li>
  )
}

export default function DishList({ dishes }) {
  if (dishes.length === 0) {
    return (
      <div className="empty">
        <p className="empty__message">No dishes found.</p>
        <Link href="/menu" className="landing__cta" style={{ fontSize: '0.85rem' }}>
          Clear filters
        </Link>
      </div>
    )
  }

  return (
    <ul className="menu">
      {dishes.map((dish) => (
        <DishItem key={dish.id} dish={dish} />
      ))}
    </ul>
  )
}
