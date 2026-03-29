import mongoose from "mongoose";

// docker compose exec mongo mongosh "mongodb://127.0.0.1:27017/meeting_intel"

// or docker compose exec mongo mongosh

// use meeting_intel

// show collections

// db.meetings.find().limit(5)

// db.users.find().limit(5)

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
