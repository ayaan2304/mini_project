import Quiz from "../models/Quiz.js";
import QuizResult from "../models/QuizResult.js";
import Enrollment from "../models/Enrollment.js";

export const getQuizByCourse = async (req, res) => {
  const quiz = await Quiz.findOne({ courseId: req.params.courseId });
  if (!quiz) return res.status(404).json({ message: "Quiz not found" });

  // Hide answers in API response for realistic quiz flow.
  const safeQuestions = quiz.questions.map((q) => ({ question: q.question, options: q.options }));
  return res.json({ _id: quiz._id, courseId: quiz.courseId, questions: safeQuestions });
};

export const submitQuiz = async (req, res) => {
  const { courseId, answers } = req.body;
  if (!courseId || !Array.isArray(answers)) {
    return res.status(400).json({ message: "courseId and answers are required" });
  }

  const quiz = await Quiz.findOne({ courseId });
  if (!quiz) return res.status(404).json({ message: "Quiz not found" });

  let score = 0;
  quiz.questions.forEach((q, i) => {
    if (answers[i] && answers[i] === q.correctAnswer) score += 10;
  });

  await QuizResult.findOneAndUpdate(
    { userId: req.user.id, courseId },
    { userId: req.user.id, courseId, score },
    { upsert: true, new: true }
  );

  await Enrollment.findOneAndUpdate(
    { userId: req.user.id, courseId },
    { $set: { progress: Math.min(100, score) } },
    { upsert: true, new: true }
  );

  res.json({ message: "Quiz submitted", score });
};
