'use client'

import { useState } from 'react'

/** Simulates a 1.5 s async order submission so the pending state is visible. */
function saveDemoOrder(phone) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ phone, status: 'received' }), 1500)
  })
}

export default function OrderForm({ onSuccess }) {
  const [phone, setPhone] = useState('')
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    // Guard: ignore any re-submission while a request is already in flight.
    if (pending) return

    setPending(true)
    setMessage('')

    try {
      const result = await saveDemoOrder(phone)
      setMessage(`Demo order received for ${result.phone}.`)
      onSuccess?.()
    } catch {
      setMessage('Unable to place the order. Try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '28rem' }}>
      <div className="field">
        <label className="field__label" htmlFor="phone">
          TeleBirr phone number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          required
          disabled={pending}
          placeholder="e.g. 0911 234 567"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="delivery__submit"
        style={pending ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
      >
        {pending ? 'Placing order…' : 'Place order'}
      </button>

      {message && (
        <p
          role="status"
          aria-live="polite"
          style={{ marginTop: '1rem', color: 'var(--accent)' }}
        >
          {message}
        </p>
      )}
    </form>
  )
}
