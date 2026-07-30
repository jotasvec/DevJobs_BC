import { z } from "zod";
import { MODALITY } from "../constants";

export const seekerProfileSchema = z.object({
    linkedin: z.string().url("Must be a valid URL").nullable().optional().or(z.literal("")),
    github: z.string().url("Must be a valid URL").nullable().optional().or(z.literal("")),
    portfolio: z.string().url("Must be a valid URL").nullable().optional().or(z.literal("")),
    resumeUrl: z.string().url("Must be a valid URL").nullable().optional().or(z.literal("")),
    coverLetter: z.string().nullable().optional(),
    location: z.string().nullable().optional(),
    modality: z.enum(Object.values(MODALITY)).nullable().optional(),
    experienceYears: z.coerce.number().int().min(0).nullable().optional(),
    expectedSalary: z.coerce.number().int().positive().nullable().optional(),
});
