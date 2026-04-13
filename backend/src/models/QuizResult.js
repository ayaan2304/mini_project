/**
 * FILE: QuizResult.js
 * PURPOSE: Stores each user's quiz result per course.
 *
 * FLOW:
 * 1) Backend computes score from submitted answers.
 * 2) One result record per (user, course) is inserted/updated.
 * 3) Frontend reads the saved score to show progress feedback.
 *
 * WHY THIS EXISTS:
 * Only results are persisted so quiz questions can stay code-defined.
 *
 * DEPENDENCIES:
 * - mongoose for schema/model creation
 */
import mongoose from "mongoose";

const quizResultSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
  },
  { timestamps: true }
);

quizResultSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.model("QuizResult", quizResultSchema);
