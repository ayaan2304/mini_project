/**
 * FILE: leaderboardRoutes.js
 * PURPOSE: Defines API endpoints for quiz leaderboard.
 *
 * FLOW:
 * 1) GET /api/leaderboard → Fetch ranked leaderboard (public, no auth required)
 *
 * WHY THIS EXISTS:
 * Provides REST endpoint for frontend to fetch and display leaderboard.
 *
 * DEPENDENCIES:
 * - express for routing
 * - leaderboardController for handler functions
 */
import express from "express";
import { getLeaderboard } from "../controllers/leaderboardController.js";

const router = express.Router();

router.get("/", getLeaderboard);

export default router;
