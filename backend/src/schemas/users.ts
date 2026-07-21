import * as z from "zod";
import { ROLES } from "../constants.js";

export const UserRoleSchema = z.enum([
  ROLES.SEEKER,
  ROLES.RECRUITER,
  ROLES.ADMIN,
]);

export const UserRowSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  lastName: z.string(),
  role: UserRoleSchema,
  bio: z.string().nullable(),
  emailVerified: z.coerce.boolean(),
  image: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const UserPublicSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  lastName: z.string(),
  role: UserRoleSchema,
  image: z.string().nullable(),
});

export type UserRole = z.infer<typeof UserRoleSchema>;
export type UserRow = z.infer<typeof UserRowSchema>;
export type UserPublic = z.infer<typeof UserPublicSchema>;
