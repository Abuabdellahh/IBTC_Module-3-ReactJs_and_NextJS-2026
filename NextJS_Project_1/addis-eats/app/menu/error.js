'use client'

export default function MenuError({ error, reset }) {
  return (
    <div className="error-box">
      <h2 className="error-box__title">Something went wrong</h2>
      <p className="error-box__message">{error.message}</p>
      <button className="error-box__retry" onClick={reset}>
        Try again
      </button>
    </div>
  )
}
