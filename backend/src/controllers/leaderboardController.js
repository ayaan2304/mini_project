/**
 * FILE: leaderboardController.js
 * PURPOSE: Handles fetching and ranking users based on quiz scores.
 *
 * FLOW:
 * 1) GET /api/leaderboard → Fetch all users ranked by highest quiz score
 * 2) Aggregates quiz results to get highest score per user
 * 3) Sorts by score descending and adds rank
 * 4) Returns top performers with their scores and rankings
 *
 * WHY THIS EXISTS:
 * Provides gamification through leaderboard, motivating users to perform better in quizzes.
 *
 * DEPENDENCIES:
 * - User model for user details
 * - QuizResult model for scoring data
 */
import User from "../models/User.js";
import QuizResult from "../models/QuizResult.js";

export const getLeaderboard = async (req, res) => {
  try {
    console.log("[LEADERBOARD] fetching leaderboard");

    // Aggregate quiz results to get highest score per user
    const leaderboardData = await QuizResult.aggregate([
      {
        $group: {
          _id: "$userId",
          highestScore: { $max: "$score" },
          totalQuizzesTaken: { $sum: 1 },
        },
      },
      { $sort: { highestScore: -1 } },
      { $limit: 100 }, // Top 100 users
    ]);

    // Fetch user details for each entry
    const leaderboard = await Promise.all(
      leaderboardData.map(async (entry, index) => {
        const user = await User.findById(entry._id).select("name email");
        return {
          rank: index + 1,
          userId: entry._id,
          name: user?.name || "Unknown",
          email: user?.email || "N/A",
          score: entry.highestScore,
          totalQuizzesTaken: entry.totalQuizzesTaken,
        };
      })
    );

    console.log("[LEADERBOARD] success", { totalUsers: leaderboard.length });
    return res.json({ leaderboard });
  } catch (error) {
    console.error("[LEADERBOARD] error", error.message);
    return res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
};
