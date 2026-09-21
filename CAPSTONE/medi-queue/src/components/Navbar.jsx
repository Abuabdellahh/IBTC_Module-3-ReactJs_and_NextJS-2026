import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-primary' : 'text-gray-600 hover:text-primary'
    }`

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🏥</span>
          <span className="font-bold text-xl text-primary">MediQueue</span>
        </Link>

        <nav className="flex items-center gap-6">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/doctors" className={linkClass}>
            Doctors
          </NavLink>
          <NavLink to="/appointments" className={linkClass}>
            My Appointments
          </NavLink>
          <NavLink
            to="/login"
            className="bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Login
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
