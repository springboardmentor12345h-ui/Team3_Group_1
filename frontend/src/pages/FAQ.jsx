import React, { useState } from "react";

export default function FAQ() {
  const [active, setActive] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [mousePos, setMousePos] = useState({});

  const handleMouseMove = (e, index) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos((prev) => ({ ...prev, [index]: { x, y } }));
    setHoverIndex(index);
  };

  const faqs = [
    // General
    { q: "What is CampusEventHub?", a: "A centralized platform for discovering and managing inter-college events." },
    { q: "Is CampusEventHub free?", a: "Yes, the platform is completely free for students." },

    // Registration
    { q: "How can I register for an event?", a: "Login, browse events, and click register." },
    { q: "Can I register for multiple events?", a: "Yes, you can join multiple events." },
    { q: "Can I cancel my registration?", a: "Yes, before the event starts." },

    // Events
    { q: "Who can create events?", a: "Only college admins can create and manage events." },
    { q: "What types of events are available?", a: "Hackathons, sports, cultural fests, workshops." },
    { q: "Do events have limited slots?", a: "Yes, events may have limited seats." },

    // Features
    { q: "Do I get notifications?", a: "Yes, real-time notifications are available." },
    { q: "Can I build teams?", a: "Yes, team formation is supported." },
    { q: "Will I get certificates?", a: "Yes, organizers provide certificates." },

    // Technical
    { q: "Is my data secure?", a: "Yes, we use secure authentication systems." },
    { q: "What if I face issues?", a: "Contact support or report through dashboard." },
    { q: "Is mobile supported?", a: "Yes, the platform is responsive." }
  ];

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Frequently Asked Questions</h1>

      <p style={styles.subtitle}>
        Everything you need to know about CampusEventHub 
      </p>

      <div style={styles.container}>
        {faqs.map((faq, i) => {
          const glow = mousePos[i];

          return (
            <div
              key={i}
              onClick={() => setActive(active === i ? null : i)}
              onMouseMove={(e) => handleMouseMove(e, i)}
              onMouseLeave={() => setHoverIndex(null)}
              style={{
                ...styles.card,
                transform: hoverIndex === i ? "scale(1.03)" : "scale(1)",
                boxShadow:
                  hoverIndex === i
                    ? "0 15px 35px rgba(168,85,247,0.4)"
                    : "none",
                background:
                  hoverIndex === i && glow
                    ? `radial-gradient(circle 120px at ${glow.x}px ${glow.y}px, rgba(168,85,247,0.3), rgba(255,255,255,0.05))`
                    : "rgba(255,255,255,0.05)"
              }}
            >
              <div style={styles.question}>
                {faq.q}
                <span>{active === i ? "−" : "+"}</span>
              </div>

              {active === i && (
                <div style={styles.answer}>{faq.a}</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Extra Section */}
      <div style={styles.extra}>
        <h2>Need Help?</h2>
        <p>Email us at support@campuseventhub.com</p>
        <p>Or reach out via contact section</p>
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
  subtitle: { color: "#aaa", marginBottom: "40px" },
  container: { maxWidth: "700px", margin: "auto" },
  card: {
    padding: "20px",
    marginBottom: "15px",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.1)",
    cursor: "pointer",
    transition: "all 0.3s ease"
  },
  question: { display: "flex", justifyContent: "space-between" },
  answer: { marginTop: "10px", color: "#ccc" },
  extra: { marginTop: "60px", color: "#bbb" }
};