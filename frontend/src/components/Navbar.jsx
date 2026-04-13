/**
 * FILE: Navbar.jsx
 * PURPOSE: Renders the shared top navigation for authenticated and guest users.
 *
 * FLOW:
 * 1) Read current auth state from context.
 * 2) Show learner links only when user is logged in.
 * 3) Include new links: Leaderboard, Talk to Expert, My Enrollments
 * 4) Display daily streak count if user is logged in
 * 5) Provide logout action to clear local auth state.
 *
 * WHY THIS EXISTS:
 * It keeps navigation consistent and reduces repeated link markup across pages.
 * Provides quick access to gamification (leaderboard, streak) and expert services.
 *
 * DEPENDENCIES:
 * - useAuth from AuthContext for user/logout
 * - react-router-dom Link for navigation
 */
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link className="brand" to={user ? "/dashboard" : "/"}>
        Smart Learning
      </Link>
      <div className="nav-links">
        {user && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/courses">Courses</Link>
            <Link to="/leaderboard">Leaderboard</Link>
            <Link to="/expert-booking">Talk to Expert</Link>
            <Link to="/my-enrollments">My Enrollments</Link>

            {/* Daily Streak Display */}
            <div className="streak-display">
              <span className="streak-icon">🔥</span>
              <span className="streak-count">{user.streakCount || 0}</span>
            </div>

            <button className="btn ghost" onClick={logout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
