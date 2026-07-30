import { z } from "zod";

export const userProfileSchema = z.object({
    name: z.string().min(1, "Name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z
        .string()
        .email("Invalid email")
        .min(1, 'Email is required'),
    phone: z.string().nullable().optional(),
    bio: z.string().nullable().optional(),
});
