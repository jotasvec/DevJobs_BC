import * as z from 'zod'

const technologySchema = z.object({
    name: z.string()
        .min(1, 'Name is required')
        .max(100, 'Name must be less than 100 characters'),
    category: z.string()
        .min(1, 'Category is required')
        .max(50, 'Category must be less than 50 characters')
})

const technologyUpdateSchema = technologySchema.partial()

export function validateTechnology(input) {
    return technologySchema.safeParse(input)
}

export function validateTechnologyUpdate(input) {
    return technologyUpdateSchema.safeParse(input)
}

export function validateTechnologyId(id) {
    const uuidSchema = z.string().uuid()
    return uuidSchema.safeParse(id)
}