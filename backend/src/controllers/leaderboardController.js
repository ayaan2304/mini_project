import QuizResult from "../models/QuizResult.js";
import Enrollment from "../models/Enrollment.js";
import User from "../models/User.js";

export const getLeaderboard = async (req, res) => {
  const results = await QuizResult.aggregate([
    { $group: { _id: "$userId", quizScore: { $sum: "$score" } } },
  ]);

  const progressRows = await Enrollment.aggregate([
    { $group: { _id: "$userId", avgProgress: { $avg: "$progress" } } },
  ]);

  const progressMap = new Map(progressRows.map((p) => [String(p._id), Math.round(p.avgProgress || 0)]));

  const scoreRows = results
    .map((r) => ({
      userId: String(r._id),
      quizScore: r.quizScore,
      courseProgress: progressMap.get(String(r._id)) || 0,
    }))
    .map((r) => ({ ...r, totalScore: r.quizScore + r.courseProgress }))
    .sort((a, b) => b.totalScore - a.totalScore);

  const users = await User.find({ _id: { $in: scoreRows.map((r) => r.userId) } }).select("name email");
  const userMap = new Map(users.map((u) => [String(u._id), u]));

  const topUsers = scoreRows.slice(0, 20).map((row, index) => ({
    rank: index + 1,
    userId: row.userId,
    name: userMap.get(row.userId)?.name || "Unknown",
    email: userMap.get(row.userId)?.email || "",
    quizScore: row.quizScore,
    courseProgress: row.courseProgress,
    totalScore: row.totalScore,
  }));

  const myRank = topUsers.find((item) => item.userId === String(req.user.id)) || null;
  res.json({ topUsers, myRank });
};
