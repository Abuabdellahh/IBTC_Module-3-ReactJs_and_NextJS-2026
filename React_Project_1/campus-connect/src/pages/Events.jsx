import { useEffect, useState } from "react";
import eventsData from "../data/events";
import EventCard from "../components/EventCard";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

const CATEGORIES = ["All", "Technology", "Arts", "Career", "Academic", "Social", "Business"];

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      try {
        setEvents(eventsData);
      } catch {
        setError("Failed to load events.");
      } finally {
        setLoading(false);
      }
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  const filtered = events.filter((e) => {
    const matchSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || e.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="page">
      <div className="page-header">
        <h1>Upcoming Events</h1>
        <p>Stay up to date with what's happening on campus</p>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="🔍 Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <div className="category-filters">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${category === cat ? "active" : ""}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading && <Loader />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && (
        <>
          <p className="results-count">{filtered.length} event{filtered.length !== 1 ? "s" : ""} found</p>
          {filtered.length === 0 ? (
            <div className="empty-state">
              <p>No events match your search.</p>
              <button className="btn btn-outline" onClick={() => { setSearch(""); setCategory("All"); }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid">
              {filtered.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
