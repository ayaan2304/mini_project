import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    planType: { type: String, enum: ["none", "one-time", "subscription"], default: "none" },
    planDurationDays: { type: Number, default: 0 },
    startDate: { type: Date },
    expiryDate: { type: Date },
    status: { type: String, enum: ["inactive", "active", "expired"], default: "inactive" },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student"], default: "student" },
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    trialStartDate: { type: Date },
    subscriptionDetails: { type: subscriptionSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
