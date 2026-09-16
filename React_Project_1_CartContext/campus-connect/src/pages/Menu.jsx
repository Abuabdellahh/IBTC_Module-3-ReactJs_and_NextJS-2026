import dishes from "../data/dishes";
import { useCartStore } from "../store/cartStore";
import { useAuth } from "../context/AuthContext";

function DishCard({ dish }) {
  // narrow selectors — each component only subscribes to what it needs
  const addItem = useCartStore((s) => s.addItem);
  const inCart = useCartStore((s) => s.items.some((i) => i.id === dish.id));
  const { user } = useAuth();

  return (
    <div className="card">
      <img src={dish.image} alt={dish.name} className="card-img" />
      <div className="card-body">
        <span className="badge">{dish.category}</span>
        <h3>{dish.name}</h3>
        <p>{dish.description}</p>
        <p className="card-meta">💰 ${dish.price.toFixed(2)}</p>
        <div className="card-actions">
          <button
            className={`btn ${inCart ? "btn-danger" : "btn-primary"}`}
            onClick={() => user ? addItem(dish) : alert("Please log in to add items.")}
          >
            {inCart ? "✓ Added" : "🛒 Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Menu() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>🍽️ Our Menu</h1>
        <p>Authentic Ethiopian dishes, made fresh daily</p>
      </div>
      <div className="grid">
        {dishes.map((dish) => (
          <DishCard key={dish.id} dish={dish} />
        ))}
      </div>
    </div>
  );
}
