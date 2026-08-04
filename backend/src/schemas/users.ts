import * as z from "zod";
import { ROLES } from "../constants.js";

export const UserRoleSchema = z.enum([
  ROLES.SEEKER,
  ROLES.RECRUITER,
  ROLES.ADMIN,
]);

export const UserRowSchema = z.object({
  id: z.string(),
  name: z.string(),
  lastName: z.string(),
  email: z.string(),
  emailVerified: z.coerce.boolean(),
  phone: z.string().nullable(),  
  role: UserRoleSchema,
  bio: z.string().nullable(),
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
  bio: z.string().nullable(),

});

export type UserRole = z.infer<typeof UserRoleSchema>;
export type UserRow = z.infer<typeof UserRowSchema>;
export type UserPublic = z.infer<typeof UserPublicSchema>;
