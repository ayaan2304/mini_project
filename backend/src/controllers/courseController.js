import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import { hasExpired } from "../utils/dateUtils.js";

const getAccessMeta = (enrollment) => {
  if (!enrollment) {
    return { fullAccess: false, trialActive: false, paidActive: false, trialDaysLeft: 0 };
  }

  const trialActive = enrollment.trialEndDate ? !hasExpired(enrollment.trialEndDate) : false;
  const paidActive = enrollment.paymentStatus === "SUCCESS" && enrollment.expiryDate ? !hasExpired(enrollment.expiryDate) : false;

  const trialDaysLeft = trialActive
    ? Math.max(0, Math.ceil((new Date(enrollment.trialEndDate) - new Date()) / (1000 * 60 * 60 * 24)))
    : 0;

  return { fullAccess: trialActive || paidActive, trialActive, paidActive, trialDaysLeft };
};

export const getCourses = async (_req, res) => {
  const courses = await Course.find().sort({ createdAt: -1 });
  res.json(courses);
};

export const getCourseById = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: "Course not found" });

  const enrollment = req.user?.id
    ? await Enrollment.findOne({ userId: req.user.id, courseId: course._id })
    : null;

  const access = getAccessMeta(enrollment);

  const videos = course.videos.map((video, index) => {
    const freeByIndex = index < 2;
    const unlocked = freeByIndex || video.isFreePreview || access.fullAccess;
    return {
      ...video.toObject(),
      unlocked,
      lockedReason: unlocked ? "" : "Locked after trial. Buy course to continue.",
    };
  });

  res.json({ ...course.toObject(), videos, access });
};

export const createCourse = async (req, res) => {
  const course = await Course.create(req.body);
  res.status(201).json(course);
};
