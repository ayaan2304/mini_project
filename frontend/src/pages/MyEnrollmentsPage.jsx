/**
 * FILE: MyEnrollmentsPage.jsx
 * PURPOSE: Displays all courses the user is currently enrolled in with detailed cards.
 *
 * FLOW:
 * 1) On mount → Fetch user's enrollments from GET /api/enroll/my
 * 2) Display each enrollment as a card with course details
 * 3) Show enrollment status, start date, and links to course materials
 * 4) Handle loading and empty states
 *
 * WHY THIS EXISTS:
 * Users can quickly access all their enrolled courses from one page.
 * Makes it easy to see which courses they have access to and resume learning.
 *
 * DEPENDENCIES:
 * - useAuth from AuthContext for token
 * - apiRequest for fetching enrollments
 * - Link from react-router-dom for navigation
 */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../services/api/client";

const MyEnrollmentsPage = () => {
  const { user, token } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchEnrollments();
  }, [token]);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const data = await apiRequest("/enroll/my", { token });
      console.log("[MyEnrollments] Fetched enrollments:", data);
      
      // Validate data
      if (!Array.isArray(data)) {
        setErrorMessage("Invalid enrollment data received");
        setEnrollments([]);
        return;
      }
      
      setEnrollments(data || []);
    } catch (err) {
      const errorMsg = err?.message || "Failed to load your enrollments";
      setErrorMessage(errorMsg);
      console.error("[MyEnrollments] Error fetching enrollments:", err);
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="my-enrollments-container">
        <div className="loading">📚 Loading your enrollments...</div>
      </div>
    );
  }

  return (
    <div className="my-enrollments-container">
      <div className="enrollments-header">
        <h1>📚 My Enrollments</h1>
        <p className="enrollments-subtitle">All courses you are currently enrolled in</p>
      </div>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {enrollments.length === 0 ? (
        <div className="empty-state">
          <p>You haven't enrolled in any courses yet.</p>
          <Link to="/courses" className="btn primary">
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="enrollments-grid">
          {enrollments.map((enrollment) => {
            if (!enrollment || !enrollment.courseId) {
              console.warn("[MyEnrollments] Invalid enrollment:", enrollment);
              return null;
            }
            
            return (
              <div key={enrollment._id} className="enrollment-card hover">
                <div className="enrollment-header">
                  <h3>{enrollment.courseTitle}</h3>
                  <span className={`status-badge status-${enrollment.statusLabel.toLowerCase().replace(/\s+/g, "-")}`}>
                    {enrollment.statusLabel}
                  </span>
                </div>

                <div className="enrollment-details">
                  <p>
                    <strong>Level:</strong> {enrollment.courseLevel || "beginner"}
                  </p>
                  <p>
                    <strong>Enrolled:</strong> {new Date(enrollment.startDate).toLocaleDateString()}
                  </p>
                  {enrollment.trialActive && (
                    <p className="trial-info">🔥 Trial Access - Modules 1-2 Unlocked</p>
                  )}
                  {enrollment.paidActive && (
                    <p className="paid-info">✅ Full Access - All Modules Unlocked</p>
                  )}
                </div>

                <Link to={`/courses/${enrollment.courseId}`} className="btn secondary full-width">
                  Continue Learning
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyEnrollmentsPage;
