/**
 * FILE: courseController.js
 * PURPOSE: Returns course data and computes per-user video access state.
 *
 * FLOW:
 * 1) Fetch course list or single course.
 * 2) Load enrollment context for authenticated users.
 * 3) Derive trial/paid access flags.
 * 4) Mark each video as unlocked/locked with a clear reason.
 *
 * WHY THIS EXISTS:
 * It centralizes all access-control decisions so frontend remains simple.
 *
 * DEPENDENCIES:
 * - Course model for base course data
 * - Enrollment model for access state
 * - hasExpired utility for time-based checks
 */
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import { hasExpired } from "../utils/dateUtils.js";

const getAccessMeta = (enrollment) => {
  if (!enrollment) {
    return { fullAccess: false, trialActive: false, paidActive: false, trialDaysLeft: 0, maxModules: 0 };
  }

  const paidActive = enrollment.paymentStatus === "SUCCESS" && enrollment.expiryDate ? !hasExpired(enrollment.expiryDate) : false;
  const trialActive = !paidActive && enrollment.trialEndDate ? !hasExpired(enrollment.trialEndDate) : false;

  const trialDaysLeft = trialActive
    ? Math.max(0, Math.ceil((new Date(enrollment.trialEndDate) - new Date()) / (1000 * 60 * 60 * 24)))
    : 0;

  // Trial unlocks modules 1-2, Subscription unlocks ALL modules
  const maxModules = paidActive ? 999 : trialActive ? 2 : 0;

  return { fullAccess: trialActive || paidActive, trialActive, paidActive, trialDaysLeft, maxModules };
};

export const getCourses = async (_req, res) => {
  const courses = await Course.find().sort({ createdAt: -1 });
  res.json(courses);
};

export const getCourseById = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: "Course not found" });

  const userId = req.user?.id;
  const enrollment = userId ? await Enrollment.findOne({ userId, courseId: course._id }) : null;
  // Cross-course lock: Only prevent multiple TRIAL courses (not trials when you have paid courses)
  let otherTrialActive = null;
  if (userId) {
    const others = await Enrollment.find({ userId, courseId: { $ne: course._id } });
    otherTrialActive = others.find((e) => {
      const trialActive = e.trialEndDate && new Date() <= new Date(e.trialEndDate);
      return trialActive; // Only check for trial, not paid
    });
  }

  const access = getAccessMeta(enrollment);
  // Only lock if user has another TRIAL course (prevents multiple simultaneous trials)
  const lockedByOtherCourse = Boolean(otherTrialActive) && !access.paidActive;

  const videos = course.videos.map((video, index) => {
    const freeByIndex = index < 2;
    const moduleNum = parseInt(video.module?.replace(/\D/g, "")) || 1;
    
    // Decision tree:
    // 1. If free preview → unlocked
    // 2. If free by index (first 2 videos) → unlocked unless locked by other course
    // 3. If trial active → unlock only modules 1-2
    // 4. If paid active → unlock all
    const unlocked = (video.isFreePreview || freeByIndex || (access.trialActive && moduleNum <= 2) || access.paidActive) && !lockedByOtherCourse;
    
    let lockedReason = "";
    if (!unlocked) {
      if (lockedByOtherCourse) {
        lockedReason = "You already have an active trial course. Complete it before starting a new trial.";
      } else if (access.trialActive) {
        lockedReason = `Trial only unlocks Module 1-2. Purchase to access Module ${moduleNum}.`;
      } else {
        lockedReason = "Locked. Start trial or buy course to access.";
      }
    }
    
    return {
      ...video.toObject(),
      unlocked,
      lockedReason,
    };
  });

  res.json({ ...course.toObject(), videos, access, lockedByOtherCourse });
};

export const createCourse = async (req, res) => {
  const course = await Course.create(req.body);
  res.status(201).json(course);
};
