import { useEffect, useState } from "react";
import clubsData from "../data/clubs";
import ClubCard from "../components/ClubCard";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

const CATEGORIES = ["All", "Technology", "Arts", "Academic", "Social", "Games", "Business"];

export default function Clubs() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      try {
        setClubs(clubsData);
      } catch {
        setError("Failed to load clubs.");
      } finally {
        setLoading(false);
      }
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  const filtered = clubs.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || c.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="page">
      <div className="page-header">
        <h1>Campus Clubs</h1>
        <p>Find your community — {clubs.length} clubs available</p>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="🔍 Search clubs..."
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
          <p className="results-count">{filtered.length} club{filtered.length !== 1 ? "s" : ""} found</p>
          {filtered.length === 0 ? (
            <div className="empty-state">
              <p>No clubs match your search. Try a different keyword or category.</p>
              <button className="btn btn-outline" onClick={() => { setSearch(""); setCategory("All"); }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid">
              {filtered.map((club) => (
                <ClubCard key={club.id} club={club} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
