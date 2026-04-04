import mongoose from "mongoose";


const meetingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'User',
      required: true,
      index:true
    },
    title: { type: String, required: true, trim:true, maxLength:500 },
    transcript: { type: String, required: true, maxLength:100_000 },
    status:{
        type:String,
        enum:['idle', 'queued', 'processing', 'done', 'failed'],
        default:'idle'
    },
    summary:{type: String, default: null},
    actionItems: {type: [String],default: null},
    jobId: {type: String,default: null},
    error: {type: String,default: null},
  },
  { timestamps: true }
);

meetingSchema.index({userId:1, createdAt:-1});

// first index by userId
// sort results by latest createdAt
//fast lookup + sorting

// cons
//take extra memory
//writes are slow

export const Meeting = mongoose.model("Meeting", meetingSchema);
