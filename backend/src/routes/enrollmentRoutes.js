/**
 * FILE: enrollmentRoutes.js
 * PURPOSE: Exposes trial and enrollment endpoints for authenticated users.
 *
 * FLOW:
 * 1) Start course trial.
 * 2) Fetch status for a specific course enrollment.
 * 3) Fetch all enrollments for dashboard summaries.
 *
 * WHY THIS EXISTS:
 * It defines a clear API boundary for enrollment workflows.
 *
 * DEPENDENCIES:
 * - enrollmentController handlers
 * - auth middleware for token validation
 */
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { startTrial, getEnrollmentStatus, getMyEnrollments } from "../controllers/enrollmentController.js";

const router = express.Router();
router.post("/start-trial", protect, startTrial);
router.get("/status/:courseId", protect, getEnrollmentStatus);
router.get("/my", protect, getMyEnrollments);

export default router;
