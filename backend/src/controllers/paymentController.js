/**
 * FILE: paymentController.js
 * PURPOSE: Handles mock subscription checkout and payment history retrieval.
 *
 * FLOW:
 * 1) Validate checkout payload.
 * 2) Save successful payment transaction.
 * 3) Update enrollment with paid status and expiry.
 * 4) Remove trial dates so subscription is the only active access mode.
 *
 * WHY THIS EXISTS:
 * It keeps subscription rules consistent between billing and course access checks.
 *
 * DEPENDENCIES:
 * - Payment model for transaction records
 * - Enrollment model for access updates
 * - addDays utility for plan expiry calculation
 */
import Payment from "../models/Payment.js";
import Enrollment from "../models/Enrollment.js";
import { addDays } from "../utils/dateUtils.js";

export const checkoutPayment = async (req, res) => {
  const { courseId, amount, planDurationDays } = req.body;
  if (!courseId || !amount || !planDurationDays) {
    return res.status(400).json({ message: "courseId, amount and planDurationDays are required" });
  }

  const payment = await Payment.create({
    userId: req.user.id,
    courseId,
    amount,
    planDurationDays,
    status: "SUCCESS",
  });

  const now = new Date();
  const expiryDate = addDays(now, planDurationDays);

  const enrollment = await Enrollment.findOneAndUpdate(
    { userId: req.user.id, courseId },
    {
      userId: req.user.id,
      courseId,
      paymentStatus: "SUCCESS",
      expiryDate,
      trialStartDate: null,
      trialEndDate: null,
    },
    { upsert: true, new: true }
  );

  return res.status(201).json({ message: "Payment successful", payment, enrollment });
};

export const getPaymentHistory = async (req, res) => {
  const payments = await Payment.find({ userId: req.user.id }).sort({ createdAt: -1 }).populate("courseId", "title");
  res.json(payments);
};
