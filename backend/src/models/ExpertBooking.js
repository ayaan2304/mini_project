/**
 * FILE: ExpertBooking.js
 * PURPOSE: Schema for storing expert talk booking requests from users.
 *
 * FLOW:
 * 1) User submits booking form with topic, preferred date/time, and description.
 * 2) Backend creates ExpertBooking document linked to userId.
 * 3) Admin/Expert can view pending bookings and confirm them.
 * 4) Status transitions: pending → confirmed.
 *
 * WHY THIS EXISTS:
 * Allows users to book one-on-one sessions with experts to clarify doubts and get personalized guidance.
 *
 * DEPENDENCIES:
 * - mongoose for schema/model creation
 * - User reference for linking bookings to authenticated users
 */
import mongoose from "mongoose";

const expertBookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    topic: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model("ExpertBooking", expertBookingSchema);
