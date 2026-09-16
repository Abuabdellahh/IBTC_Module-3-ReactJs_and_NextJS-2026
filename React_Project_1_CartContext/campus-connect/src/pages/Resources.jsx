import { useEffect, useState } from "react";
import resourcesData from "../data/resources";
import Loader from "../components/Loader";

const CATEGORIES = ["All", "Library", "Academic Support", "Career Services", "Student Services"];

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const timer = setTimeout(() => {
      setResources(resourcesData);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const filtered =
    activeCategory === "All"
      ? resources
      : resources.filter((r) => r.category === activeCategory);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Student Resources</h1>
        <p>Everything you need to succeed on campus</p>
      </div>

      <div className="category-filters">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`filter-btn ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="resources-grid">
          {filtered.map((resource) => (
            <div key={resource.id} className="resource-card">
              <div className="resource-icon">{resource.icon}</div>
              <div className="resource-body">
                <span className="badge">{resource.category}</span>
                <h3>{resource.title}</h3>
                <p>{resource.description}</p>
                <ul className="resource-items">
                  {resource.items.map((item) => (
                    <li key={item}>✓ {item}</li>
                  ))}
                </ul>
                <a href={resource.link} target="_blank" rel="noreferrer" className="btn btn-primary">
                  Visit Resource →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
