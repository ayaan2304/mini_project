import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { bookDemoSession, getMyDemoSessions } from "../controllers/demoController.js";

const router = express.Router();
router.post("/book", protect, bookDemoSession);
router.get("/my-sessions", protect, getMyDemoSessions);

export default router;
