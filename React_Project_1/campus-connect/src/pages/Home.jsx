import { Link } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import clubsData from "../data/clubs";
import eventsData from "../data/events";
import ClubCard from "../components/ClubCard";
import EventCard from "../components/EventCard";
import Loader from "../components/Loader";

const SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1400&q=80",
    title: "Welcome to CampusConnect",
    subtitle: "Your one-stop portal for campus clubs, events, and student resources.",
    cta: { label: "Explore Clubs", to: "/clubs" },
  },
  {
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&q=80",
    title: "Discover Exciting Events",
    subtitle: "Hackathons, exhibitions, career fairs and more — happening right on campus.",
    cta: { label: "View Events", to: "/events" },
  },
  {
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1400&q=80",
    title: "Find Your Community",
    subtitle: "Join clubs that match your passion — from AI to arts, chess to entrepreneurship.",
    cta: { label: "Browse Clubs", to: "/clubs" },
  },
  {
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1400&q=80",
    title: "Access Student Resources",
    subtitle: "Library, academic support, career services and wellness — all in one place.",
    cta: { label: "View Resources", to: "/resources" },
  },
];

const INTERVAL = 5000;

export default function Home() {
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Slider state
  const [current, setCurrent] = useState(0);
  const [zoomed, setZoomed] = useState(true);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((index) => {
    setZoomed(false);
    setTimeout(() => {
      setCurrent(index);
      setZoomed(true);
    }, 400);
  }, []);

  const next = useCallback(() => goTo((current + 1) % SLIDES.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + SLIDES.length) % SLIDES.length), [current, goTo]);

  // Auto-advance
  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, INTERVAL);
    return () => clearInterval(id);
  }, [paused, next]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setClubs(clubsData.slice(0, 3));
      setEvents(eventsData.slice(0, 3));
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const slide = SLIDES[current];

  return (
    <div className="page">
      {/* Hero Slider */}
      <section
        className="hero-slider"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Background image with zoom */}
        <div
          className={`hero-bg ${zoomed ? "zoom-in" : "zoom-out"}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        />
        {/* Dark overlay */}
        <div className="hero-overlay" />

        {/* Content */}
        <div className={`hero-content ${zoomed ? "content-visible" : "content-hidden"}`}>
          <h1>{slide.title.includes("CampusConnect")
            ? <>{slide.title.split("CampusConnect")[0]}<span className="highlight">CampusConnect</span>{slide.title.split("CampusConnect")[1]}</>
            : slide.title}
          </h1>
          <p>{slide.subtitle}</p>
          <div className="hero-actions">
            <Link to={slide.cta.to} className="btn btn-primary">{slide.cta.label}</Link>
            <Link to="/events" className="btn btn-outline-white">View Events</Link>
          </div>
        </div>

        {/* Prev / Next arrows */}
        <button className="slider-arrow slider-prev" onClick={prev} aria-label="Previous slide">&#8249;</button>
        <button className="slider-arrow slider-next" onClick={next} aria-label="Next slide">&#8250;</button>

        {/* Dot indicators */}
        <div className="slider-dots">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              className={`slider-dot ${i === current ? "active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div className="slider-progress">
          <div
            className="slider-progress-fill"
            style={{ animationDuration: `${INTERVAL}ms`, animationPlayState: paused ? "paused" : "running" }}
            key={`${current}-${paused}`}
          />
        </div>
      </section>

      {/* Quick Links */}
      <section className="section">
        <h2 className="section-title">Quick Links</h2>
        <div className="quick-links">
          {[
            { to: "/clubs", icon: "🏛️", label: "Clubs" },
            { to: "/events", icon: "📅", label: "Events" },
            { to: "/resources", icon: "📚", label: "Resources" },
            { to: "/about", icon: "ℹ️", label: "About" },
          ].map(({ to, icon, label }) => (
            <Link key={to} to={to} className="quick-link-card">
              <span className="quick-icon">{icon}</span>
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Events */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Featured Events</h2>
          <Link to="/events" className="see-all">See All →</Link>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div className="grid">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* Popular Clubs */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Popular Clubs</h2>
          <Link to="/clubs" className="see-all">See All →</Link>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div className="grid">
            {clubs.map((club) => (
              <ClubCard key={club.id} club={club} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
