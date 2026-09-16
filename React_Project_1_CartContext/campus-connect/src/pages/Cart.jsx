import { useCartStore } from "../store/cartStore";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Cart() {
  // narrow selectors — one value at a time
  const items = useCartStore((s) => s.items);
  const remove = useCartStore((s) => s.remove);
  const clear = useCartStore((s) => s.clear);
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="page empty-state">
        <p>Please log in to view your cart.</p>
        <Link to="/menu" className="btn btn-primary">Back to Menu</Link>
      </div>
    );
  }

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  if (items.length === 0) {
    return (
      <div className="page empty-state">
        <p>Your cart is empty.</p>
        <Link to="/menu" className="btn btn-primary">Browse Menu</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>🛒 Your Cart</h1>
        <p>{items.length} item{items.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="cart-list">
        {items.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.name} className="cart-item-img" />
            <div className="cart-item-info">
              <h3>{item.name}</h3>
              <p className="card-meta">
                ${item.price.toFixed(2)} × {item.qty} ={" "}
                <strong>${(item.price * item.qty).toFixed(2)}</strong>
              </p>
            </div>
            <button className="btn btn-danger" onClick={() => remove(item.id)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="cart-footer">
        <p className="cart-total">Total: <strong>${total.toFixed(2)}</strong></p>
        <div className="card-actions">
          <button className="btn btn-outline" onClick={clear}>Clear Cart</button>
          <button className="btn btn-primary">Place Order</button>
        </div>
      </div>
    </div>
  );
}
