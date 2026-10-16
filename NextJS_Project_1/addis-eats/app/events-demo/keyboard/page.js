'use client'

import { useState } from 'react'

export default function KeyboardDemo() {
  const [message, setMessage] = useState('Press a key.')

  function handleKeyDown(event) {
    if (event.key === 'Escape') setMessage('Escape was pressed.')
    else if (event.key === 'Enter') setMessage('Enter was pressed.')
    else if (event.key === 'ArrowDown') setMessage('Down arrow was pressed.')
    else setMessage(`"${event.key}" was pressed.`)
  }

  return (
    <div style={{ padding: '1rem 0' }}>
      <h2 style={{ marginBottom: '1rem' }}>Keyboard Event Demo</h2>
      <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
        Focus the field and press Enter, Escape, or the Down arrow.
      </p>

      <div className="field" style={{ maxWidth: '24rem' }}>
        <label className="field__label" htmlFor="keyboard-input">
          Focus this field and press a key
        </label>
        <input
          id="keyboard-input"
          onKeyDown={handleKeyDown}
          placeholder="Type anything…"
        />
      </div>

      <p style={{ marginTop: '1rem', color: 'var(--accent)' }} aria-live="polite">
        {message}
      </p>
    </div>
  )
}
