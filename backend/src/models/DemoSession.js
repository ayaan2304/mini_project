import mongoose from "mongoose";

const demoSessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    topic: { type: String, required: true },
    status: { type: String, enum: ["BOOKED", "DONE"], default: "BOOKED" },
  },
  { timestamps: true }
);

export default mongoose.model("DemoSession", demoSessionSchema);
