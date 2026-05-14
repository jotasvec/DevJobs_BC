import crypto from 'node:crypto'
import db from '../db/database.js'
import { DEFAULTS } from '../config.js'
import { JobInput } from '../schemas/jobs.js'
import { Job, JobQuery } from '../types/jobs.js'

interface JobTechnologyResult {
    id: string
    title: string
    company: string
    location: string
    description: string
    created_at: string
    level: string
    modality: string
    technologies: string
    content: string
}

interface UpdateResult {
    success: boolean
    changes?: number
    fields?: string[]
    error?: string
    unknownTechnologies?: string[]
    message?: string
    updates?: {
        job: UpdateResult
        jobContent: UpdateResult
        jobTechnologies: UpdateResult
    }
    totalChanges?: number
}

interface PartialJobInput {
    title?: string
    company?: string
    location?: string
    description?: string
    data?: {
        technology?: string[]
        level?: string
        modality?: string
    }
    content?: {
        description?: string
        responsibilities?: string
        requirements?: string
        about?: string
    }
}

export class JobModel {
    static #resolveTechnologyId(techNameOrId: string): string | null {
        if (!techNameOrId) return null
        
        if (techNameOrId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
            return techNameOrId
        }
        
        const tech = db.prepare(
            'SELECT id FROM technologies WHERE LOWER(name) = ?'
        ).get(techNameOrId.toLowerCase()) as { id: string } | undefined
        
