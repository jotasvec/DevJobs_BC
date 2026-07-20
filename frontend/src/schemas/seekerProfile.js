import { z } from "zod";

export const seekerProfileSchema = z.object({
    linkedin: z.string().url("Must be a valid URL").nullable().optional().or(z.literal("")),
    github: z.string().url("Must be a valid URL").nullable().optional().or(z.literal("")),
    portfolio: z.string().url("Must be a valid URL").nullable().optional().or(z.literal("")),
    resumeUrl: z.string().url("Must be a valid URL").nullable().optional().or(z.literal("")),
    location: z.string().nullable().optional(),
    modality: z.enum(["remote", "onsite", "hybrid"]).nullable().optional(),
    experienceYears: z.number().int().min(0).nullable().optional(),
    expectedSalary: z.number().int().positive().nullable().optional(),
});
