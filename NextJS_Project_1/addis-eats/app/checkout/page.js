'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '../menu/CartContext'

export default function CheckoutPage() {
  const { cart, clearCart } = useCart()
  const [receipt, setReceipt] = useState(null)
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setReceipt({ name, address, total: cart.total, items: cart.items })
    clearCart()
  }

  if (receipt) {
    return (
      <div className="card receipt">
        <h2 className="receipt__title">Order confirmed 🎉</h2>
        <p className="receipt__body">
          Thank you, <strong>{receipt.name}</strong>!<br />
          {receipt.items} {receipt.items === 1 ? 'dish' : 'dishes'} totalling{' '}
          <strong>{receipt.total} ETB</strong> will be delivered to{' '}
          <strong>{receipt.address}</strong>.
        </p>
        <Link href="/menu" className="receipt__dismiss">
          Back to menu
        </Link>
      </div>
    )
  }

  return (
    <div className="card delivery">
      <h2 className="delivery__title">Checkout</h2>
      <p className="delivery__hint">
        {cart.items === 0
          ? 'Your cart is empty.'
          : `${cart.items} ${cart.items === 1 ? 'dish' : 'dishes'} · ${cart.total} ETB`}
      </p>

      {cart.items === 0 ? (
        <Link href="/menu" className="landing__cta" style={{ fontSize: '0.85rem' }}>
          Browse the menu
        </Link>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="field__label" htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="address">Delivery address</label>
            <input
              id="address"
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Bole, Addis Ababa…"
            />
          </div>
          <button type="submit" className="delivery__submit">
            Place order
          </button>
        </form>
      )}
    </div>
  )
}
