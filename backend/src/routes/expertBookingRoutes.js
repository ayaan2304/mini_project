/**
 * FILE: expertBookingRoutes.js
 * PURPOSE: Defines API endpoints for expert talk booking system.
 *
 * FLOW:
 * 1) POST /api/expert-booking → Create new booking (protected)
 * 2) GET /api/expert-booking/user → Fetch user's bookings (protected)
 *
 * WHY THIS EXISTS:
 * Provides REST endpoints for frontend to interact with expert booking backend logic.
 *
 * DEPENDENCIES:
 * - express for routing
 * - expertBookingController for handler functions
 * - authMiddleware.protect to ensure authentication
 */
import express from "express";
import { createBooking, getUserBookings } from "../controllers/expertBookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/user", protect, getUserBookings);

export default router;
