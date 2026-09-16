import { Link } from "react-router-dom";
import dishes from "../data/dishes";
import { useCartStore } from "../store/cartStore";
import { useAuth } from "../context/AuthContext";

function FeaturedDish({ dish }) {
  const addItem = useCartStore((s) => s.addItem);
  const inCart = useCartStore((s) => s.items.some((i) => i.id === dish.id));
  const { user } = useAuth();

  return (
    <div className="card">
      <img src={dish.image} alt={dish.name} className="card-img" />
      <div className="card-body">
        <span className="badge">{dish.category}</span>
        <h3>{dish.name}</h3>
        <p>{dish.description.slice(0, 80)}...</p>
        <p className="card-meta">💰 ${dish.price.toFixed(2)}</p>
        <div className="card-actions">
          <button
            className={`btn ${inCart ? "btn-danger" : "btn-primary"}`}
            onClick={() => user ? addItem(dish) : alert("Please log in to add items.")}
          >
            {inCart ? "✓ Added" : "🛒 Add"}
          </button>
          <Link to="/menu" className="btn btn-outline">Full Menu</Link>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="page">
      <section className="hero-banner">
        <div className="hero-overlay" />
        <div className="hero-content content-visible">
          <h1>Welcome to <span className="highlight">Addis Eats</span></h1>
          <p>Authentic Ethiopian cuisine delivered to your table.</p>
          <div className="hero-actions">
            <Link to="/menu" className="btn btn-primary">Browse Menu</Link>
            <Link to="/cart" className="btn btn-outline-white">View Cart</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Featured Dishes</h2>
          <Link to="/menu" className="see-all">See All →</Link>
        </div>
        <div className="grid">
          {dishes.slice(0, 3).map((dish) => (
            <FeaturedDish key={dish.id} dish={dish} />
          ))}
        </div>
      </section>
    </div>
  );
}
