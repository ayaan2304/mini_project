import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getQuizByCourse, submitQuiz } from "../controllers/quizController.js";

const router = express.Router();
router.get("/:courseId", protect, getQuizByCourse);
router.post("/submit", protect, submitQuiz);

export default router;
