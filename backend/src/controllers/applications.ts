import { ERROR_CODES, HTTP_STATUS, MESSAGES, ROLES } from "@/constants";
import db from "@/db/database";
import { ApplicationModel } from "@/models/application";
import { ApplicationBase, ApplicationDBResponse, ApplicationDetailed, CreateApplicationInput, UpdateStatusInput } from "@/schemas/applications";
import { ApiResponse, PaginatedResponse } from "@/types";
import { ApplicationFilters, ApplicationStats } from "@/types/applications";
import { handleHttpError } from "@/utils/http-errors";
import { RequestHandler } from "express-serve-static-core";



export class ApplicationsController {
    static getAll : RequestHandler<
        Record<string, never>,
        ApiResponse<PaginatedResponse<ApplicationBase>>
    > = (req, res, next) => {
        try {
            const user = req.user;
            if(!user) return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                error: ERROR_CODES.UNAUTHORIZED,
                message: "User not authenticated",
            });
            const { jobId, status, limit, offset } = req.query;
            const filters:ApplicationFilters = {
                jobId: jobId as string | undefined,
                status: status as string | undefined,
                limit: limit ? Number(limit) : 10,
                offset: offset ? Number(offset) : 0,
            } 

            // Ownership enforcement:
            // - Seeker: can only see own applications (force userId)
            // - Recruiter: can only see applications for jobs they created (handled via jobId filter)
            // - Admin: can see all
            if (user.role === ROLES.SEEKER) {
                filters.userId = user.id;
            }


            const applications = ApplicationModel.getAll(filters)
            return res.status(HTTP_STATUS.OK).json({
                success:true,
                data: applications,
            })
        } catch (err: unknown) {
            handleHttpError(err, req, res, next)
            
        }

    }
    static getById : RequestHandler<
        Record<string, never>,
        ApiResponse<ApplicationDetailed>
    > = (req, res, next) => {
        const { id } = req.params
        const user = req.user
        
        if(!user) return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            success: false,
            error: ERROR_CODES.UNAUTHORIZED,
            message: "User not authenticated",
        });
        try {
            const data = ApplicationModel.getById(id)

            if (!data) return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                error: ERROR_CODES.NOT_FOUND,
                message: "Failed to find the application",
            });

            // Ownership check
            if(user.role === ROLES.SEEKER && data.user_id !== user.id) return res.status(HTTP_STATUS.FORBIDDEN).json({
                success: false,
                error: ERROR_CODES.FORBIDDEN,
                message: "You don't have permission to view this application",
            });

            if (user.role === ROLES.RECRUITER) {
            // Recruiter must own the job
            const job = db.prepare('SELECT created_by FROM jobs WHERE id = ?').get(data.job_id) as { created_by: string } | undefined;
                if (!job || job.created_by !== user.id) {
                    return res.status(HTTP_STATUS.FORBIDDEN).json({
                        success: false,
                        error: ERROR_CODES.FORBIDDEN,
                        message: "You don't have permission to view this application",
                    });
                }
            }
            // Admin passes through

            return res.status(HTTP_STATUS.OK).json({
                success: true,
                data: data
            })
        } catch (err) {
            handleHttpError(err, req, res, next)
        }
    }


/*     static getByJobId : RequestHandler<
        Record<string, never>,
        ApiResponse<ApplicationDBResponse[]>
    > = (req, res, next) => {
        const { job_id } = req.body
        const user = req.user?.id
        if(!user) return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            success: false,
            error: ERROR_CODES.UNAUTHORIZED,
            message: "User not authenticated",
        });

        try {
            const data = ApplicationModel.getByJobId(job_id)

            if (!data) return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                error: ERROR_CODES.NOT_FOUND,
                message: "Failed to find the application",
            });

            return res.status(HTTP_STATUS.OK).json({
                success: true,
                data: data
            })
        } catch (err) {
            handleHttpError(err, req, res, next)
        }
    }
 */




    static create : RequestHandler<
        Record<string, never>,
        ApiResponse<{id: string, status: string}>,
        CreateApplicationInput
    > = (req, res, next) => {
        const user_id = req.user?.id;
        const body = req.body;

        if (!user_id) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                error: ERROR_CODES.UNAUTHORIZED,
                message: "User not authenticated",
            });
        }

        try {
            const newApplication = ApplicationModel.create(user_id, body)
            if(!newApplication) return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: ERROR_CODES.FAILED_TO_CREATE,
                message: "Failed to create application",
            });

            return res.json({
                success: true,
                message: MESSAGES.APPLICATION_CREATED,
                data: newApplication
            })
        } catch (err: unknown) {
            handleHttpError(err, req, res, next)
        }

    }

    static update : RequestHandler<
        Record<string, never>,
        ApiResponse<ApplicationDetailed>,
        UpdateStatusInput
        > = (req, res, next) => {
            const id = req.params.id
            const { status, recruiter_notes } = req.body
            const user = req.user
           
            if (user?.role !== ROLES.RECRUITER && user?.role !== ROLES.ADMIN) return res.status(HTTP_STATUS.FORBIDDEN).json({
                success: false,
                error: ERROR_CODES.FORBIDDEN,
                message: "not allowed to update this application",
            });
            try {

                const response = ApplicationModel.updateStatusAndNotes(id, user.id, { status, recruiter_notes } )
                if (!response) return res.status(HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    error: ERROR_CODES.NOT_FOUND,
                    message: "Failed to find the application",
                });

                return res.status(HTTP_STATUS.OK).json({
                    success: true,
                    data: response
                })
            } catch (err) {
                handleHttpError(err, req, res, next)
            }
    }

    static delete : RequestHandler<
        { id: string, user_id: string },
        ApiResponse<never>
    > = (req, res, next) => {
        const { id } = req.params
        const user = req.user
        if(!user ) return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            success: false,
            error: ERROR_CODES.UNAUTHORIZED,
            message: "User not authenticated",
        });

        const application = ApplicationModel.getById(id)
        // Seeker: can only withdraw own
        if (user.role === ROLES.SEEKER && application?.user_id !== user.id) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
            success: false,
            error: ERROR_CODES.FORBIDDEN,
            message: "You can only withdraw your own applications",
        });
    }

        try {
            const deleted = ApplicationModel.delete(id, user.id);
            if (deleted) {
                return res.status(HTTP_STATUS.NO_CONTENT).json({
                    success: true,
                    message: MESSAGES.APPLICATION_DELETED,
                })
            }
        } catch (error: unknown) {
            handleHttpError(error, req, res, next)
        }

    }


    static getStats : RequestHandler<
        Record<string, never>,
        ApiResponse<ApplicationStats> 
    > = (req, res, next) => {
        const { jobId } = req.query
        const user = req.user

        if(!user || user.role === ROLES.SEEKER ) return res.status(HTTP_STATUS.FORBIDDEN).json({
            success: false,
            error: ERROR_CODES.FORBIDDEN,
            message: "Not Authorized",
        });

        if (!jobId) return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            error: ERROR_CODES.MISSING_REQUIRED_FIELDS,
            message: "jobId query parameter is required",
        });

        try {
            const stats = ApplicationModel.getStats(jobId as string)
            return res.status(HTTP_STATUS.OK).json({
                success: true,
                data: stats,
            });
        } catch (err: unknown) {
            handleHttpError(err, req, res, next)
        }

    }
}