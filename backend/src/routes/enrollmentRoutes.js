import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { startTrial, getEnrollmentStatus } from "../controllers/enrollmentController.js";

const router = express.Router();
router.post("/start-trial", protect, startTrial);
router.get("/status/:courseId", protect, getEnrollmentStatus);

export default router;
