

// API -> post  /summarize -> writes queued -> summarizeQueue.add({meetingID})
// Redis -> holds the job until the consumer takes it
// Worker -> Worker('summarize) -> same name as API queue and runs outside the express 
//loads the meeting, sumamrizeMeeting, saves done / failed







import "dotenv/config";
import mongoose from "mongoose";
import { Worker } from "bullmq";
import { Meeting } from "./models/Meeting.js";
import { summarizeMeeting } from "./llm.js";

const uri =
  process.env.MONGODB_URI ||
  "mongodb://127.0.0.1:27017/meeting_intel";

const connection = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT || 6379),
  maxRetriesPerRequest: null,
};

await mongoose.connect(uri);
console.log("Worker MongoDB connected");

const worker = new Worker(
  "summarize",
  async (job) => {
    const meetingId = job.data?.meetingId;
    if (!meetingId) throw new Error("missing meetingId");

    const meeting = await Meeting.findById(meetingId);
    if (!meeting) throw new Error("meeting not found");

    meeting.status = "processing";
    await meeting.save();

    try {
      const result = await summarizeMeeting({
        title: meeting.title,
        transcript: meeting.transcript,
      });
      meeting.summary = result.summary;
      meeting.actionItems = result.actionItems;
      meeting.status = "done";
      meeting.error = null;
      await meeting.save();
    } catch (e) {
      console.error("Summarize job failed", meetingId, e);
      meeting.status = "failed";
      meeting.error = e.message?.slice(0, 500) || "Summarization failed";
      await meeting.save();
      throw e;
    }
  },
  { connection }
);

worker.on("completed", (job) => console.log("job completed", job.id));
worker.on("failed", (job, err) => console.error("job failed", job?.id, err));

console.log("Summarize worker started");




// auth -> meetings -> summarize -> worker -> mock -> poll