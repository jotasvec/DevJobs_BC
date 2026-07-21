import { Router } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../lib/auth";

const authHandler = toNodeHandler(auth);

const authRouter : Router = Router();

authRouter.use('/api/auth', authHandler);

export { authRouter };