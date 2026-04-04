import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../api/client";

const DashboardPage = () => {
  const { user, token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    apiRequest("/courses", { token }).then(setCourses).catch(console.error);
    apiRequest("/demo/my-sessions", { token }).then(setSessions).catch(() => setSessions([]));
  }, [token]);

  return (
    <section>
      <h2>Welcome, {user?.name}</h2>
      <p className="muted">Track progress, quizzes, and subscription access.</p>

      <div className="stats-grid">
        <article className="card"><h4>Courses</h4><p className="stat">{courses.length}</p></article>
        <article className="card"><h4>Booked Sessions</h4><p className="stat">{sessions.length}</p></article>
        <article className="card"><h4>Leaderboard</h4><Link to="/leaderboard">View Rank</Link></article>
      </div>

      <div className="section-head">
        <h3>Featured Courses</h3>
        <Link to="/courses">See all</Link>
      </div>
      <div className="grid">
        {courses.slice(0, 4).map((course) => (
          <Link key={course._id} className="card hover" to={`/courses/${course._id}`}>
            <h4>{course.title}</h4>
            <p>{course.description}</p>
            <p className="muted">{course.level} • Rs. {course.price}</p>
          </Link>
        ))}
      </div>

      <div className="section-head">
        <h3>Talk to Expert</h3>
        <Link to="/demo">Book a session</Link>
      </div>
      <div className="grid">
        {sessions.length === 0 && <p className="muted">No sessions booked yet.</p>}
        {sessions.map((session) => (
          <article className="card" key={session._id}>
            <h4>{session.topic}</h4>
            <p className="muted">{new Date(session.date).toLocaleString()}</p>
            <span className="badge">{session.status}</span>
          </article>
        ))}
      </div>
    </section>
  );
};

export default DashboardPage;
