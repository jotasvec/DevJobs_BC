import { z } from 'zod'

export const jobSchema = z.object({
    title: z.string({
        error: 'Insert a title',
    })
        .min(5, 'the title should have at least 5 characters')
        .max(50, 'the title should have max 30 characters'),
    company: z.string({ error: 'Company is required' }),
    location: z.string({ error: 'Location is required' }),
    description: z.string({ error: 'Description is required' }),
    data:z.object({
        technology: z.array(z.string()),
        level: z.string(),
        modality: z.string(), 
    }).partial(),
    content:z.object({
        description: z.string(),
        responsibilities: z.string(),
        requirements: z.string(),
        about: z.string(),
    }).partial(),
})  


// export const  validateJob = (input : ZodAnyDef) => jobSchema.safeParse(input)

// export const validatePartialJob = (input: ZodAnyDef) =>  jobSchema.partial().safeParse(input)

export const PartialJobSchema = jobSchema.partial();

export type JobInput = z.infer<typeof jobSchema>;
export type PartialJobInput = z.infer<typeof PartialJobSchema>;
