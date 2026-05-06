//import jobs from '../data.json' with { type: 'json' }
import { db } from '../db/database.js'
import { DEFAULTS as DEF } from "../config.js";


export class JobModel{
    static async getAll({text, title, level, technology, location, modality, limit = DEF.LIMIT_PAGINATION, offset = DEF.LIMIT_OFFSET}){
        // let fileteredJobs = jobs;
        // base query
        let query = `
            SELECT j.*,
                json_group_array(jt.technology) as technologies,
                json_object (
                    'description', jc.description, 
                    'responsibilities', jc.responsibilities,
                    'requirements', jc.requirements,
                    'about', jc.about
                    ) as content
            FROM jobs j
            LEFT JOIN job_technologies jt ON j.id = jt.job_id
            LEFT JOIN job_contents jc ON j.id = jc.job_id
        `

        const params = []
        const conditions = []

        /* if(title) {
            const searchTerm = title.toLowerCase();
            fileteredJobs = fileteredJobs.filter( job => 
                job.titulo.toLowerCase().includes(searchTerm)
                );
                } */
        // replazing with dinamic filters.     
        if(title){
            conditions.push("j.title LIKE ?")
            params.push(`%${title}%`)
        }  

        if(level){
            conditions.push("j.level = ?")
            params.push(`${level}`)
        }

        if(technology) {
            conditions.push("j.id IN ( SELECT job_id FROM job_technologies WHERE technology LIKE ? )")
            params.push(`%${technology}%`)
        }
        if(location) {
            conditions.push("j.location LIKE ?")
            params.push(`%${location}%`)
        }
        if(modality){
            conditions.push('j.modality = ?')
            params.push(modality)
        }

        if(text){
            conditions.push('j.title LIKE ? OR j.description LIKE ? ')
            params.push(`%${text}%`, `%${text}%`)
        }
    
        /* if(text) {
            const searchTerm = text.toLowerCase();
            fileteredJobs = fileteredJobs.filter( job => 
                job.titulo.toLowerCase().includes(searchTerm) ||
                job.descripcion.toLowerCase().includes(searchTerm) 
            );
        } */

        if(conditions.length > 0){
            query += " WHERE " + conditions.join(" AND ") 
        }

        const total = db.prepare(query + "GROUP BY j.id ").all(...params)
        
        const limitNumber = Number(limit);
        const offsetNumber = Number(offset);
        
        query += " GROUP BY j.id LIMIT ? OFFSET ? "
        params.push(limitNumber, offsetNumber)
    
        const jobs = db.prepare(query).all(...params)
        const data = jobs.map(job => ({
            id: job.id,
            title: job.title,
            company: job.company,
            location: job.location,
            description: job.description,
            created_at: job.created_at,
            data: {
                level : job.level,
                modality : job.modality,
                technology : job.technologies ? JSON.parse(job.technologies) : [],
            },
            content: job.content ? JSON.parse(job.content) : null,
        }))

        return { 
            total: total.length,
            limit: limitNumber,
            offset: offsetNumber,
            results: data.length,
            data
        }
        /**
         * data.map(job => ({
                id: job.id,
                title: job.title,
                company: job.company,
                location: job.location,
                description: job.description,
                data: {
                    level : job.level,
                    modality : job.modality,
                    technology : job.technologies,
                },
                content: job.content
            }))
         */

    }

    static async getJobById(id){
        // return jobs.find(job => job.id === id)
        const query = `
            SELECT j.*,
                json_group_array(jt.technology) as technologies,
                json_object (
                    'description', jc.description, 
                    'responsibilities', jc.responsibilities,
                    'requirements', jc.requirements,
                    'about', jc.about
                    ) as content
            FROM jobs j
            LEFT JOIN job_technologies jt ON j.id = jt.job_id
            LEFT JOIN job_contents jc ON j.id = jc.job_id
            WHERE j.id = ?
            GROUP BY j.id
        `    
        const job = db.prepare(query).get(id) 

        return !job ? null : {
            id: job.id,
            title: job.title,
            company: job.company,
            location: job.location,
            description: job.description,
            created_at: job.created_at,
            data: {
                level : job.level,
                modality : job.modality,
                technology : job.technologies ? JSON.parse(job.technologies) : [],
            },
            content: job.content ? JSON.parse(job.content) : null,
        }
    }

    static async create({title, company, location, description, modality, level, technologies, content}){
       /*  const newJob = {
            id : crypto.randomUUID(),
            title : title,
            company: company,
            location: location,
            data: data, 
            content: content
        }

        jobs.push(newJob) // this should be addressing to the database

        return newJob */
        const id = crypto.randomUUID()
        const createdAt = new Date().toISOString()

        const insertJob = db.prepare(`
            INSERT INTO jobs (id, title, company, location, description, modality, level, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `)
        const inserTechnology = db.prepare(`
            INSERT INTO job_technologies (id, job_id, technology)
            VALUES (?, ?, ?)
        `)
        const insertContent = db.prepare(`
            INSERT INTO job_contents (id, job_id, description, responsibilities, requirements, about)
            VALUES (?, ?, ?, ?, ?, ?)
        `)

        const transaction = db.transaction(() => {
            // insert job
            insertJob.run(id, title, company, location, description, modality, level, createdAt)

            // Insert content
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

            // Insert technologies, 
            if(technologies && Array.isArray(technologies)){
                for(const tech of technologies){
                    inserTechnology.run(
                        crypto.randomUUID(),
                        id,
                        tech
                    )
                }
            }
        })
        transaction()

        // returning created job
        return this.getJobById(id)

    }

