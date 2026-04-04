import Enrollment from "../models/Enrollment.js";
import { addDays, hasExpired } from "../utils/dateUtils.js";

const isTrialActive = (enrollment) => {
  if (!enrollment?.trialEndDate) return false;
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
