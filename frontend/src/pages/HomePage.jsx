/**
 * FILE: HomePage.jsx
 * PURPOSE: Public landing page that highlights platform value and featured courses.
 *
 * FLOW:
 * 1) Fetch public course list from the backend.
 * 2) Render introductory content and quick navigation actions.
 * 3) Show featured courses with conditional links based on auth state.
 *
 * WHY THIS EXISTS:
 * It helps new visitors discover course offerings before account creation.
 *
 * DEPENDENCIES:
 * - apiRequest to fetch public courses
 * - AuthContext token to adjust CTA behavior
 * - react-router-dom Link/useNavigate for navigation
 */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api/client";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // Home is public; backend allows GET /courses without auth.
    apiRequest("/courses").then(setCourses).catch(() => setCourses([]));
  }, []);

  return (
    <section style={{ display: "grid", gridTemplateColumns: "1.3fr 0.7fr", gap: "22px" }}>
      <article className="card" style={{ padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <span className="badge">Hello!</span>
          <span className="muted small">Welcome to</span>
        </div>
        <h1 style={{ fontSize: 46, lineHeight: 1.1, margin: "6px 0 10px" }}>
          Smart E‑Learning Platform
        </h1>
        <p className="muted" style={{ maxWidth: 680 }}>
          Learn Programming, AI/ML, Web Development and Languages with a structured path.
          Start with a 3-day trial and upgrade to unlock full course modules and projects.
        </p>
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <Link className="btn" to={token ? "/dashboard" : "/register"}>Get Started</Link>
          <Link className="btn ghost" to="/courses">Explore Courses</Link>
        </div>

        <h3 style={{ marginTop: 24 }}>Featured Courses</h3>
        <div className="grid" style={{ marginTop: 8 }}>
          {courses.slice(0, 6).map((course) => (
            <article className="card hover" key={course._id}>
              <h4>{course.title}</h4>
              <p className="muted">{course.description}</p>
              <p className="muted">{course.level} • Rs. {course.price}</p>
              <Link to={token ? `/courses/${course._id}` : "/login"} className="btn-link">
                {token ? "Open" : "Login to start"}
              </Link>
            </article>
          ))}
        </div>
      </article>

      <aside className="card" style={{ padding: 24 }}>
        <h3>Login</h3>
        <p className="muted small">Already a learner? Jump back in.</p>
        <button className="btn" onClick={() => navigate("/login")}>Go to Login</button>
        <div className="divider" />
        <h4>Why choose us?</h4>
        <ul className="list">
          <li>Structured beginner → advanced tracks</li>
          <li>Practical videos organized by module</li>
          <li>Free 3‑day trial on your first course</li>
          <li>Simple enrollment and subscription flow</li>
        </ul>
      </aside>
    </section>
  );
};

export default HomePage;

