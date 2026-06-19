import { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                name: string;
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
            return res.status(401).json({
                success: false,
                error: "UNAUTHORIZED",
                message: "Authentication required"
            });
        }

        req.user = session.user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            error: "UNAUTHORIZED",
            message: "Invalid session"
        });
    }
};

export const requireRoles = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: "UNAUTHORIZED",
                message: "Authentication required"
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: "FORBIDDEN",
                message: `Role '${req.user.role}' is not authorized. Required: ${allowedRoles.join(', ')}`
            });
        }

        next();
    };
};
