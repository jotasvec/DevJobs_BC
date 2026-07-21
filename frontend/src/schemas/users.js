import { z } from "zod";


export const seekerProfileSchema = z.object({
    linkedin: z.string().url("Must be a valid URL").nullable().optional(),
    github: z.string().url("Must be a valid URL").nullable().optional(),
    portfolio: z.string().url("Must be a valid URL").nullable().optional(),
    resumeUrl: z.string().url("Must be a valid URL").nullable().optional(),
    location: z.string().nullable().optional(),
    modality: z.enum(["remote", "onsite", "hybrid"]).nullable().optional(),
    experienceYears: z.number().int().min(0).nullable().optional(),
    expectedSalary: z.number().int().positive().nullable().optional(),
});

