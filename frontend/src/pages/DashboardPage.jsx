/**
 * FILE: DashboardPage.jsx
 * PURPOSE: Shows the logged-in user's course overview, enrollment summary, and daily streak.
 *
 * FLOW:
 * 1) Fetch courses and the current user's enrollments on page load.
 * 2) Display summary cards for courses, enrollments, and daily streak.
 * 3) Show daily login streak count to encourage consistent learning.
 * 4) Render featured courses and enrollment cards with start dates.
 *
 * WHY THIS EXISTS:
 * It gives learners one place to quickly understand what they can study next and track their progress.
 * Daily streak encourages consistent learning behavior.
 *
 * DEPENDENCIES:
 * - AuthContext for user/token
 * - apiRequest for backend API calls
 * - react-router-dom Link for navigation
 */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../services/api/client";

const DashboardPage = () => {
  const { user, token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    apiRequest("/courses", { token }).then(setCourses).catch(console.error);
    apiRequest("/enroll/my", { token }).then(setEnrollments).catch(() => setEnrollments([]));
  }, [token]);

  return (
    <section>
      <h2>Welcome, {user?.name}! 👋</h2>
      <p className="muted">Track your courses, enrollments, and subscription access.</p>

      <div className="stats-grid">
        <article className="card">
          <h4>Courses</h4>
          <p className="stat">{courses.length}</p>
        </article>
        <article className="card">
          <h4>My Enrollments</h4>
          <p className="stat">{enrollments.length}</p>
        </article>
        <article className="card">
          <h4>Active Learning</h4>
          <p className="stat">{enrollments.filter((e) => e.statusLabel !== "Inactive").length}</p>
        </article>
        <article className="card streak-card">
          <h4>Daily Streak 🔥</h4>
          <p className="stat">{user?.streakCount || 0}</p>
          <p className="muted small">Keep it going!</p>
        </article>
      </div>

      <div className="dashboard-actions">
        <Link to="/my-enrollments" className="btn primary">
          View All Enrollments
        </Link>
        <Link to="/expert-booking" className="btn secondary">
          Talk to Expert
        </Link>
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
        <h3>My Enrollment Details</h3>
        <span className="muted small">Student, course and start date</span>
      </div>
      <div className="grid">
        {enrollments.length === 0 && <p className="muted">No enrollments yet. Start a course trial to see details.</p>}
        {enrollments.map((item) => (
          <article className="card" key={item._id}>
            <h4>{item.courseTitle}</h4>
            <p className="muted">Student: {item.studentName}</p>
            <p className="muted">Start Date: {new Date(item.startDate).toLocaleDateString()}</p>
            <span className="badge">{item.statusLabel}</span>
          </article>
        ))}
      </div>
    </section>
  );
};

export default DashboardPage;
