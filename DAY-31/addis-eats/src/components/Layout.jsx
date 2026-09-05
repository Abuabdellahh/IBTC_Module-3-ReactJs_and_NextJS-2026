import { NavLink, Outlet } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Layout() {
  const { cart } = useCart()
  const { user, signOut } = useAuth()

  return (
    <div className="app">
      <header className="header">
        <p className="header__eyebrow">Bole · Addis Ababa</p>
        <h1 className="header__title">Addis Eats</h1>
        <p className="header__tagline">Home-style Ethiopian cooking</p>
      </header>

      <nav className="nav">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'nav__link nav__link--active' : 'nav__link'}>
          Home
        </NavLink>
        <NavLink to="/menu" className={({ isActive }) => isActive ? 'nav__link nav__link--active' : 'nav__link'}>
          Menu
        </NavLink>
        <NavLink to="/checkout" className={({ isActive }) => isActive ? 'nav__link nav__link--active' : 'nav__link'}>
          Checkout {cart.items > 0 && <span className="nav__badge">{cart.items}</span>}
        </NavLink>
        {user ? (
          <button type="button" className="nav__link nav__signout" onClick={signOut}>
            Sign out ({user.name})
          </button>
        ) : (
          <NavLink to="/signin" className={({ isActive }) => isActive ? 'nav__link nav__link--active' : 'nav__link'}>
            Sign in
          </NavLink>
        )}
      </nav>

      <main>
        <Outlet />
      </main>

      <footer className="footer">Prices include VAT · Day 31</footer>
    </div>
  )
}
