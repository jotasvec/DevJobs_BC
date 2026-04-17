import { JobModel } from "../models/job.js";

export class JobsController{
    // Get All Jobs
    static async getAll(req, res) {
        //TODO
        const data = req.query;
        const { fileteredJobs, paginatedJobs, limitNumber, offsetNumber} = await JobModel.getAll(data)

        return res.json({
            total: fileteredJobs.length,
            limit : limitNumber,
            offset : offsetNumber,
            result: paginatedJobs.length,
            data : paginatedJobs, 
        })
    }

    // get IDs
    static async getId(req, res){
        const { id } = req.params

        const job = await JobModel.getJob(id)
        console.log('job', job)
        
        return job
            ? res.json(job) 
            : res.status(404).json({error: 'Job not found'})
    }

    static async createNewJob(req, res){
        const data = req.body;

        const newJob = await JobModel.create(data)

        return res.status(201).json(newJob)
    }

    static async updateJob(req, res){}
    static async partialUpdateJob(req, res){}
    static async deleteJob(req, res){}

}