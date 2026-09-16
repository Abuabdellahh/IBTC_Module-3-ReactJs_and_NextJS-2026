import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import eventsData from "../data/events";
import { useApp } from "../context/AppContext";
import Loader from "../components/Loader";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { favoriteEvents, toggleFavoriteEvent } = useApp();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const found = eventsData.find((e) => e.id === parseInt(id));
      setEvent(found || null);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [id]);

  if (loading) return <Loader />;

  if (!event)
    return (
      <div className="page empty-state">
        <h2>Event not found</h2>
        <button className="btn btn-primary" onClick={() => navigate("/events")}>
          Back to Events
        </button>
      </div>
    );

  const isFav = favoriteEvents.includes(event.id);
  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
  const spotsLeft = event.capacity - event.registered;

  return (
    <div className="page">
      <Link to="/events" className="back-link">← Back to Events</Link>

      <div className="detail-hero">
        <img src={event.image} alt={event.name} className="detail-img" />
        <div className="detail-info">
          <span className="badge">{event.category}</span>
          <h1>{event.name}</h1>
          <p>{event.description}</p>
          <div className="detail-meta">
            <span>📅 {formattedDate}</span>
            <span>⏰ {event.time}</span>
            <span>📍 {event.location}</span>
            <span>🏢 Organized by {event.organizer}</span>
          </div>
          <div className="capacity-bar">
            <div className="capacity-fill" style={{ width: `${(event.registered / event.capacity) * 100}%` }} />
          </div>
          <p className="capacity-text">
            {event.registered}/{event.capacity} registered · <strong>{spotsLeft} spots left</strong>
          </p>
          <button
            className={`btn ${isFav ? "btn-danger" : "btn-primary"}`}
            onClick={() => toggleFavoriteEvent(event.id)}
          >
            {isFav ? "❤️ Remove from Saved" : "🤍 Save Event"}
          </button>
        </div>
      </div>
    </div>
  );
}
