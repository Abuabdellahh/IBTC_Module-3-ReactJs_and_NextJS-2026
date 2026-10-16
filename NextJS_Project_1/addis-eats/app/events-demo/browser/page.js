'use client'

import { useEffect, useState } from 'react'

export default function BrowserDemoPage() {
  const [width, setWidth] = useState(null)

  useEffect(() => {
    function updateWidth() {
      setWidth(window.innerWidth)
    }

    updateWidth()
    window.addEventListener('resize', updateWidth)

    return () => {
      window.removeEventListener('resize', updateWidth)
    }
  }, [])

  return (
    <div style={{ padding: '1rem 0' }}>
      <h2 style={{ marginBottom: '1rem' }}>Browser Width</h2>
      <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
        <code>window</code> is only available on the client. The{' '}
        <code>useEffect</code> runs after mount and cleans up the listener on
        unmount.
      </p>

      <p style={{ fontSize: '1.5rem', color: 'var(--accent)' }}>
        {width === null ? 'Reading screen width…' : `Window width: ${width}px`}
      </p>
    </div>
  )
}
