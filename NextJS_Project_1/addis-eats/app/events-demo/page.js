'use client'

export default function EventsDemoPage() {
  function handleClick(event) {
    console.log('Target:', event.target)
    console.log('Current target:', event.currentTarget)
    console.log('Native event:', event.nativeEvent)
  }

  return (
    <div className="landing" style={{ textAlign: 'left' }}>
      <h2 style={{ marginBottom: '1rem' }}>Event Object Demo</h2>
      <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
        Open the browser console (F12) and click the button below.
        Notice how <code>target</code> may be the inner span while{' '}
        <code>currentTarget</code> is always the button.
      </p>

      <button type="button" onClick={handleClick} className="btn-demo">
        <span>Click this text</span>
      </button>
    </div>
  )
}
