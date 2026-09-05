import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="landing">
      <p className="landing__intro">404 — page not found.</p>
      <Link to="/" className="landing__cta">Go home</Link>
    </div>
  )
}
