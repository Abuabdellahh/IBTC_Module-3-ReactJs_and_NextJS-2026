import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="not-found">
      <p className="not-found__code">404</p>
      <h2 className="not-found__title">Page not found</h2>
      <p className="not-found__body">
        That dish — or page — doesn&apos;t exist on our menu.
      </p>
      <Link href="/" className="not-found__link">← Back home</Link>
    </div>
  )
}
