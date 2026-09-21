import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const linkClass = ({ isActive }) =>
    `relative text-sm font-medium transition-colors duration-200 pb-0.5 ${
      isActive
        ? 'text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:rounded-full'
        : 'text-gray-600 hover:text-primary'
    }`

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass shadow-md'
          : 'bg-white/80 backdrop-blur-sm border-b border-gray-100'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-shadow duration-300">
            <span className="text-white text-sm">✚</span>
          </div>
          <span className="font-bold text-xl text-gradient">MediQueue</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/doctors" className={linkClass}>Doctors</NavLink>
          <NavLink to="/appointments" className={linkClass}>My Appointments</NavLink>
          <NavLink
            to="/login"
            className="bg-gradient-to-r from-sky-500 to-cyan-400 text-white text-sm font-semibold px-5 py-2 rounded-xl shadow-glow hover:shadow-glow-lg hover:scale-105 transition-all duration-200"
          >
            Login
          </NavLink>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-64' : 'max-h-0'}`}>
        <nav className="flex flex-col gap-1 px-4 pb-4 bg-white/95 backdrop-blur-sm border-t border-gray-100">
          {[
            { to: '/', label: 'Home', end: true },
            { to: '/doctors', label: 'Doctors' },
            { to: '/appointments', label: 'My Appointments' },
          ].map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary-light text-primary' : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="mt-1 bg-gradient-to-r from-sky-500 to-cyan-400 text-white text-sm font-semibold px-4 py-2.5 rounded-xl text-center"
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  )
}
