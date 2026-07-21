import { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth";
import { HTTP_STATUS, ERROR_CODES, MESSAGES } from "../constants.js";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                name: string;
                lastName: string;
                role: string;
            };
        }
    }
}

export const requireSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const session = await auth.api.getSession({
            headers: req.headers as HeadersInit
        });

        if (!session) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                error: ERROR_CODES.UNAUTHORIZED,
                message: MESSAGES.AUTHENTICATION_REQUIRED
            });
        }

        req.user = session.user;
        next();
    } catch (error) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            success: false,
            error: ERROR_CODES.UNAUTHORIZED,
            message: MESSAGES.INVALID_SESSION
        });
    }
};

export const requireRoles = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                error: ERROR_CODES.UNAUTHORIZED,
                message: MESSAGES.AUTHENTICATION_REQUIRED
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(HTTP_STATUS.FORBIDDEN).json({
                success: false,
                error: ERROR_CODES.FORBIDDEN,
                message: `Role '${req.user.role}' is not authorized. Required: ${allowedRoles.join(', ')}`
            });
        }

        next();
    };
};
