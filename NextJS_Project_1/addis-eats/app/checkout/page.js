'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '../menu/CartContext'
import OrderForm from '../../components/OrderForm'

export default function CheckoutPage() {
  const { cart, clearCart } = useCart()
  const [confirmed, setConfirmed] = useState(false)

  if (confirmed) {
    return (
      <div className="card receipt">
        <h2 className="receipt__title">Order confirmed 🎉</h2>
        <p className="receipt__body">
          Your order of{' '}
          <strong>
            {cart.items} {cart.items === 1 ? 'dish' : 'dishes'}
          </strong>{' '}
          is on its way.
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
        <OrderForm
          onSuccess={() => {
            clearCart()
            setConfirmed(true)
          }}
        />
      )}
    </div>
  )
}
