import * as z from "zod";

export const UserRoleSchema = z.enum([
  "seeker",
  "recruiter",
  "admin",
]);

export const UserRowSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  role: UserRoleSchema,
  bio: z.string().nullable(),
  resume: z.string().nullable(),
  skills: z.string().nullable(),
  emailVerified: z.coerce.boolean(),
  image: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const UserPublicSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  role: UserRoleSchema,
  image: z.string().nullable(),
});

export type UserRole = z.infer<typeof UserRoleSchema>;
export type UserRow = z.infer<typeof UserRowSchema>;
export type UserPublic = z.infer<typeof UserPublicSchema>;
