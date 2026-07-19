import { Router } from "express";
import { requireSession, requireRoles } from "../middlewares/auth.js";
import { UsersController } from "../controllers/users.js";
import { ROLES } from "../constants.js";

const usersRouter: Router = Router();

usersRouter.get("/", requireSession, UsersController.getAll);
usersRouter.get("/:id", requireSession, UsersController.getById);

usersRouter.put("/:id", requireSession, requireRoles(ROLES.ADMIN), UsersController.update);
usersRouter.patch("/:id", requireSession, requireRoles(ROLES.ADMIN), UsersController.partialUpdate);
usersRouter.delete("/:id", requireSession, requireRoles(ROLES.ADMIN), UsersController.delete);

export { usersRouter };
