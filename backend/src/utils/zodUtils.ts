import { z } from "zod";


/**
 * get keys from zod schemas, to use them lately as strings separete with comma
 * */  
export const getZodKeys = 
    <T extends z.ZodRawShape>(schema: z.ZodObject<T>):string => {
    return Object.keys(schema.shape).join(', ')
}


export const getZodKeysWithPrefix = <T extends z.ZodRawShape>(
        schema: z.ZodObject<T>, 
        prefix: string
    ) :string => {
    return Object.keys(schema.shape).map(key => `${prefix}.${key}`).join(',')
}
