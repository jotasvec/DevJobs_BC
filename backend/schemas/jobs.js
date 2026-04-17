import * as z from 'zod'

const jobSchema = z.object({
    title: z.string({
        error: 'Insert a title'
    })
        .min(5, 'the title should have at least 5 characters')
        .max(50, 'the title should have max 30 characters'),
    company: z.string(),
    location: z.string(),
    description: z.string(),
    data:z.object({
        technology: z.array(z.string()),
        level: z.string(),
        mode: z.string(), 
    }),
    content:z.object({
        description: z.string(),
        responsibilities: z.string(),
        requirements: z.string(),
        about: z.string(),
    }),
})  

export function validateJob(input){
    return jobSchema.safeParse(input)
}


export function validatePartialJob(input){
    return jobSchema.partial().safeParse(input)
}