'use client'

import { useState } from 'react'

export default function FormEventDemo() {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    setMessage(`Welcome, ${name}!`)
  }

  return (
    <div className="card delivery">
      <h2 className="delivery__title">Form Event Demo</h2>
      <p className="delivery__hint">
        Type a name and press Enter or click Submit — no page reload occurs.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="field__label" htmlFor="demo-name">Your name</label>
          <input
            id="demo-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            placeholder="e.g. Abebe"
          />
        </div>

        <button type="submit" className="delivery__submit">
          Submit
        </button>
      </form>

      {message && (
        <p style={{ marginTop: '1rem', color: 'var(--accent)' }} aria-live="polite">
          {message}
        </p>
      )}
    </div>
  )
}
