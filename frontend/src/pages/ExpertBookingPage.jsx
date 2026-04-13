/**
 * FILE: ExpertBookingPage.jsx
 * PURPOSE: Displays expert talk booking form and about section explaining the feature benefits.
 *
 * FLOW:
 * 1) User fills booking form with auto-filled email/name if logged in
 * 2) Form collects: name, email, topic, description, preferred date, preferred time
 * 3) On submit → POST to /api/expert-booking
 * 4) Shows success message and clears form
 * 5) Page also displays "About" section explaining feature benefits
 *
 * WHY THIS EXISTS:
 * Allows users to book one-on-one sessions with experts for personalized guidance on topics they struggle with.
 *
 * BENEFITS LISTED:
 * - Better clarification of doubts
 * - Personalized guidance
 * - Faster learning
 * - Helps achieve learning goals
 * - One-on-one expert interaction
 *
 * DEPENDENCIES:
 * - useAuth from AuthContext for user email/name
 * - API client for making POST request
 */
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const ExpertBookingPage = () => {
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "",
    description: "",
    date: "",
    time: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Auto-fill name and email if user is logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/expert-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create booking");
      }

      const data = await response.json();
      setSuccessMessage("✓ Booking request submitted! Expert will confirm soon.");
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        topic: "",
        description: "",
        date: "",
        time: "",
      });

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      setErrorMessage(err.message || "Failed to create booking. Please try again.");
      console.error("Booking error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="expert-booking-container">
      <div className="booking-content">
        {/* BOOKING FORM SECTION */}
        <div className="booking-form-section">
          <h1>Talk to Expert</h1>
          <p className="form-subtitle">Book a personalized session with an expert to resolve your doubts</p>

          <form onSubmit={handleSubmit} className="booking-form">
            <div className="form-group">
              <label htmlFor="name">Your Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="topic">Topic / Subject *</label>
              <input
                type="text"
                id="topic"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                placeholder="e.g., JavaScript Promises, React Hooks"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Describe Your Problem *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Explain what you're struggling with..."
                rows="4"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date">Preferred Date *</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="time">Preferred Time *</label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}

            <button type="submit" className="btn primary" disabled={submitting}>
              {submitting ? "Submitting..." : "Book Expert Session"}
            </button>
          </form>
        </div>

        {/* ABOUT SECTION */}
        <aside className="about-section">
          <div className="about-card">
            <h2>Why Book an Expert Session?</h2>

            <div className="benefits-list">
              <div className="benefit-item">
                <div className="benefit-icon">💬</div>
                <h3>Better Clarification of Doubts</h3>
                <p>Get answers to your specific questions directly from experienced experts.</p>
              </div>

              <div className="benefit-item">
                <div className="benefit-icon">👤</div>
                <h3>Personalized Guidance</h3>
                <p>Receive tailored advice based on your learning pace and challenges.</p>
              </div>

              <div className="benefit-item">
                <div className="benefit-icon">⚡</div>
                <h3>Faster Learning</h3>
                <p>Clear bottlenecks quickly with one-on-one interaction and expert insights.</p>
              </div>

              <div className="benefit-item">
                <div className="benefit-icon">🎯</div>
                <h3>Achieve Learning Goals</h3>
                <p>Stay motivated and on track with expert mentorship and feedback.</p>
              </div>

              <div className="benefit-item">
                <div className="benefit-icon">🤝</div>
                <h3>One-on-One Expert Interaction</h3>
                <p>Direct communication with professionals who have real-world experience.</p>
              </div>
            </div>

            <div className="about-footer">
              <p>
                Our expert community is dedicated to helping you succeed. Book a session today and take your learning to the
                next level!
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ExpertBookingPage;
