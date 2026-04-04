import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    trialStartDate: { type: Date },
    trialEndDate: { type: Date },
    expiryDate: { type: Date },
    paymentStatus: { type: String, enum: ["PENDING", "SUCCESS"], default: "PENDING" },
    progress: { type: Number, default: 0 },
  },
  { timestamps: true }
);

enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.model("Enrollment", enrollmentSchema);
