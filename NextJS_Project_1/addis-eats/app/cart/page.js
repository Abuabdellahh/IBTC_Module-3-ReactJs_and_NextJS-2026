'use client'

import Link from 'next/link'
import { useCart } from '../menu/CartContext'

export default function CartPage() {
  const { cart, clearCart } = useCart()

  if (cart.items === 0) {
    return (
      <div className="cart-page">
        <p className="cart-page__empty">Your cart is empty.</p>
        <p style={{ textAlign: 'center' }}>
          <Link href="/menu" className="cart-page__link">Browse the menu</Link>
        </p>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="card summary">
        <div className="summary__line">
          <span className="summary__label">
            {cart.items} {cart.items === 1 ? 'dish' : 'dishes'} in your order
          </span>
          <strong className="summary__total">{cart.total} ETB</strong>
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          <button type="button" className="summary__clear" onClick={clearCart}>
            Clear order
          </button>
          <Link href="/checkout" className="landing__cta" style={{ fontSize: '0.85rem', padding: '0.4rem 1.1rem' }}>
            Proceed to checkout →
          </Link>
        </div>
      </div>
    </div>
  )
}
