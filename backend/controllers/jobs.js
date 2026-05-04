import { JobModel } from "../models/job.js";

export class JobsController{
    // Get All Jobs
    static async getAll(req, res) {
        //TODO
        const data = req.query;
        //const { fileteredJobs, paginatedJobs, limitNumber, offsetNumber} = await JobModel.getAll(data)
        const jobs = await JobModel.getAll(data)
       
        return res.json(jobs)
        /* return res.json({
            total: fileteredJobs,
            limit : limitNumber,
            offset : offsetNumber,
            result: paginatedJobs.length,
            data : paginatedJobs, 
        }) */
    }

    // get IDs
    static async getJobById(req, res){
        const { id } = req.params

        const job = await JobModel.getJobById(id)
      
        return job
            ? res.json(job) 
            : res.status(404).json({error: 'Job not found'})
    }

    static async createNewJob(req, res){
        const data = req.body;
        const newJob = await JobModel.create(data)
        return res.status(201).json(newJob)
    }

    static async updateJob(req, res){
        const { id } = req.params;
        const { title, company, location, description, modality, level, technologies, content } = req.body;

        if (!title || !company || !location || !description || !modality || !level || !technologies || !content) return res.status(400).json({ error: "Missing requiered fields for full update"})

        const updateJob = await JobModel.updateJob(id, { title, company, location, description, modality, level, technologies, content })
        
        return updateJob
            ? res.json(updateJob) 
            : res.status(400).json({error: 'Error on update'})
    }

    static async partialUpdateJob(req, res){
        const { id } = req.params;
        const fieldsToUpdate = req.body;

        if(Object.keys(fieldsToUpdate).length === 0) return res.status(400).json({ error: "No fields provided to update"});

        const partialUpdate = await JobModel.partialUpdateJob(id, fieldsToUpdate);

        return partialUpdate != 0
            ? res.json(partialUpdate) 
            : res.status(404).json({error: 'Job not Found, Error on update'})
        
        
    }

    static async deleteJob(req, res){
        const { id } = req.params;

        const deleted = await JobModel.deleteJob(id);

        return deleted
            ? res.json({ message: "Job deleted successfully" })
            : res.status(404).json({error: "Job not found"})
    }

}