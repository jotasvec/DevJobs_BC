import { NextFunction, Response, Request } from "express"
import { ApiResponse } from "../types/index.js"

export const handleHttpError = (
    error: unknown, 
    req: Request, 
    res: Response<ApiResponse<never>>, 
    next: NextFunction
) => {
    if (error instanceof Error) {
        switch (error.message) {
            case "NOT_FOUND":
                return res.status(404).json({
                    success: false,
                    error: error.message,
                    message: `not found`
                })

            case "UNKNOWN_TECHNOLOGY":
                return res.status(409).json({
                    success: false,
                    error: error.message,
                    message: `invalid technology`
                })

            case "NO_FIELDS_PROVIDED":
                return res.status(400).json({
                    success: false,
                    error: error.message,
                    message: `no fields provided to update`
                })
            case "DUPLICATED_TECHNOLOGY":
                return res.status(409).json({ 
                        success: false, 
                        error: error.message,
                        message: `Technology "${req.body.name}" already exists` 

                    });
            case "INVALID_CATEGORY":
                return res.status(409).json({ 
                    success: false, 
                    error: error.message,
                    message: `invalid category` 

                });
            case "FAILED_TO_CREATE":
                return res.status(409).json({ 
                    success: false, 
                    error: error.message,
                    message: `Fail on creation` 

                });
            default: return next(error)
        }
    }
    next(error)
}