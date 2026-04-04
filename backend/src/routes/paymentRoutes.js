import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { checkoutPayment, getPaymentHistory } from "../controllers/paymentController.js";

const router = express.Router();
router.post("/buy", protect, checkoutPayment);
router.post("/checkout", protect, checkoutPayment);
router.get("/history", protect, getPaymentHistory);

export default router;
