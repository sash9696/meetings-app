import mongoose from "mongoose";

const STATUSES = ["idle", "queued", "processing", "done", "failed"];

const meetingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    transcript: { type: String, required: true },
    status: { type: String, enum: STATUSES, default: "idle" },
    summary: { type: String, default: null },
    actionItems: { type: [String], default: null },
    jobId: { type: String, default: null },
    error: { type: String, default: null },
  },
  { timestamps: true }
);

export const Meeting = mongoose.model("Meeting", meetingSchema);