        return tech?.id || null
    }

    static getAll(data: JobQuery): { total: number; limit: number; offset: number; results: number; data: Job[] } {
        const { text, title, level, technology, location, modality, limit = DEFAULTS.LIMIT_PAGINATION, offset = DEFAULTS.LIMIT_OFFSET } = data
        
        let query = `
            SELECT j.*,
                json_group_array(t.name) as technologies,
                json_object (
                    'description', jc.description, 
                    'responsibilities', jc.responsibilities,
                    'requirements', jc.requirements,
                    'about', jc.about
                    ) as content
            FROM jobs j
            LEFT JOIN job_technologies jt ON j.id = jt.job_id
            LEFT JOIN technologies t ON jt.technology_id = t.id
            LEFT JOIN job_contents jc ON j.id = jc.job_id
        `

        const params: (string | number)[] = []
        const conditions: string[] = []

        if (title) {
            conditions.push('j.title LIKE ?')
            params.push(`%${title}%`)
        }

        if (level) {
            conditions.push('j.level = ?')
            params.push(level)
        }

        if (technology) {
            conditions.push("j.id IN ( SELECT job_id FROM job_technologies jt JOIN technologies t ON jt.technology_id = t.id WHERE t.name LIKE ? )")
            params.push(`%${technology}%`)
        }
        
        if (location) {
            conditions.push('j.location LIKE ?')
            params.push(`%${location}%`)
        }
        
        if (modality) {
            conditions.push('j.modality = ?')
            params.push(modality)
        }

        if (text) {
            conditions.push('j.title LIKE ? OR j.description LIKE ? ')
            params.push(`%${text}%`, `%${text}%`)
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ')
        }

        const total = db.prepare(query + ' GROUP BY j.id ').all(...params) as JobTechnologyResult[]
        
        const limitNumber = Number(limit)
        const offsetNumber = Number(offset)
        
        query += ' GROUP BY j.id LIMIT ? OFFSET ? '
        params.push(limitNumber, offsetNumber)
    
        const jobs = db.prepare(query).all(...params) as JobTechnologyResult[]
        
        const resultData = jobs.map(job => ({
            id: job.id,
            title: job.title,
            company: job.company,
            location: job.location,
            description: job.description,
            created_at: job.created_at,
            data: {
                level: job.level as 'junior' | 'mid' | 'senior',
                modality: job.modality as 'remote' | 'onsite' | 'hybrid',
                technology: job.technologies ? JSON.parse(job.technologies) : [],
            },
            content: job.content ? JSON.parse(job.content) : null,
        }))

        return { 
            total: total.length,
            limit: limitNumber,
            offset: offsetNumber,
            results: resultData.length,
            data: resultData
        }
    }

    static getJobById(id: string): Job | null {
        const query = `
            SELECT j.*,
                json_group_array(t.name) as technologies,
                json_object (
                    'description', jc.description, 
                    'responsibilities', jc.responsibilities,
                    'requirements', jc.requirements,
                    'about', jc.about
                    ) as content
            FROM jobs j
            LEFT JOIN job_technologies jt ON j.id = jt.job_id
            LEFT JOIN job_contents jc ON j.id = jc.job_id
            LEFT JOIN technologies t ON jt.technology_id = t.id
            WHERE j.id = ?
            GROUP BY j.id
        `    
        const job = db.prepare(query).get(id) as JobTechnologyResult | undefined 

        return !job ? null : {
            id: job.id,
            title: job.title,
            company: job.company,
            location: job.location,
            description: job.description,
            created_at: job.created_at,
            data: {
                level: job.level as 'junior' | 'mid' | 'senior',
                modality: job.modality as 'remote' | 'onsite' | 'hybrid',
                technology: job.technologies ? JSON.parse(job.technologies) : [],
            },
            content: job.content ? JSON.parse(job.content) : null,
        }
    }

    static create(input: Omit<JobInput, 'modality' | 'level' | 'technologies'> & { 
        modality?: string; 
        level?: string; 
        technologies?: string[];
        content?: JobInput['content'];
    }): Job {
        const { title, company, location, description, modality, level, technologies, content } = input

        const id = crypto.randomUUID()
        const createdAt = new Date().toISOString()

        const insertJob = db.prepare(`
            INSERT INTO jobs (id, title, company, location, description, modality, level, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `)
        const insertJobTechnology = db.prepare(`
            INSERT INTO job_technologies (id, job_id, technology_id)
            VALUES (?, ?, ?)
        `)
        const insertContent = db.prepare(`
            INSERT INTO job_contents (id, job_id, description, responsibilities, requirements, about)
            VALUES (?, ?, ?, ?, ?, ?)
        `)

        const techErrors: string[] = []
        const techIds: string[] = []
        
        if (technologies && Array.isArray(technologies)) {
            for (const tech of technologies) {
                const techId = JobModel.#resolveTechnologyId(tech)
                if (techId) {
                    techIds.push(techId)
                } else {
                    techErrors.push(tech)
                }
            }
            
            if (techErrors.length > 0) {
                throw new Error(`Technologies not found: ${techErrors.join(', ')}. Use GET /technologies to see available options.`)
            }
        }

        const transaction = db.transaction(() => {
            insertJob.run(id, title, company, location, description, modality, level, createdAt)

            if (content) {
                insertContent.run(
                    crypto.randomUUID(),
                    id,
                    content.description || null,
                    content.responsibilities || null,
                    content.requirements || null,
                    content.about || null
                )
            }

            if (techIds.length > 0) {
                for (const techId of techIds) {
                    insertJobTechnology.run(
                        crypto.randomUUID(),
                        id,
                        techId
                    )
                }
            }
        })
        transaction()

        const result = this.getJobById(id)
        if (!result) throw new Error('FAILED_TO_CREATE')
        return result
    }

    static #buildAndExecuteUpdate(tableName: string, id: string, fieldsObj: Record<string, unknown>): UpdateResult {
        const fields: string[] = []
        const params: (string | null | number)[] = []
        
        for (const [key, value] of Object.entries(fieldsObj)) {
            if (value !== undefined && value !== null) {
                fields.push(`${key} = ?`)
                params.push(value as string | number | null)
            }
        }
        
        if (fields.length === 0) return { success: false }
        
        const whereClause = tableName === 'job_technologies' ? 'job_id' : 'id'
        const query = `UPDATE ${tableName} SET ${fields.join(', ')} WHERE ${whereClause} = ?`
        params.push(id)
        
        const result = db.prepare(query).run(...params)
        
        return { success: true, changes: result.changes }
    }

    static partialUpdateJob(id: string, fields: Partial<JobInput>): UpdateResult {
        const { title, company, location, description, data, content } = fields

        const partialUpdateDetails = {
            job: { success: false, changes: 0, fields: [] as string[] },
            jobContent: { success: false, changes: 0, fields: [] as string[] },
            jobTechnologies: { success: false, changes: 0, fields: [] as string[] }
        }

        const jobFields: Record<string, string> = {}
        if (title) jobFields.title = title
        if (company) jobFields.company = company
        if (location) jobFields.location = location
        if (description) jobFields.description = description
        if (data?.level) jobFields.level = data.level
        if (data?.modality) jobFields.modality = data.modality

        const jobResult = JobModel.#buildAndExecuteUpdate('jobs', id, jobFields)
        partialUpdateDetails.job = { ...jobResult, changes: jobResult.changes ?? 0, fields: [] }

        if (content) {
            const contentResult = JobModel.#buildAndExecuteUpdate('job_contents', id, content as Record<string, unknown>)
            partialUpdateDetails.jobContent = { ...contentResult, changes: contentResult.changes ?? 0, fields: [] }
        }

        if (data?.technology && Array.isArray(data.technology)) {
            const techErrors: string[] = []
            const techIds: string[] = []
            
            for (const techName of data.technology) {
                const techId = JobModel.#resolveTechnologyId(techName)
                if (techId) {
                    techIds.push(techId)
                } else {
                    techErrors.push(techName)
                }
            }
            
            if (techErrors.length > 0) {
                return {
                    success: false,
                    error: 'Technology not found',
                    unknownTechnologies: techErrors,
                    message: `Technologies not found: ${techErrors.join(', ')}. Use GET /technologies to see available options.`,
                    updates: partialUpdateDetails
                }
            }

            db.prepare('DELETE FROM job_technologies WHERE job_id = ?').run(id)
            let insertedCount = 0
            const insertTech = db.prepare('INSERT INTO job_technologies (id, job_id, technology_id) VALUES (?, ?, ?)')
            for (const techId of techIds) {
                insertTech.run(crypto.randomUUID(), id, techId)
                insertedCount++
            }
            
            partialUpdateDetails.jobTechnologies = {
                success: true,
                changes: insertedCount,
                fields: data.technology
            }
        }

        const hasUpdates = partialUpdateDetails.job.success || 
                          partialUpdateDetails.jobContent.success || 
                          partialUpdateDetails.jobTechnologies.success

        if (!hasUpdates) return {
            success: false,
            message: 'No valid fields to update',
            updates: partialUpdateDetails
        }

        const totalChanges = 
            partialUpdateDetails.job.changes + 
            partialUpdateDetails.jobContent.changes + 
            partialUpdateDetails.jobTechnologies.changes

        return {
            success: true,
            totalChanges,
            message: 'Job updated successfully',
            updates: partialUpdateDetails
        }
    }

    static deleteJob(id: string): boolean {
        const result = db.prepare('DELETE FROM jobs WHERE id = ?').run(id)
        return result.changes > 0
    }
}