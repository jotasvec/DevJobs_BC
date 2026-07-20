import { Router, type Router as RouterType } from "express";
import { SeekerProfileController } from "../controllers/seekerProfile.js";
import { requireSession } from "@/middlewares/auth.js";
import { validateSchemas } from "../middlewares/validateSchemas.js";
import { SeekerProfileSchema } from "../schemas/profiles.js";

const seekerProfileRouter: RouterType = Router();

// Get own seeker profile
seekerProfileRouter.get("/me/seeker-profile", requireSession, SeekerProfileController.getOwn);

// Update own seeker profile
seekerProfileRouter.put("/me/seeker-profile", requireSession, validateSchemas(SeekerProfileSchema), SeekerProfileController.updateOwn);

// Get seeker profile by user ID (admin/recruiter)
seekerProfileRouter.get("/seeker-profile/:userId", requireSession, SeekerProfileController.getByUserId);

export { seekerProfileRouter };