    static async updateJob(id, dataToUpdate) {
        let updateJobTechnology = null
        let updateJobContent = null
        
        const { title, company, location, description, data, content } = dataToUpdate
        const query = `
            UPDATE jobs SET 
            title = ?, 
            company = ?, 
            location = ?, 
            description = ?, 
            modality = ?, 
            level = ? 
            WHERE id = ?
        `
        const updateJobData = db.prepare(query).run(title, company, location, description, data?.modality, data?.level, id)

        // if changes is 0 -> ID doesn't exist
        if (updateJobData.changes === 0) throw new Error("Entity not found");
       

        if (data?.technologies && Array.isArray(data.technologies)) {
            // Delete existing technologies
            const deleteResult = db.prepare("DELETE FROM job_technologies WHERE job_id = ?").run(id)
            
            // Insert new technologies
            updateJobTechnology = db.prepare("INSERT INTO job_technologies (id, job_id, technology) VALUES (?, ?, ?)")
            for (const tech of data.technologies) {
                updateJobTechnology.run(crypto.randomUUID(), id, tech)
            }
        }

        if (content) {
            const { description, responsibilities, requirements, about } = content

            const contentQuery = `
                UPDATE job_contents SET 
                description = ?,
                responsibilities = ?,
                requirements = ?,
                about = ?
                WHERE job_id = ?
            `
            updateJobContent = db.prepare(contentQuery).run(description, responsibilities, requirements, about, id)
        }
            
        
        return { 
            updateJobData, 
            updateJobTechnology : updateJobTechnology || { changes: 0}, 
            updateJobContent : updateJobContent || { changes: 0}
        }    
        
        
    }

    // Helper function to build and execute dynamic updates
    static #buildAndExecuteUpdate(tableName, id, fieldsObj) {
        const fields = []
        const fieldNames = []
        const params = []
        
        for (const [key, value] of Object.entries(fieldsObj)) {
            if (value !== undefined && value !== null) {
                fields.push(`${key} = ?`)
                fieldNames.push(key)
                params.push(value)
            }
        }
        
        if (fields.length === 0) return { success: false }
        
        const whereClause = tableName === 'job_technologies' ? 'job_id' : 'id'
        const query = `UPDATE ${tableName} SET ${fields.join(', ')} WHERE ${whereClause} = ?`
        params.push(id)
        
        const result = db.prepare(query).run(...params)
        
        return {
            success: true,
            changes: result.changes,
            fields: fieldNames
        }
    }

    static async partialUpdateJob(id, fields) {
        const { title, company, location, description, data, content } = fields

        const partialUpdateDetails = {
            job: { success: false, changes: 0, fields: [] },
            jobContent: { success: false, changes: 0, fields: [] },
            jobTechnologies: { success: false, changes: 0, fields: [] }
        }

        // Prepare job fields object (top-level + nested data)
        const jobFields = {
            title,
            company,
            location,
            description,
            ...(data?.level && { level: data.level }),
            ...(data?.modality && { modality: data.modality })
        }

        // Execute job update using helper
        const jobResult = this.#buildAndExecuteUpdate('jobs', id, jobFields)
        partialUpdateDetails.job = jobResult

        // Handle content updates
        if (content) {
            const contentResult = this.#buildAndExecuteUpdate('job_contents', id, content)
            partialUpdateDetails.jobContent = contentResult
        }

        // Handle technologies - replace all
        if (data?.technologies && Array.isArray(data.technologies)) {
            db.prepare("DELETE FROM job_technologies WHERE job_id = ?").run(id)
            
            let insertedCount = 0
            const insertTech = db.prepare("INSERT INTO job_technologies (id, job_id, technology) VALUES (?, ?, ?)")
            for (const tech of data.technologies) {
                insertTech.run(crypto.randomUUID(), id, tech)
                insertedCount++
            }
            
            partialUpdateDetails.jobTechnologies = {
                success: true,
                changes: insertedCount,
                fields: data.technologies
            }
        }

        // If no valid updates, return early
        const hasUpdates = partialUpdateDetails.job.success || 
                          partialUpdateDetails.jobContent.success || 
                          partialUpdateDetails.jobTechnologies.success

        if (!hasUpdates) return {
            success: false,
            message: "No valid fields to update",
            update: partialUpdateDetails
        }

        // Calculate total changes
        const totalChanges = 
            partialUpdateDetails.job.changes + 
            partialUpdateDetails.jobContent.changes + 
            partialUpdateDetails.jobTechnologies.changes

        return {
            success: true,
            totalChanges,
            message: "Job updated successfully",
            updates: partialUpdateDetails
        }

    }

    static async deleteJob(id){
        const result = db.prepare('DELETE FROM jobs WHERE id = ?').run(id)
        return result.changes > 0
    }

}