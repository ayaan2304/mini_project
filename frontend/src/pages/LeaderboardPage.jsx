/**
 * FILE: LeaderboardPage.jsx
 * PURPOSE: Displays ranked leaderboard showing top quiz performers.
 *
 * FLOW:
 * 1) On mount → Fetch leaderboard data from GET /api/leaderboard
 * 2) Display users ranked by highest quiz score
 * 3) Show columns: Rank, Name, Score, Quizzes Taken
 * 4) Handle loading and error states
 *
 * WHY THIS EXISTS:
 * Provides gamification and motivation for users to perform better in quizzes.
 * Shows top performers and current user's position on the leaderboard.
 *
 * DEPENDENCIES:
 * - fetch API for GET request to leaderboard endpoint
 */
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const LeaderboardPage = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await fetch("http://localhost:5000/api/leaderboard");

      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard");
      }

      const data = await response.json();
      setLeaderboard(data.leaderboard || []);
    } catch (err) {
      setErrorMessage(err.message || "Failed to load leaderboard");
      console.error("Leaderboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="leaderboard-container">
        <div className="loading">Loading leaderboard...</div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="leaderboard-container">
        <div className="error-message">{errorMessage}</div>
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div className="leaderboard-container">
        <h1>Leaderboard</h1>
        <p className="no-data">No leaderboard data available yet. Start taking quizzes!</p>
      </div>
    );
  }

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h1>🏆 Quiz Leaderboard</h1>
        <p className="leaderboard-subtitle">Top Quiz Performers</p>
      </div>

      <div className="leaderboard-table-wrapper">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th className="rank-col">Rank</th>
              <th className="name-col">Name</th>
              <th className="score-col">Highest Score</th>
              <th className="quizzes-col">Quizzes Taken</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry) => {
              const isCurrentUser = user && entry.userId === user.id;
              return (
                <tr key={entry.userId} className={isCurrentUser ? "current-user" : ""}>
                  <td className="rank-col">
                    {entry.rank === 1 && "🥇"}
                    {entry.rank === 2 && "🥈"}
                    {entry.rank === 3 && "🥉"}
                    {entry.rank > 3 && `#${entry.rank}`}
                  </td>
                  <td className="name-col">
                    <strong>{entry.name}</strong>
                    {isCurrentUser && <span className="you-badge"> (You)</span>}
                  </td>
                  <td className="score-col">
                    <span className="score-badge">{entry.score}/100</span>
                  </td>
                  <td className="quizzes-col">{entry.totalQuizzesTaken}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="leaderboard-footer">
        <p>Keep learning and climb the leaderboard! 📚</p>
      </div>
    </div>
  );
};

export default LeaderboardPage;
