import React, { useState } from "react";

export default function About() {
  const [hoverIndex, setHoverIndex] = useState(null);
  const [mousePos, setMousePos] = useState({});

  const handleMouseMove = (e, index) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos((prev) => ({ ...prev, [index]: { x, y } }));
    setHoverIndex(index);
  };

  const cards = [
    { title: " Mission", desc: "Simplify event discovery for students." },
    { title: " Vision", desc: "Create India's largest student platform." },
    { title: " Features", desc: "Events, dashboard, analytics, notifications." }
  ];

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>
        About <span style={styles.highlight}>CampusEventHub</span>
      </h1>

      <p style={styles.desc}>
        CampusEventHub is a platform designed to connect students across colleges
        and provide a centralized hub for all events.
      </p>

      {/* Cards */}
      <div style={styles.grid}>
        {cards.map((card, i) => {
          const glow = mousePos[i];

          return (
            <div
              key={i}
              onMouseMove={(e) => handleMouseMove(e, i)}
              onMouseLeave={() => setHoverIndex(null)}
              style={{
                ...styles.card,
                transform: hoverIndex === i ? "scale(1.05)" : "scale(1)",
                boxShadow:
                  hoverIndex === i
                    ? "0 15px 40px rgba(168,85,247,0.4)"
                    : "none",
                background:
                  hoverIndex === i && glow
                    ? `radial-gradient(circle 150px at ${glow.x}px ${glow.y}px, rgba(168,85,247,0.3), rgba(255,255,255,0.05))`
                    : "rgba(255,255,255,0.05)"
              }}
            >
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Features */}
      <div style={styles.section}>
        <h2>Platform Features</h2>
        <p>✔ Event creation and management</p>
        <p>✔ Real-time notifications</p>
        <p>✔ Student registrations</p>
        <p>✔ Analytics dashboard</p>
      </div>

      {/* Stats */}
      <div style={styles.stats}>
        <div><h2>50K+</h2><p>Students</p></div>
        <div><h2>120+</h2><p>Colleges</p></div>
        <div><h2>300+</h2><p>Events</p></div>
      </div>

      {/* Why Choose */}
      <div style={styles.section}>
        <h2>Why Choose Us?</h2>
        <p>✔ Easy to use platform</p>
        <p>✔ Centralized event system</p>
        <p>✔ Real-time updates</p>
        <p>✔ Networking opportunities</p>
      </div>

      {/* Roadmap */}
      <div style={styles.section}>
        <h2>Future Roadmap</h2>
        <p>AI recommendations, leaderboards, and networking tools.</p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0f0f1a",
    color: "white",
    padding: "80px 20px",
    textAlign: "center"
  },
  title: { fontSize: "2.5rem" },
  highlight: { color: "#a855f7" },
  desc: { color: "#aaa", marginBottom: "40px" },
  grid: { display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" },
  card: {
    width: "250px",
    padding: "25px",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.1)",
    transition: "all 0.3s ease",
    cursor: "pointer"
  },
  section: { marginTop: "50px", color: "#ccc" },
  stats: { display: "flex", justifyContent: "center", gap: "40px", marginTop: "50px" }
};