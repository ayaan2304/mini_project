/**
 * FILE: courseRoutes.js
 * PURPOSE: Defines HTTP endpoints for course listing, detail, and creation.
 *
 * FLOW:
 * 1) Public users can fetch course list.
 * 2) Authenticated users fetch course detail with personalized access.
 * 3) Authenticated users can create new course entries.
 *
 * WHY THIS EXISTS:
 * Keeps route declarations separated from business logic.
 *
 * DEPENDENCIES:
 * - courseController handlers
 * - auth middleware for protected endpoints
 */
import express from "express";
import { createCourse, getCourseById, getCourses } from "../controllers/courseController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", getCourses);
router.get("/:id", protect, getCourseById);
router.post("/", protect, createCourse);
export default router;
