/**
 * FILE: enrollmentController.js
 * PURPOSE: Manages trial start, enrollment status checks, and user enrollment listings.
 *
 * FLOW:
 * 1) Start trial for a specific course when requested.
 * 2) Compute trial/paid/full-access status per course enrollment.
 * 3) Return enrollment summaries for dashboard display.
 *
 * WHY THIS EXISTS:
 * Enrollment is the core source of truth for course access lifecycle.
 *
 * DEPENDENCIES:
 * - Enrollment model for persistence
 * - addDays/hasExpired for date-driven access state
 */
import Enrollment from "../models/Enrollment.js";
import { addDays, hasExpired } from "../utils/dateUtils.js";

const isTrialActive = (enrollment) => {
  if (!enrollment?.trialEndDate) return false;
  if (enrollment?.paymentStatus === "SUCCESS" && enrollment?.expiryDate && !hasExpired(enrollment.expiryDate)) {
    return false;
  }
  return !hasExpired(enrollment.trialEndDate);
};

const isPaidActive = (enrollment) => {
  if (enrollment?.paymentStatus !== "SUCCESS") return false;
  return !hasExpired(enrollment.expiryDate);
};

export const startTrial = async (req, res) => {
  const { courseId } = req.body;
  if (!courseId) return res.status(400).json({ message: "courseId is required" });

  let enrollment = await Enrollment.findOne({ userId: req.user.id, courseId });

  if (!enrollment) {
    const now = new Date();
    enrollment = await Enrollment.create({
      userId: req.user.id,
      courseId,
      trialStartDate: now,
      trialEndDate: addDays(now, 3),
      paymentStatus: "PENDING",
    });
  }

  return res.status(201).json({ message: "Trial started", enrollment });
};

export const getEnrollmentStatus = async (req, res) => {
  const { courseId } = req.params;
  const enrollment = await Enrollment.findOne({ userId: req.user.id, courseId });

  if (!enrollment) {
    return res.json({
      hasEnrollment: false,
      trialActive: false,
      paidActive: false,
      fullAccess: false,
      trialDaysLeft: 0,
    });
  }

  const trialActive = isTrialActive(enrollment);
  const paidActive = isPaidActive(enrollment);
  const fullAccess = trialActive || paidActive;

  const trialDaysLeft = trialActive
    ? Math.max(0, Math.ceil((new Date(enrollment.trialEndDate) - new Date()) / (1000 * 60 * 60 * 24)))
    : 0;

  return res.json({
    hasEnrollment: true,
    trialActive,
    paidActive,
    fullAccess,
    trialDaysLeft,
    enrollment,
  });
};

export const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.user.id })
      .populate("userId", "name email")
      .populate("courseId", "title description level")
      .sort({ createdAt: -1 });

    const formatted = enrollments.map((enrollment) => {
      const trialActive = isTrialActive(enrollment);
      const paidActive = isPaidActive(enrollment);
      const startDate = enrollment.trialStartDate || enrollment.createdAt;
      const statusLabel = paidActive ? "Paid Active" : trialActive ? "Trial Active" : "Inactive";

      return {
        _id: enrollment._id,
        courseId: enrollment.courseId?._id || null,
        studentName: enrollment.userId?.name || "Unknown",
        studentEmail: enrollment.userId?.email || "",
        courseTitle: enrollment.courseId?.title || "Untitled Course",
        courseDescription: enrollment.courseId?.description || "",
        courseLevel: enrollment.courseId?.level || "beginner",
        startDate,
        statusLabel,
        trialActive,
        paidActive,
      };
    });

    return res.json(formatted);
  } catch (err) {
    console.error("[ENROLLMENT][GET-MY-ENROLLMENTS] Error:", err.message);
    return res.status(500).json({ message: "Failed to fetch enrollments", error: err.message });
  }
};
