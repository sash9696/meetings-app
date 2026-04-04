import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { User } from "../models/User.js";
import { Meeting } from "../models/Meeting.js";

export async function getUserById(userId) {
  const user = await User.findById(userId)
    .select("email role createdAt")
    .lean();
  if (!user) return null;
  return {
    id: user._id.toString(),
    email: user.email,
    role: user.role || "user",
    createdAt: user.createdAt,
  };
}

export async function changePassword(userId, { currentPassword, newPassword }) {
  const current = String(currentPassword || "");
  const next = String(newPassword || "");

  if (!current || !next) {
    const err = new Error("currentPassword and newPassword are required");
    err.statusCode = 400;
    throw err;
  }
  if (next.length < 6) {
    const err = new Error("newPassword must be at least 6 characters");
    err.statusCode = 400;
    throw err;
  }

  const user = await User.findById(userId).select("passwordHash");
  if (!user) {
    const err = new Error("Unauthorized");
    err.statusCode = 401;
    throw err;
  }

  const ok = await bcrypt.compare(current, user.passwordHash);
  if (!ok) {
    const err = new Error("Current password is incorrect");
    err.statusCode = 401;
    throw err;
  }

  user.passwordHash = await bcrypt.hash(next, 10);
  await user.save();
  return { ok: true };
}

export async function listUsersForAdmin() {
  const users = await User.find()
    .select("email role createdAt")
    .sort({ createdAt: -1 })
    .lean();

  const ids = users.map((u) => u._id);
  const counts = await Meeting.aggregate([
    { $match: { userId: { $in: ids } } },
    { $group: { _id: "$userId", n: { $sum: 1 } } },
  ]);
  const countByUser = new Map(
    counts.map((c) => [c._id.toString(), c.n]),
  );

  return users.map((u) => ({
    id: u._id.toString(),
    email: u.email,
    role: u.role || "user",
    createdAt: u.createdAt,
    meetingCount: countByUser.get(u._id.toString()) || 0,
  }));
}

export async function deleteUserAsAdmin(actorUserId, targetUserId) {
  if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
    const err = new Error("Invalid user id");
    err.statusCode = 400;
    throw err;
  }
  if (actorUserId === targetUserId) {
    const err = new Error("You cannot delete your own account here");
    err.statusCode = 400;
    throw err;
  }

  const target = await User.findById(targetUserId).select("role").lean();
  if (!target) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  await Meeting.deleteMany({ userId: targetUserId });
  await User.findByIdAndDelete(targetUserId);
  return { ok: true };
}
