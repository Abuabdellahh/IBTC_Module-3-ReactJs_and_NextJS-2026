import { NavLink, Link } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useCartStore } from "../store/cartStore";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, login, logout } = useAuth();
  // narrow selector — only re-renders when cart count changes
  const cartCount = useCartStore((s) => s.items.reduce((n, i) => n + i.qty, 0));
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/menu", label: "Menu" },
    { to: "/cart", label: `🛒 Cart${cartCount > 0 ? ` (${cartCount})` : ""}` },
  ];

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">🍛 Addis Eats</Link>

      <button className="menu-toggle" onClick={() => setMenuOpen((o) => !o)}>
        {menuOpen ? "✕" : "☰"}
      </button>

      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        {navLinks.map(({ to, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === "/"}
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </NavLink>
          </li>
        ))}
        <li>
          {user ? (
            <button className="theme-btn" onClick={logout}>
              👤 {user.name} · Logout
            </button>
          ) : (
            <button className="theme-btn" onClick={() => login("Guest")}>
              👤 Login
            </button>
          )}
        </li>
        <li>
          <button className="theme-btn" onClick={toggleTheme}>
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </li>
      </ul>
    </nav>
  );
}
