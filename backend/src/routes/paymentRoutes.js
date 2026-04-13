/**
 * FILE: paymentRoutes.js
 * PURPOSE: Defines subscription checkout and payment history endpoints.
 *
 * FLOW:
 * 1) Accept checkout requests (buy/checkout aliases).
 * 2) Return current user's payment history.
 *
 * WHY THIS EXISTS:
 * It keeps payment endpoint definitions concise and maintainable.
 *
 * DEPENDENCIES:
 * - paymentController handlers
 * - auth middleware for protected access
 */
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { checkoutPayment, getPaymentHistory } from "../controllers/paymentController.js";

const router = express.Router();
router.post("/buy", protect, checkoutPayment);
router.post("/checkout", protect, checkoutPayment);
router.get("/history", protect, getPaymentHistory);

export default router;
