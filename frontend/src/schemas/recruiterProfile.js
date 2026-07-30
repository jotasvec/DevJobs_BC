import { z } from "zod";

export const recruiterProfileSchema = z.object({
    companyId: z.string().nullable().optional(),
    position: z.string().nullable().optional(),
    department: z.string().nullable().optional(),
});
