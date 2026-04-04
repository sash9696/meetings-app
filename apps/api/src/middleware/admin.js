import { User } from "../models/User.js";

export async function adminMiddleware(req, res, next) {
  const user = await User.findById(req.userId).select("role").lean();
  if (!user || user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
}
