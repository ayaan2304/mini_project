import mongoose from "mongoose";

const quizResultSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    score: { type: Number, required: true },
  },
  { timestamps: true }
);

quizResultSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.model("QuizResult", quizResultSchema);
