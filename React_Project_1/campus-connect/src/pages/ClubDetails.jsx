import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import clubsData from "../data/clubs";
import { useApp } from "../context/AppContext";
import Loader from "../components/Loader";

export default function ClubDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { favoriteClubs, toggleFavoriteClub } = useApp();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const found = clubsData.find((c) => c.id === parseInt(id));
      setClub(found || null);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [id]);

  if (loading) return <Loader />;

  if (!club)
    return (
      <div className="page empty-state">
        <h2>Club not found</h2>
        <button className="btn btn-primary" onClick={() => navigate("/clubs")}>
          Back to Clubs
        </button>
      </div>
    );

  const isFav = favoriteClubs.includes(club.id);

  return (
    <div className="page">
      <Link to="/clubs" className="back-link">← Back to Clubs</Link>

      <div className="detail-hero">
        <img src={club.image} alt={club.name} className="detail-img" />
        <div className="detail-info">
          <span className="badge">{club.category}</span>
          <h1>{club.name}</h1>
          <p>{club.description}</p>
          <div className="detail-meta">
            <span>👥 {club.members} members</span>
            <span>📅 Founded {club.founded}</span>
          </div>
          <button
            className={`btn ${isFav ? "btn-danger" : "btn-primary"}`}
            onClick={() => toggleFavoriteClub(club.id)}
          >
            {isFav ? "❤️ Remove from Favorites" : "🤍 Add to Favorites"}
          </button>
        </div>
      </div>

      <div className="detail-sections">
        <div className="detail-section">
          <h2>📍 Meeting Information</h2>
          <ul>
            <li><strong>Day:</strong> {club.meetingDay}</li>
            <li><strong>Time:</strong> {club.meetingTime}</li>
            <li><strong>Location:</strong> {club.meetingLocation}</li>
          </ul>
        </div>

        <div className="detail-section">
          <h2>🎯 Interests & Topics</h2>
          <div className="tags">
            {club.interests.map((interest) => (
              <span key={interest} className="tag">{interest}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
