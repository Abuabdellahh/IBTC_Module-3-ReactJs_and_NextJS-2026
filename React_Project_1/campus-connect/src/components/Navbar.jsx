import { NavLink, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useState } from "react";

export default function Navbar() {
  const { theme, toggleTheme, favoriteClubs, favoriteEvents } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/clubs", label: "Clubs" },
    { to: "/events", label: "Events" },
    { to: "/resources", label: "Resources" },
    { to: "/about", label: "About" },
  ];

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        🎓 CampusConnect
      </Link>

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
          <Link to="/clubs" className="fav-badge" onClick={() => setMenuOpen(false)}>
            ❤️ {favoriteClubs.length + favoriteEvents.length}
          </Link>
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
