'use client'

import { useState } from 'react'

export default function PropagationDemo() {
  const [message, setMessage] = useState('Choose an action.')

  function openDish() {
    setMessage('Dish details opened.')
  }

  function addToCart(event) {
    event.stopPropagation()
    setMessage('Dish added to cart.')
  }

  return (
    <div style={{ padding: '1rem 0' }}>
      <h2 style={{ marginBottom: '1rem' }}>Event Propagation</h2>
      <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
        Clicking the card opens dish details. Clicking Add stops propagation —
        only the cart action fires.
      </p>

      {/* Clickable card — for demo only; production prefers a link + button */}
      <div
        onClick={openDish}
        className="card"
        style={{ maxWidth: '22rem', cursor: 'pointer' }}
      >
        <div className="dish__row">
          <h3 className="dish__name">Doro Wat</h3>
          <span className="dish__dots" aria-hidden="true" />
          <span className="dish__price">450 ETB</span>
        </div>
        <p className="dish__description">
          Slow-simmered chicken in berbere sauce with a boiled egg.
        </p>
        <div className="dish__actions">
          <button
            type="button"
            onClick={addToCart}
            className="dish__add"
          >
            Add to cart
          </button>
        </div>
      </div>

      <p style={{ marginTop: '1rem', color: 'var(--accent)' }} aria-live="polite">
        {message}
      </p>
    </div>
  )
}
