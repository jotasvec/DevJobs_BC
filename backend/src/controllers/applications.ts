import { ApplicationDBResponse } from "@/schemas/applications";
import { ApiResponse } from "@/types";
import { RequestHandler } from "express-serve-static-core";


export class ApplicationsController {
    static getAll : RequestHandler<
        Record<string, never>,
        ApiResponse<ApplicationDBResponse>
    > = (req, res, next) => {
        try {
            const data = req.query;
        } catch (error: unknown) {
            
        }

    }
    static getById = () => {}

    static create = () => {}

    static update = () => {}

    static delete = () => {}

}