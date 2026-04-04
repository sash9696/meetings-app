import mongoose from "mongoose";
import { Meeting } from "../models/Meeting.js";

function round(n) {
  return typeof n === "number" && Number.isFinite(n) ? Math.round(n) : 0;
}

function toObjectId(userId) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const err = new Error("Invalid user");
    err.statusCode = 400;
    throw err;
  }
  return new mongoose.Types.ObjectId(userId);
}

export async function getDashboardStats(userId) {
  const uid = toObjectId(userId);

  const [stats] = await Meeting.aggregate([
    { $match: { userId: uid } },
    {
      $project: {
        status: 1,
        transcriptLen: { $strLenCP: "$transcript" },
        summaryLen: {
          $cond: [
            { $gt: [{ $ifNull: ["$summary", ""] }, ""] },
            { $strLenCP: "$summary" },
            0,
          ],
        },
        durationMs: { $subtract: ["$updatedAt", "$createdAt"] },
      },
    },
    {
      $group: {
        _id: null,
        totalMeetings: { $sum: 1 },
        idleCount: { $sum: { $cond: [{ $eq: ["$status", "idle"] }, 1, 0] } },
        queuedCount: { $sum: { $cond: [{ $eq: ["$status", "queued"] }, 1, 0] } },
        processingCount: {
          $sum: { $cond: [{ $eq: ["$status", "processing"] }, 1, 0] },
        },
        doneCount: { $sum: { $cond: [{ $eq: ["$status", "done"] }, 1, 0] } },
        failedCount: {
          $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] },
        },
        avgTranscriptLen: { $avg: "$transcriptLen" },
        avgSummaryLenDone: {
          $avg: {
            $cond: [{ $eq: ["$status", "done"] }, "$summaryLen", null],
          },
        },
        avgDurationMsDone: {
          $avg: {
            $cond: [{ $eq: ["$status", "done"] }, "$durationMs", null],
          },
        },
        avgDurationMsFailed: {
          $avg: {
            $cond: [{ $eq: ["$status", "failed"] }, "$durationMs", null],
          },
        },
      },
    },
  ]);

  const s = stats || {};
  const total = s.totalMeetings || 0;
  const done = s.doneCount || 0;
  const completionRate = total > 0 ? done / total : 0;

  const avgInputTokensEstimate = s.avgTranscriptLen ? s.avgTranscriptLen / 4 : 0;
  const avgOutputTokensEstimate = s.avgSummaryLenDone
    ? s.avgSummaryLenDone / 4
    : 0;

  return {
    totalMeetings: total,
    completionRate,
    counts: {
      idle: s.idleCount || 0,
      queued: s.queuedCount || 0,
      processing: s.processingCount || 0,
      done,
      failed: s.failedCount || 0,
    },
    avgTranscriptChars: round(s.avgTranscriptLen),
    avgSummaryChars: round(s.avgSummaryLenDone),
    avgInputTokensEstimate: round(avgInputTokensEstimate),
    avgOutputTokensEstimate: round(avgOutputTokensEstimate),
    avgProcessingSecondsDone: round((s.avgDurationMsDone || 0) / 1000),
    avgProcessingSecondsFailed: round((s.avgDurationMsFailed || 0) / 1000),
  };
}
