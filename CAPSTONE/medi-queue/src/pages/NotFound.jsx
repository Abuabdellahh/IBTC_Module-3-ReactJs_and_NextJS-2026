import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <p className="text-7xl mb-4">🏥</p>
      <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
      <p className="text-gray-500 mb-6">Oops! This page doesn&apos;t exist.</p>
      <Link
        to="/"
        className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors"
      >
        Go Home
      </Link>
    </div>
  )
}
