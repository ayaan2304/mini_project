/**
 * FILE: quizController.js
 * PURPOSE: Serves quiz questions and stores evaluated quiz results.
 *
 * FLOW:
 * 1) Build a 5-question MCQ quiz dynamically for a course.
 * 2) Return questions without exposing correct answers.
 * 3) Evaluate submitted answers and upsert the user's result.
 *
 * WHY THIS EXISTS:
 * Questions remain in code while only results are stored in MongoDB.
 *
 * DEPENDENCIES:
 * - Course model for course validation
 * - QuizResult model for storing final score
 */
import Course from "../models/Course.js";
import QuizResult from "../models/QuizResult.js";

const buildQuizForCourse = (course) => {
  const title = course.title;
  return [
    {
      question: `What is the main objective of "${title}"?`,
      options: ["Structured learning", "Entertainment only", "No practical work", "Skipping fundamentals"],
      correctAnswer: "Structured learning",
    },
    {
      question: "What is the best way to complete this course?",
      options: ["Follow modules in order", "Watch random videos", "Skip practice", "Ignore concepts"],
      correctAnswer: "Follow modules in order",
    },
    {
      question: "When should you revise previous modules?",
      options: ["Regularly", "Never", "Only after exam", "Only first day"],
      correctAnswer: "Regularly",
    },
    {
      question: "What helps improve your score in assessments?",
      options: ["Practice and review", "Guess all answers", "Skip weak topics", "Do nothing"],
      correctAnswer: "Practice and review",
    },
    {
      question: "Why are project tasks important in learning?",
      options: ["They apply concepts", "They waste time", "They replace theory completely", "They are optional noise"],
      correctAnswer: "They apply concepts",
    },
  ];
};

export const getQuizByCourse = async (req, res) => {
  const course = await Course.findById(req.params.courseId).select("title");
  if (!course) return res.status(404).json({ message: "Course not found" });

  const questions = buildQuizForCourse(course).map((q) => ({
    question: q.question,
    options: q.options,
  }));

  const previousResult = await QuizResult.findOne({ userId: req.user.id, courseId: course._id }).select("score totalQuestions updatedAt");
  return res.json({ courseId: course._id, questions, previousResult });
};

export const submitQuiz = async (req, res) => {
  const { courseId, answers } = req.body || {};
  if (!courseId || !Array.isArray(answers)) {
    return res.status(400).json({ message: "courseId and answers are required" });
  }

  const course = await Course.findById(courseId).select("title");
  if (!course) return res.status(404).json({ message: "Course not found" });

  const quiz = buildQuizForCourse(course);
  if (answers.length !== quiz.length) {
    return res.status(400).json({ message: `Please submit all ${quiz.length} answers` });
  }

  const score = quiz.reduce((sum, q, idx) => (answers[idx] === q.correctAnswer ? sum + 1 : sum), 0);

  await QuizResult.findOneAndUpdate(
    { userId: req.user.id, courseId },
    { userId: req.user.id, courseId, score, totalQuestions: quiz.length },
    { upsert: true, new: true }
  );

  return res.json({ message: "Quiz submitted", score, totalQuestions: quiz.length });
};
