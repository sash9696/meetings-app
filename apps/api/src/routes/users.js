import { Router } from "express";
import * as usersController from "../controllers/users.controller.js";
import { adminMiddleware } from "../middleware/admin.js";

const router = Router();

router.get("/me", usersController.getMe);
router.patch("/me/password", usersController.changePassword);

router.get("/", adminMiddleware, usersController.listUsers);
router.delete("/:id", adminMiddleware, usersController.deleteUser);

export default router;
