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
        modality: z.string(), 
    }).partial(),
    content:z.object({
        description: z.string(),
        responsibilities: z.string(),
        requirements: z.string(),
        about: z.string(),
    }).partial(),
})  

const deepPartial = (schema) => {
    const partial = {}
    for (const key in schema.shape){
        const field = schema.shape[key]
        if (field instanceof z.ZodObject) {
            partial[key] = field.partial()
        } else {
            partial[key] = field.optional()     
        }
    }
    return z.object(partial)
}

export function validateJob(input){
    return jobSchema.safeParse(input)
}


export function validatePartialJob(input){
    return jobSchema.partial().safeParse(input)
    //return deepPartial(jobSchema).safeParse(input)

}