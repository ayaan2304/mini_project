/**
 * FILE: server.js
 * PURPOSE: Bootstraps the Express API server and mounts core route modules.
 *
 * FLOW:
 * 1) Load environment variables and connect to MongoDB Atlas.
 * 2) Apply middleware (CORS + JSON parser).
 * 3) Mount authentication, courses, enrollment, and payment routes.
 * 4) Start listening on configured port.
 *
 * WHY THIS EXISTS:
 * It is the main backend entrypoint that wires all API features together.
 *
 * DEPENDENCIES:
 * - express/dotenv/cors for API runtime
 * - connectDB for Atlas connection
 * - route modules for each feature area
 */
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import expertBookingRoutes from "./routes/expertBookingRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: [process.env.CLIENT_URL, "http://localhost:5173", "http://localhost:5174"] }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
// Public GETs for landing; POST remains protected inside route file
app.use("/api/courses", courseRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/enroll", enrollmentRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/expert-booking", expertBookingRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
