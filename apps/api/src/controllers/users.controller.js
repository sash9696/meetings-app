import * as usersService from "../services/users.service.js";

export async function getMe(req, res) {
  try {
    const user = await usersService.getUserById(req.userId);
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    return res.json({ user });
  } catch (e) {
    return res.status(500).json({ error: e?.message || "Failed to load user" });
  }
}

export async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body || {};
    await usersService.changePassword(req.userId, {
      currentPassword,
      newPassword,
    });
    return res.json({ ok: true });
  } catch (e) {
    const status = e?.statusCode || 500;
    return res.status(status).json({ error: e?.message || "Failed to update" });
  }
}

export async function listUsers(req, res) {
  try {
    const users = await usersService.listUsersForAdmin();
    return res.json({ users });
  } catch (e) {
    return res.status(500).json({ error: e?.message || "Failed to list users" });
  }
}

export async function deleteUser(req, res) {
  try {
    await usersService.deleteUserAsAdmin(req.userId, req.params.id);
    return res.json({ ok: true });
  } catch (e) {
    const status = e?.statusCode || 500;
    return res.status(status).json({ error: e?.message || "Failed to delete" });
  }
}
