import { z } from 'zod'


export const jobsData = z.object({
    level: z.string(),
    modality: z.string(), 
    technology: z.preprocess((val) => {
        if(typeof val === 'string') return val.split(',').map(t => t.trim()).filter(Boolean)
        if(Array.isArray(val)) return val
        return []
    }, z.array(z.string()))
}).partial()

export const jobsContent = z.object({
        description: z.string(),
        responsibilities: z.string(),
        requirements: z.string(),
        about: z.string(),
}).partial()

export const jobsBaseSchema = z.object({
    title: z.string({
        error: 'Insert a title',
    })
        .min(5, 'the title should have at least 5 characters')
        .max(30, 'the title should have max 30 characters'),
    location: z.string({ error: 'Location is required' }),
    description: z.string({ error: 'Description is required' }),
    companyId: z.string({ error: 'Company is required' }).uuid(),
})


export const jobSchema = jobsBaseSchema.extend({
    data: jobsData,
    content: jobsContent
})  


// export const  validateJob = (input : ZodAnyDef) => jobSchema.safeParse(input)

// export const validatePartialJob = (input: ZodAnyDef) =>  jobSchema.partial().safeParse(input)

export const PartialJobSchema = jobSchema.partial();

// export type JobInput = z.infer<typeof jobSchema>;
// export type PartialJobInput = z.infer<typeof PartialJobSchema>;
