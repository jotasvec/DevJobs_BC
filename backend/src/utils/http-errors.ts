import { NextFunction, Response, Request } from "express"
import { ApiResponse } from "../types/index.js"
import { HTTP_STATUS, ERROR_CODES } from "../constants.js"

export const handleHttpError = (
    error: unknown,
    req: Request,
    res: Response<ApiResponse<never>>,
    next: NextFunction
) => {
    if (error instanceof Error) {
        switch (error.message) {
            case ERROR_CODES.NOT_FOUND:
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    error: error.message,
                    message: `not found`
                })

            case "UNKNOWN_TECHNOLOGY":
                return res.status(HTTP_STATUS.CONFLICT).json({
                    success: false,
                    error: error.message,
                    message: `invalid technology`
                })

            case ERROR_CODES.NO_FIELDS_PROVIDED:
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    error: error.message,
                    message: `no fields provided to update`
                })
            case ERROR_CODES.DUPLICATED_TECHNOLOGY:
                return res.status(HTTP_STATUS.CONFLICT).json({
                        success: false,
                        error: error.message,
                        message: `Technology "${req.body.name}" already exists`

                    });
            case ERROR_CODES.INVALID_CATEGORY:
                return res.status(HTTP_STATUS.CONFLICT).json({
                    success: false,
                    error: error.message,
                    message: `invalid category`

                });
            case ERROR_CODES.FAILED_TO_CREATE:
                return res.status(HTTP_STATUS.CONFLICT).json({
                    success: false,
                    error: error.message,
                    message: `Fail on creation`

                });
            default: return next(error)
        }
    }
    next(error)
}