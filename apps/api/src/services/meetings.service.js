import mongoose from "mongoose";
import { Meeting } from "../models/Meeting.js";
import { summarizeQueue } from "../queue.js";

const MAX_TRANSCRIPT = 100_000;


function formatMeeting(m) {
  const o = m.toObject ? m.toObject() : m;
  return {
    id: o._id.toString(),
    title: o.title,
    transcript: o.transcript,
    summary: o.summary,
    actionItems: o.actionItems,
    decisions: o.decisions,
    status: o.status,
    jobId: o.jobId,
    error: o.error,
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  };
}
function toObjectId(userId) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const err = new Error("Invalid id");
    err.statusCode = 400;
    throw err;
  }
  return new mongoose.Types.ObjectId(userId);
}

export async function createMeeting(userId, { title, transcript }) {
  const t = String(transcript || "");

  if (t.length > MAX_TRANSCRIPT) {
    const err = new Error(`Transcript too long (max ${MAX_TRANSCRIPT} chars)`);
    err.statusCode = 400;
    throw err;
  }

  return Meeting.create({
    userId: toObjectId(userId),
    title: String(title || "").trim(),
    transcript: t,
    status: "idle",
  });
}

export async function listMeetings(userId) {
  return Meeting.find({
    userId: toObjectId(userId),
  })
    .sort({ createdAt: -1 })
    .lean();
}

export async function getMeeting(userId, meetingId) {
    if (!mongoose.Types.ObjectId.isValid(meetingId)) {
      const err = new Error('Invalid meeting id');
      err.statusCode = 400;
      throw err;
    }
    const m = await Meeting.findOne({
      _id: meetingId,
      userId: toObjectId(userId),
    }).lean();
    if (!m) {
      const err = new Error('Meeting not found');
      err.statusCode = 404;
      throw err;
    }
    return m;
  }
export async function updateMeeting(userId, meetingId, body) {
    await getMeeting(userId, meetingId); // 404 if not owned
    const updates = {};
    if (body.title != null) updates.title = String(body.title).trim();
    if (body.transcript != null) {
      const t = String(body.transcript);
      if (t.length > MAX_TRANSCRIPT) {
        const err = new Error(`Transcript too long (max ${MAX_TRANSCRIPT} chars)`);
        err.statusCode = 400;
        throw err;
      }
      updates.transcript = t;
    }
    if (Object.keys(updates).length === 0) {
      const err = new Error('No valid fields to update');
      err.statusCode = 400;
      throw err;
    }
    return Meeting.findOneAndUpdate(
      { _id: meetingId, userId: toObjectId(userId) },
      { $set: updates },
      { new: true, runValidators: true }
    ).lean();
  }
export async function deleteMeeting(userId, meetingId) {
    const result = await Meeting.deleteOne({
      _id: meetingId,
      userId: toObjectId(userId),
    });
    if (result.deletedCount === 0) {
      const err = new Error('Meeting not found');
      err.statusCode = 404;
      throw err;
    }
  }

export async function requestSummarize(userId, meetingId) {
    const meeting = await Meeting.findOne({ _id: meetingId, userId });
    if (!meeting) {
      const err = new Error('Not found');
      err.statusCode = 404;
      throw err;
    }
  
    if (['queued', 'processing'].includes(meeting.status)) {
      const err = new Error('Summarization already in progress');
      err.statusCode = 409;
      throw err;
    }
  
    meeting.status = 'queued';
    meeting.error = null;
    meeting.summary = null;
    meeting.actionItems = null;
    meeting.decisions = null;
    await meeting.save();
  
    const job = await summarizeQueue.add(
      'summarize',
      { meetingId: meeting._id.toString() },
      {
        attempts: 1,
        removeOnComplete: true,
        removeOnFail: false,
      }
    );
  
    const jobId = job?.id ? String(job.id) : null;
    meeting.jobId = jobId;
    await meeting.save();
  
    return { jobId, meeting: formatMeeting(meeting) };
  }


