import { APPLICATION_STATUS, ERROR_CODES } from "@/constants"
import db from "@/db/database"
import { ApplicationDBResponse, ApplicationDBSchema, CreateApplicationSchema } from "@/schemas/applications"
import { ApplicationQuery } from "@/types/applications"
import { handleDBError } from "@/utils/db-errors"
import { getZodKeys } from "@/utils/zodUtils"

const APPLICATION_FIELDS = getZodKeys(ApplicationDBSchema)
const CREATE_FIELDS = getZodKeys(CreateApplicationSchema)

export class ApplicationModel {
    static getAll = (): ApplicationDBResponse[] => {

        const sql = `
            SELECT 
            ${APPLICATION_FIELDS}
            FROM applications
            ORDER BY created_at DESC
        `
        const query = db.prepare(sql).all();
        return query as ApplicationDBResponse[]
    }

    static getById = (id: string) : ApplicationDBResponse => {
        const sql = `
            SELECT 
            ${APPLICATION_FIELDS}
            FROM applications
            WHERE id = ?
        `
        return db.prepare(sql).get(id) as ApplicationDBResponse;
    }

    static getByJobId = (id: string) : ApplicationDBResponse[] => {
        const sql = `
            SELECT 
            ${APPLICATION_FIELDS}
            FROM applications
            WHERE job_id = ?
        `
        return db.prepare(sql).all(id) as ApplicationDBResponse[];
    }
    
    static getBySeekerId = (id: string) : ApplicationDBResponse[] => {
        const sql = `
            SELECT 
            ${APPLICATION_FIELDS}
            FROM applications
            WHERE user_id = ?
            ORDER BY created_at DESC
        `
        return db.prepare(sql).all(id) as ApplicationDBResponse[];
    }

    static create = ({
        userId,
        jobId,
        contact_email,
        contact_phone,
        resume_url,
        portfolio_url,
        cover_letter,
    } : ApplicationQuery )   => {
            const id = crypto.randomUUID();
            const createdAt = new Date().toISOString()
            const keysArray = Object.keys(CreateApplicationSchema.shape)
            const placeholders = keysArray.map(() => '?').join(', ')
            const sql = `
                INSERT INTO applications ( 
                    ${CREATE_FIELDS}
                )
                VALUES (${placeholders} )
            `
            try {
                db.prepare(sql).run(
                    id,
                    userId,
                    jobId,
                    contact_email,
                    resume_url,
                    contact_phone || null,
                    portfolio_url || null,
                    cover_letter || null,
                );
                const newApplication = this.getById(id)
                if(!newApplication) throw new Error(ERROR_CODES.FAILED_TO_CREATE);
                return newApplication

            } catch (err: unknown) {
                return handleDBError(err)
            }


        
    }

    static updateStatusAndNotes = (id: string, status: string, notes: string)  => {

    }
    
    // archived
    static delete = (id: string)  => {
        // set as archev by recruiter when the job is deleted/removed
        
    } 
}