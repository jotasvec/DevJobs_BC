import { Router, type Router as RouterType } from "express";
import { CompanyController } from "../controllers/company.js";
import { requireSession, requireRoles } from "@/middlewares/auth.js";
import { validateSchemas } from "../middlewares/validateSchemas.js";
import { CompanySchema, PartialCompanySchema } from "../schemas/profiles.js";
import { ROLES } from "../constants.js";

const companiesRouter: RouterType = Router();

// Public: list all companies
companiesRouter.get("/", CompanyController.getAll);

// Public: get company by ID
companiesRouter.get("/:id", CompanyController.getById);

// Admin only: create company
companiesRouter.post("/", requireSession, requireRoles(ROLES.ADMIN), validateSchemas(CompanySchema), CompanyController.create);

// Admin only: update company
companiesRouter.patch("/:id", requireSession, requireRoles(ROLES.ADMIN), validateSchemas(PartialCompanySchema), CompanyController.update);

// Admin only: delete company
companiesRouter.delete("/:id", requireSession, requireRoles(ROLES.ADMIN), CompanyController.delete);

export { companiesRouter };
