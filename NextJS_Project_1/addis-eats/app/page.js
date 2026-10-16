'use client'

import Link from 'next/link'

export default function HomePage() {
  function handleWelcome() {
    alert('Welcome to Addis Eats!')
  }

  return (
    <div className="landing">
      <p className="landing__intro">
        Fresh injera, slow-simmered wats, and the best kitfo in Bole —
        delivered to your door.
      </p>

      <button type="button" onClick={handleWelcome} className="btn-demo">
        Welcome
      </button>

      <br />
      <br />

      <Link href="/menu" className="landing__cta">
        See the menu
      </Link>
    </div>
  )
}
