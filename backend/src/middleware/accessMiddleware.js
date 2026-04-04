import Enrollment from "../models/Enrollment.js";
import { hasExpired } from "../utils/dateUtils.js";

export const checkCourseAccess = async (req, res, next) => {
  const { courseId } = req.params;
  const enrollment = await Enrollment.findOne({ userId: req.user.id, courseId });

  if (!enrollment) {
    return res.status(403).json({ message: "You are not enrolled in this course" });
  }

  if (enrollment.paymentStatus === "paid" && !hasExpired(enrollment.expiryDate)) {
    return next();
  }

  if (enrollment.paymentStatus === "pending" && !hasExpired(enrollment.expiryDate)) {
    return next();
  }

  return res.status(403).json({ message: "Access expired. Please purchase or renew plan." });
};
