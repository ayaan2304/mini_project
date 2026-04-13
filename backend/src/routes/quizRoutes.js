/**
 * FILE: quizRoutes.js
 * PURPOSE: Provides quiz endpoints for course-specific MCQ attempts.
 *
 * FLOW:
 * 1) Authenticated user requests quiz questions by course.
 * 2) User submits answers for evaluation.
 * 3) Controller stores only final result in DB.
 *
 * WHY THIS EXISTS:
 * Keeps quiz routing separate from controller business logic.
 *
 * DEPENDENCIES:
 * - protect middleware for auth
 * - quizController handlers
 */
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getQuizByCourse, submitQuiz } from "../controllers/quizController.js";

const router = express.Router();
router.get("/:courseId", protect, getQuizByCourse);
router.post("/submit", protect, submitQuiz);

export default router;
