import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student"], default: "student" },
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    trialStartDate: { type: Date },
    subscriptionDetails: { type: subscriptionSchema, default: () => ({}) },
    streakCount: { type: Number, default: 0 },
    lastLoginDate: { type: Date },
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  return next();
});

userSchema.methods.comparePassword = function comparePassword(plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

export default mongoose.model("User", userSchema);
