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

    static async updateJob(id, data) {
        
        const { title, company, location, description, modality, level, technologies, content } = data
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
        const updateJobData = await db.prepare(query).run(title, company, location, description, modality, level, id)

        // if changes is 0 -> ID doesn't exist
        if (updateJobData.changes === 0) throw new Error("Entity not found");
       
        if(technologies) {
            const techQuery = `
                UPDATE job_technologies SET
                technology = ?
                WHERE job_id = ?
            `
            
            const updateJobTechnology = await db.prepare(techQuery).run(technologies, id)
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
            const updateJobContent = await db.prepare(contentQuery).run(description, responsibilities, requirements, about, id)
        }
            
        
        return {updateJobData, updateJobTechnology, updateJobContent}    
        
        
    }

    static async partialUpdateJob(id, fields){
        const keys = Object.keys(fields);
        if (keys.length === 0) return null;

        const setClause = keys.map(key => `${key} = ?`).join(',')

        const values = Object.values(fields)
        values.push(id) // id at the end

        const query = `UPDATE jobs SET ${setClause} WHERE id = ?`;
        const partialUpdate = db.prepare(query).run(...values);
        
        return partialUpdate
    }

    static async deleteJob(id){
        const result = db.prepare('DELETE FROM jobs WHERE id = ?').run(id)
        return result.changes > 0
    }

}