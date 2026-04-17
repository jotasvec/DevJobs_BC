import jobs from '../data.json' with { type: 'json' }
import { DEFAULTS as DEF } from "../config.js";


export class JobModel{
    static async getAll({text, title, level, technology, location, limit = DEF.LIMIT_PAGINATION, offset = DEF.LIMIT_OFFSET}){
        let fileteredJobs = jobs;

        if(text) {
            const searchTerm = text.toLowerCase();
            fileteredJobs = fileteredJobs.filter( job => 
                job.titulo.toLowerCase().includes(searchTerm) ||
                job.descripcion.toLowerCase().includes(searchTerm) 
            );
        }
        if(title) {
            const searchTerm = title.toLowerCase();
            fileteredJobs = fileteredJobs.filter( job => 
                job.titulo.toLowerCase().includes(searchTerm)
            );
        }

        if(technology) {
            const searchTerm = technology.toLowerCase();
            fileteredJobs = fileteredJobs.filter( job => 
                job.titulo.toLowerCase().includes(searchTerm) ||
                job.descripcion.toLowerCase().includes(searchTerm)||
                job.data.technology.includes(searchTerm)
            );
        }
        if(location) {
            const searchTerm = location.toLowerCase();
            fileteredJobs = fileteredJobs.filter( job => 
                job.ubicacion.includes(searchTerm) ||
                job.data.modalidad.includes(searchTerm)
            );
        }
        if(level) {
            const searchTerm = level.toLowerCase();
            fileteredJobs = fileteredJobs.filter( job => 
                job.data.nivel.includes(searchTerm)
            );
        }

        const limitNumber = Number(limit);
        const offsetNumber = Number(offset);

        const paginatedJobs = fileteredJobs.slice(offsetNumber, offsetNumber + limitNumber)

        return { 
            fileteredJobs, 
            paginatedJobs,
            limitNumber,
            offsetNumber
        }

    }

    static async getJob(id){
        return jobs.find(job => job.id === id)         
    }

    static async create({title, company, location, data, content}){
        const newJob = {
            id : crypto.randomUUID(),
            title : title,
            company: company,
            location: location,
            data: data, 
            content: content
        }

        jobs.push(newJob) // this should be addressing to the database

        return newJob
    }
}