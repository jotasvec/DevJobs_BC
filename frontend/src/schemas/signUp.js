import { z } from "zod";

export const signUpSchema = z.object({
    name: z.string().nonempty().min(10, "Name is required"),
    email: z
        .string()
        .email("Invalid email")
        .min(1, 'Email is required'),
        /* .refine(async (e) => {
            const emails = await fetchEmails();
            return emails.includes(e);
        }, "This email is not in our database"), */
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(25, 'Password must have max 25 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*-])[A-Za-z\d!@#$%&*-]{8,}$/),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})
