import * as z from "zod";
import { MODALITY } from "../constants.js";

export const SeekerProfileSchema = z.object({
  resumeUrl: z.string().url().nullable().optional(),
  linkedin: z.string().url().nullable().optional(),
  github: z.string().url().nullable().optional(),
  portfolio: z.string().url().nullable().optional(),
  expectedSalary: z.number().int().positive().nullable().optional(),
  modality: z.enum([MODALITY.REMOTE, MODALITY.ONSITE, MODALITY.HYBRID]).nullable().optional(),
  location: z.string().nullable().optional(),
  experienceYears: z.number().int().min(0).nullable().optional(),
});

export const RecruiterProfileSchema = z.object({
  companyId: z.string().uuid().nullable().optional(),
  position: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  department: z.string().nullable().optional(),
});

export const CompanySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  description: z.string().nullable().optional(),
  website: z.string().url().nullable().optional(),
  logo: z.string().url().nullable().optional(),
  industry: z.string().nullable().optional(),
  size: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
});

export const PartialCompanySchema = CompanySchema.partial();

export type SeekerProfileInput = z.infer<typeof SeekerProfileSchema>;
export type RecruiterProfileInput = z.infer<typeof RecruiterProfileSchema>;
export type CompanyInput = z.infer<typeof CompanySchema>;
export type PartialCompanyInput = z.infer<typeof PartialCompanySchema>;
