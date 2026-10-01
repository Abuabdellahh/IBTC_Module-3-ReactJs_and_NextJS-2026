import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="landing">
      <p className="landing__intro">
        Fresh injera, slow-simmered wats, and the best kitfo in Bole —
        delivered to your door.
      </p>
      <Link href="/menu" className="landing__cta">
        See the menu
      </Link>
    </div>
  )
}
