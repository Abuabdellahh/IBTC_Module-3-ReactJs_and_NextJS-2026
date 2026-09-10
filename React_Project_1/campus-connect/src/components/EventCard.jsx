import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function EventCard({ event }) {
  const { favoriteEvents, toggleFavoriteEvent } = useApp();
  const isFav = favoriteEvents.includes(event.id);

  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="card">
      <img src={event.image} alt={event.name} className="card-img" />
      <div className="card-body">
        <span className="badge">{event.category}</span>
        <h3>{event.name}</h3>
        <p className="card-meta">📅 {formattedDate} · ⏰ {event.time}</p>
        <p className="card-meta">📍 {event.location}</p>
        <p>{event.description.slice(0, 90)}...</p>
        <div className="card-actions">
          <Link to={`/events/${event.id}`} className="btn btn-primary">
            View Event
          </Link>
          <button
            className={`btn ${isFav ? "btn-danger" : "btn-outline"}`}
            onClick={() => toggleFavoriteEvent(event.id)}
          >
            {isFav ? "❤️ Saved" : "🤍 Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
