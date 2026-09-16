import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function ClubCard({ club }) {
  const { favoriteClubs, toggleFavoriteClub } = useApp();
  const isFav = favoriteClubs.includes(club.id);

  return (
    <div className="card">
      <img src={club.image} alt={club.name} className="card-img" />
      <div className="card-body">
        <span className="badge">{club.category}</span>
        <h3>{club.name}</h3>
        <p>{club.description.slice(0, 100)}...</p>
        <p className="card-meta">👥 {club.members} members</p>
        <div className="card-actions">
          <Link to={`/clubs/${club.id}`} className="btn btn-primary">
            View Club
          </Link>
          <button
            className={`btn ${isFav ? "btn-danger" : "btn-outline"}`}
            onClick={() => toggleFavoriteClub(club.id)}
          >
            {isFav ? "❤️ Saved" : "🤍 Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
