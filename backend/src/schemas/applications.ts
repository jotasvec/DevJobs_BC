import { z } from "zod";


// reusable
export const ApplicationStatus = z.enum([
    'pending', 
    'reviewed', 
    'shortlisted', 
    'accepted', 
    'rejected', 
    'withdrawn'
]);

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


//Joined data 
export const ApplicationWithSeekerSchema = ApplicationDBSchema.extend({
    seeker: z.object({
        name: z.string(),
        lastName: z.string(),
        email: z.string().email(),
        bio: z.string().nullable(),
        skills: z.string().nullable(), // o z.array(z.string()) si parseas JSON
    })
});

export const ApplicationWithJobSchema = ApplicationDBSchema.extend({
    job: z.object({
        title: z.string(),
        company_name: z.string(),
    })
});


// update status and notes 
export const UpdateStatusSchema = z.object({
    status: ApplicationStatus,
    recruiter_notes: z.string().max(2000).optional().or(z.literal("")),
});

export type UpdateStatusInput = z.infer<typeof UpdateStatusSchema>;

export const CreateApplicationSchema = ApplicationDBSchema.pick({
    user_id: true,
    job_id: true,
    contact_email: true,
    contact_phone: true,
    resume_url: true,
    portfolio_url: true,
    cover_letter: true,
});

export type CreateApplicationInput = z.infer<typeof CreateApplicationSchema>;