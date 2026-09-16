import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <span>🎓 CampusConnect</span>
          <p>Your student community portal</p>
        </div>
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/clubs">Clubs</Link>
          <Link to="/events">Events</Link>
          <Link to="/resources">Resources</Link>
          <Link to="/about">About</Link>
        </div>
      </div>
      <p className="footer-copy">© 2025 CampusConnect. Built with React.</p>
    </footer>
  );
}
