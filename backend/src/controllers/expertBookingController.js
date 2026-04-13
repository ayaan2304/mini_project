/**
 * FILE: expertBookingController.js
 * PURPOSE: Handles creating and retrieving expert talk bookings.
 *
 * FLOW:
 * 1) POST /api/expert-booking → Create booking with user data (auto-filled from auth context)
 * 2) GET /api/expert-booking/user → Fetch user's own bookings
 * 3) Validates input and links booking to authenticated user
 *
 * WHY THIS EXISTS:
 * Provides backend logic for expert booking system to store user requests and retrieve their history.
 *
 * DEPENDENCIES:
 * - ExpertBooking model for database operations
 * - protect middleware ensures only authenticated users can book
 */
import ExpertBooking from "../models/ExpertBooking.js";

export const createBooking = async (req, res) => {
  try {
    const { name, email, topic, description, date, time } = req.body || {};
    const userId = req.user?.id;

    console.log("[EXPERT-BOOKING][CREATE] attempt", { userId, email });

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!name || !email || !topic || !description || !date || !time) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const booking = await ExpertBooking.create({
      userId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      topic: topic.trim(),
      description: description.trim(),
      date: new Date(date),
      time,
      status: "pending",
    });

    console.log("[EXPERT-BOOKING][CREATE] success", { bookingId: booking._id.toString(), userId });
    return res.status(201).json({
      message: "Booking created successfully",
      booking: {
        id: booking._id,
        name: booking.name,
        email: booking.email,
        topic: booking.topic,
        date: booking.date,
        time: booking.time,
        status: booking.status,
      },
    });
  } catch (error) {
    console.error("[EXPERT-BOOKING][CREATE] error", error.message);
    return res.status(500).json({ message: "Failed to create booking" });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user?.id;

    console.log("[EXPERT-BOOKING][GET-USER] attempt", { userId });

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const bookings = await ExpertBooking.find({ userId }).sort({ createdAt: -1 });

    console.log("[EXPERT-BOOKING][GET-USER] success", { userId, count: bookings.length });
    return res.json({ bookings });
  } catch (error) {
    console.error("[EXPERT-BOOKING][GET-USER] error", error.message);
    return res.status(500).json({ message: "Failed to fetch bookings" });
  }
};
