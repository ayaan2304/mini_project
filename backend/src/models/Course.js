import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    module: { type: String, default: "Module 1" },
    isFreePreview: { type: Boolean, default: false },
  },
  { _id: false }
);

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    outcomes: [{ type: String }],
    domain: { type: String, enum: ["technical", "language"], default: "technical" },
    level: { type: String, enum: ["beginner", "intermediate", "advanced"], required: true },
    price: { type: Number, required: true },
    videos: [videoSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
