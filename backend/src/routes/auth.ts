import { Router } from "express";
import { auth } from "../lib/auth";


const authRouter : Router = Router();

authRouter.use('/api/auth', auth.handler);

export { authRouter };