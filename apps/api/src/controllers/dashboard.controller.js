import * as dashboardService from "../services/dashboard.service.js";

export async function stats(req, res) {
  try {
    const data = await dashboardService.getDashboardStats(req.userId);
    return res.json(data);
  } catch (e) {
    const status = e?.statusCode || 500;
    return res
      .status(status)
      .json({ error: e?.message || "Failed to load dashboard" });
  }
}
