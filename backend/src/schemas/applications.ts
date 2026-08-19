import { APPLICATION_STATUS } from "@/constants";
import { z } from "zod";
import { UserPublicSchema } from "./users";


// reusable
export const ApplicationStatus = z.enum(Object.values(APPLICATION_STATUS));

// based schema DB 1-1
export const ApplicationDBSchema = z.object({
    id: z.string(),
    user_id: z.string(),
    job_id: z.string(),

    // Snapshot (it may be null)
    contact_email: z.string().email().nullable(),
    contact_phone: z.string().nullable(),
    resume_url: z.string().url().nullable(),
    portfolio_url: z.string().url().nullable(),
    cover_letter: z.string().nullable(),

    status: ApplicationStatus,

    recruiter_notes: z.string().nullable(),

    reviewed_at: z.string().datetime().nullable(),
    recruiter_archived_at: z.string().datetime().nullable(),
    seeker_archived_at: z.string().datetime().nullable(),
    
    created_at: z.string().datetime().nullable(),
    updated_at: z.string().datetime().nullable(),
    
});

export type ApplicationDBResponse = z.infer<typeof ApplicationDBSchema>

// update status and notes 
export const UpdateStatusSchema = z.object({
    status: ApplicationStatus,
    recruiter_notes: z.string().max(2000).optional().or(z.literal("")),
});

export type UpdateStatusInput = z.infer<typeof UpdateStatusSchema>;

export const CreateApplicationSchema = ApplicationDBSchema.pick({
    job_id: true,
    contact_email: true,
    contact_phone: true,
    resume_url: true,
    portfolio_url: true,
    cover_letter: true,
});

export type CreateApplicationInput = z.infer<typeof CreateApplicationSchema>;


//Joined data 
export const ApplicationWithSeekerSchema = UserPublicSchema.omit({
    id: true,
    role: true,
}) 
/* z.object({
    name: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    bio: z.string().nullable(),
    //skills: z.string().nullable(), // or can be z.array(z.string())
}); */

export const ApplicationWithJobSchema = z.object({
    title: z.string(),
    //company: z.string(),
    company_id: z.string().nullable().optional(),
    location: z.string(),
});

export const ApplicationRowBaseSchema = ApplicationDBSchema.omit({
    resume_url: true,
    portfolio_url: true,
    cover_letter: true,
    recruiter_notes: true,
    reviewed_at: true
}).extend({
    seeker: ApplicationWithSeekerSchema.optional(),
    job: ApplicationWithJobSchema.optional()
})

export const ApplicationSQLRowSchema = ApplicationRowBaseSchema.extend({
    seeker: z.string().nullable(),
    job: z.string().nullable(),
})

export const ApplicationDetailedSchema = ApplicationDBSchema.extend({
    seeker: ApplicationWithSeekerSchema.optional(),
    job: ApplicationWithJobSchema.optional()
})
export type ApplicationSQLRow = z.infer<typeof ApplicationSQLRowSchema>
export type ApplicationBase = z.infer<typeof ApplicationRowBaseSchema>
export type ApplicationDetailed = z.infer<typeof ApplicationDetailedSchema>