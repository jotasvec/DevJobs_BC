import { APPLICATION_STATUS, ERROR_CODES } from "@/constants"
import db from "@/db/database"
import { ApplicationBase, ApplicationDBResponse, ApplicationDBSchema, ApplicationDetailed, ApplicationDetailedSchema, ApplicationRowBaseSchema, ApplicationSQLRow, ApplicationWithJobSchema, ApplicationWithSeekerSchema, CreateApplicationInput, CreateApplicationSchema, UpdateStatusInput } from "@/schemas/applications"
import { ApplicationFilters, ApplicationStats } from "@/types/applications"
import { handleDBError } from "@/utils/db-errors"
import { getZodKeys, getZodKeysAsJsonObject, getZodKeysWithPrefix } from "@/utils/zodUtils"

const APPLICATION_FIELDS = getZodKeys(ApplicationDBSchema)
const CREATE_FIELDS = getZodKeys(CreateApplicationSchema)

export class ApplicationModel {
    static getAll = ( filters: ApplicationFilters = {} ) : {
        total: number,
        offset: number,
        limit: number, 
        results: number,
        data: ApplicationBase[], 
    } => {
        const { userId, jobId, status, limit=10, offset=0 } = filters


        let clause = ''
        const params: (string | number)[] = []
        if (userId) {
            clause += ' AND a.user_id = ?';
            params.push(userId)
        }
        if (jobId) {
            clause += ' AND a.job_id = ?';
            params.push(jobId)
        }
        if (status) {
            clause += ' AND a.status = ?';
            params.push(status)
        }
        const countSql = `SELECT COUNT(*) as total FROM applications a WHERE 1=1 ${clause}`
        const { total } = db.prepare(countSql).get(...params) as { total: number}

        const sql = `
            SELECT 
                ${getZodKeysWithPrefix(ApplicationRowBaseSchema.omit({seeker: true, job: true}), 'a')},
                json_object (${getZodKeysAsJsonObject(ApplicationWithSeekerSchema, 'u')} ) as seeker,
                json_object (${getZodKeysAsJsonObject(ApplicationWithJobSchema, 'j')} ) as job
            FROM applications a
            LEFT JOIN user u ON a.user_id = u.id
            LEFT JOIN jobs j ON a.job_id = j.id
            WHERE 1=1 ${clause}
            ORDER BY a.created_at DESC
            LIMIT ? OFFSET ?
        `
        params.push(limit, offset)

        const query = db.prepare(sql).all(...params) as ApplicationSQLRow[]
        const data: ApplicationBase[] = query.map(row => ({
            id: row.id,
            user_id: row.user_id,
            job_id: row.job_id,
            contact_email: row.contact_email,
            contact_phone: row.contact_phone,
            recruiter_archived_at: row.recruiter_archived_at,
            seeker_archived_at: row.seeker_archived_at,
            updated_at: row.updated_at,
            created_at: row.created_at,
            status: row.status,
            seeker: row.seeker ? JSON.parse(row.seeker) : null,
            job: row.job ? JSON.parse(row.job) : null
        }))

        return { 
            total: total,
            limit: limit, 
            offset: offset,
            results: data.length,
            data: data, 
        }
    }

    static getById = (id: string) : ApplicationDetailed | null => {
        const sql = `
            SELECT 
                ${getZodKeysWithPrefix(ApplicationDBSchema, 'a')},
                json_object(${getZodKeysAsJsonObject(ApplicationWithSeekerSchema, 'u')}) as seeker,
                json_object(${getZodKeysAsJsonObject(ApplicationWithJobSchema, 'j')}) as job
            FROM applications a
            LEFT JOIN user u ON a.user_id = u.id
            LEFT JOIN jobs j ON a.job_id = j.id
            WHERE id = ?
            ORDER BY a.created_at DESC
        `
        const row = db.prepare(sql).get(id) as ApplicationSQLRow | undefined; //check here in case of error
        
        if(!row) return null;
        return {
            ...row,
            seeker: row.seeker ? JSON.parse(row.seeker) : null,
            job: row.job ? JSON.parse(row.job) : null
        } as ApplicationDetailed
    
    }

   /*  static getByJobId = (id: string) : ApplicationDBResponse[] => {
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
    } */

    static create = (user_id: string, data : CreateApplicationInput ) : {id: string, status: string}  => {
            const id = crypto.randomUUID();
            const keysArray = Object.keys(CreateApplicationSchema.shape)
            const placeholders = ['?, ?', ...keysArray.map(() => '?')].join(', ')
            const sql = `
                INSERT INTO applications ( 
                    ${'id, user_id, ' + CREATE_FIELDS}
                )
                VALUES (${placeholders} )
            `
            try {
                db.prepare(sql).run(
                    id,
                    user_id,
                    data.job_id,
                    data.contact_email,
                    data.contact_phone || null,
                    data.resume_url,
                    data.portfolio_url || null,
                    data.cover_letter || null,
                );

                return {
                    id: id,
                    status: 'pending'
                }

            } catch (err: unknown) {
                return handleDBError(err)
            }


        
    }

    static updateStatusAndNotes = (id: string, recruiter_id: string ,fields : UpdateStatusInput) => {
        const { status, recruiter_notes } = fields
        const validApplicationQuery = `
            SELECT a.id
            FROM applications a 
            JOIN jobs j ON a.job_id = j.id
            WHERE a.id = ? AND j.created_by = ?
        ` 
        const validApplication = db.prepare(validApplicationQuery).get(id, recruiter_id )
        if(!validApplication) throw new Error("You can't edit this Application");
        
        const sql = `
            UPDATE applications
            SET status = ?,
            recruiter_notes = ?,
            reviewed_at = CASE WHEN reviewed_at IS NULL THEN CURRENT_TIMESTAMP ELSE reviewed_at END,
            updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `

        try {
            const update = db.prepare(sql).run(status, recruiter_notes || null, id)
            if (update.changes === 0) throw new Error("Application Not Found");
            
            return this.getById(id) as ApplicationDetailed
            
        } catch (err: unknown) {
            handleDBError(err)
        }

    }
    
    // archived
    static delete = (id: string, user_id: string)  => {
        // set as archev by recruiter when the job is deleted/removed
        const validApplicationQuery = `
            SELECT id
            FROM applications
            WHERE id = ?
            AND  user_id = ?
        ` 
        const validApplication = db.prepare(validApplicationQuery).get(id, user_id )
        if(!validApplication) throw new Error("You can't edit this Application");
        
        const sql = `
            UPDATE applications
            SET 
            seeker_archived_at = CURRENT_TIMESTAMP,
            status = '${APPLICATION_STATUS.WITHDRAWN}'
            WHERE id = ?
        `

        try {
            const update = db.prepare(sql).run(id)
            if (update.changes === 0) throw new Error("Application Not Found");
            
            return { success: true, message: 'Application deleted correctly' }
            
        } catch (err: unknown) {
            handleDBError(err)
        }

    }

    static getStats = ( jobId: string ) : ApplicationStats => {
        const cases = Object.values(APPLICATION_STATUS)
                    .map(element => `SUM(CASE WHEN status = '${element}' THEN 1 ELSE 0 END) as ${element}`)
                    .join(',');
        const sql = `
            SELECT 
                ${ cases }, 
                COUNT(*) as total
            FROM applications
            WHERE job_id = ?
        `
        return db.prepare(sql).get(jobId) as ApplicationStats
        
    }

    static getCreatedBy(jobId: string): string | null {
        const job = db.prepare('SELECT created_by FROM jobs WHERE id = ?').get(jobId) as { created_by: string } | undefined;
        return job?.created_by ?? null;
    }
}