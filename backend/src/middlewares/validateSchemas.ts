import { RequestHandler } from "express";
import { error } from "node:console";
import { ZodError, ZodType } from "zod";

export const validateSchemas  = (schema: ZodType) : RequestHandler => {

    return (req, res, next) => {
        try {
            req.body = schema.parse(req.body) // <- return validated and clean data
            //if all is good -> controller
            next()
        } catch (error) {
            // if error comes from Zod, 
            if (error instanceof ZodError) {
                
                res.status(400).json({
                    error: 'Invalid Creation Request', 
                    details: error.message
                })
                return;
            }
            // if the error is any other thing, then express can handle it 
            next(error)
        }
    };
};