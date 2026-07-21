import { Router, type Router as RouterType } from "express";
import { RecruiterProfileController } from "../controllers/recruiterProfile.js";
import { requireSession } from "@/middlewares/auth.js";
import { validateSchemas } from "../middlewares/validateSchemas.js";
import { RecruiterProfileSchema } from "../schemas/profiles.js";

const recruiterProfileRouter: RouterType = Router();

// Get own recruiter profile
recruiterProfileRouter.get("/me/recruiter-profile", requireSession, RecruiterProfileController.getOwn);

// Update own recruiter profile
recruiterProfileRouter.put("/me/recruiter-profile", requireSession, validateSchemas(RecruiterProfileSchema), RecruiterProfileController.updateOwn);

// Get recruiter profile by user ID (admin)
recruiterProfileRouter.get("/recruiter-profile/:userId", requireSession, RecruiterProfileController.getByUserId);

export { recruiterProfileRouter };
