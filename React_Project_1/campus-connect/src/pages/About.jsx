import { useState } from "react";

export default function About() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: "", email: "", message: "" });
  };

  const stats = [
    { label: "Active Clubs", value: "50+" },
    { label: "Events Per Year", value: "200+" },
    { label: "Students", value: "12,000+" },
    { label: "Resources", value: "30+" },
  ];

  const team = [
    { name: "Sarah Johnson", role: "Student President", emoji: "👩‍💼" },
    { name: "Marcus Lee", role: "Events Coordinator", emoji: "👨‍💻" },
    { name: "Aisha Patel", role: "Club Director", emoji: "👩‍🎓" },
    { name: "Carlos Rivera", role: "Tech Lead", emoji: "👨‍🔧" },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>About CampusConnect</h1>
        <p>Connecting students with opportunities, communities, and resources.</p>
      </div>

      <section className="about-mission">
        <h2>Our Mission</h2>
        <p>
          CampusConnect is the central hub for student life. We believe every student deserves
          to find their community, discover exciting events, and access the resources they need
          to thrive academically and personally.
        </p>
      </section>

      <section className="stats-grid">
        {stats.map(({ label, value }) => (
          <div key={label} className="stat-card">
            <span className="stat-value">{value}</span>
            <span className="stat-label">{label}</span>
          </div>
        ))}
      </section>

      <section className="section">
        <h2 className="section-title">Meet the Team</h2>
        <div className="team-grid">
          {team.map(({ name, role, emoji }) => (
            <div key={name} className="team-card">
              <span className="team-emoji">{emoji}</span>
              <h3>{name}</h3>
              <p>{role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Contact Us</h2>
        {submitted ? (
          <div className="success-box">
            ✅ Thank you! Your message has been sent. We'll get back to you soon.
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows={5}
              value={form.message}
              onChange={handleChange}
              required
            />
            <button type="submit" className="btn btn-primary">Send Message</button>
          </form>
        )}
      </section>
    </div>
  );
}
