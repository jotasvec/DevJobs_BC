import { Router } from "express";
import { requireSession, requireRoles } from "../middlewares/auth.js";
import { UsersController } from "../controllers/users.js";

const usersRouter: Router = Router();

usersRouter.get("/", requireSession, UsersController.getAll);
usersRouter.get("/:id", requireSession, UsersController.getById);
// usersRouter.get("/:id", requireSession, requireRoles("recruiter","admin"), requireSession, UsersController.getById);

usersRouter.put("/:id", requireSession, requireRoles("admin"), UsersController.update);
usersRouter.patch("/:id", requireSession, requireRoles("admin"), UsersController.partialUpdate);
usersRouter.delete("/:id", requireSession, requireRoles("admin"), UsersController.delete);

export { usersRouter };
