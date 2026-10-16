'use client'

import { useState } from 'react'

export default function CounterPage() {
  const [count, setCount] = useState(0)

  function increaseCount() {
    setCount((previousCount) => previousCount + 1)
  }

  return (
    <div style={{ padding: '1rem 0' }}>
      <h2 style={{ marginBottom: '1rem' }}>Click Counter</h2>
      <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
        The functional updater form <code>setCount(prev =&gt; prev + 1)</code>{' '}
        always reads the latest queued value — safe even when React batches updates.
      </p>

      <p style={{ fontSize: '2rem', fontVariantNumeric: 'tabular-nums', color: 'var(--accent)', marginBottom: '1rem' }}>
        {count}
      </p>

      <button type="button" onClick={increaseCount} className="dish__add">
        Increase
      </button>
    </div>
  )
}
