import Link from 'next/link'
import './globals.css'
import { CartProvider } from './menu/CartContext'
import CartBadge from './menu/CartBadge'

export const metadata = {
  title: 'Addis Eats',
  description: 'Home-style Ethiopian cooking · Bole, Addis Ababa',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <div className="app">
            <header className="header">
              <p className="header__eyebrow">Bole · Addis Ababa</p>
              <h1 className="header__title">Addis Eats</h1>
              <p className="header__tagline">Home-style Ethiopian cooking</p>
            </header>

            <nav className="nav">
              <Link href="/" className="nav__link">Home</Link>
              <Link href="/menu" className="nav__link">Menu</Link>
              <Link href="/cart" className="nav__link">
                Cart <CartBadge />
              </Link>
              <Link href="/checkout" className="nav__link">Checkout</Link>
            </nav>

            <main>{children}</main>

            <footer className="footer">
              © {new Date().getFullYear()} Addis Eats · Bole, Addis Ababa
            </footer>
          </div>
        </CartProvider>
      </body>
    </html>
  )
}
