import { NextFunction, Request, RequestHandler, Response } from "express";
import { JobModel } from "../models/job.js";
import { Job, JobQuery,  } from "../types/jobs.js";
import { ApiResponse, PaginatedResponse, UpdateResult } from "../types/index.js";
import { JobInput } from "../schemas/jobs.js";
import { success } from "zod";
import { handleHttpError } from "../utils/http-errors.js";



export class JobsController{
    // Get All Jobs
    static getAll : RequestHandler<
        Record<string, never>,
        ApiResponse<PaginatedResponse<Job>>,
        JobQuery
    > = (req, res, next) => {
        const data = req.query;
        try {
            //const { fileteredJobs, paginatedJobs, limitNumber, offsetNumber} = await JobModel.getAll(data)
            const jobs = JobModel.getAll(data)
           
            return res.json({
                success: true,
                data: jobs
            })
            
        } catch (error: unknown) {
            handleHttpError(error, req, res, next)
        }
        /* return res.json({
            total: fileteredJobs,
            limit : limitNumber,
            offset : offsetNumber,
            result: paginatedJobs.length,
            data : paginatedJobs, 
        }) */
    }

    // get IDs
    static getJobById : RequestHandler< {id: string}, ApiResponse<Job> > = (req, res, next) => {
        const { id } = req.params
        try {
            
            const job = JobModel.getJobById(id)
            if (!job) {
                res.status(404).json({
                    success: false,
                    error: 'NOT_FOUND',
                    message: 'Job not found'
                });
                return;
            }
            return res.status(200).json({
                success: true,
                data: job
            }) 

        } catch (error: unknown) {
            handleHttpError(error, req, res, next)           
        }
    }

    static createNewJob : RequestHandler<
        Record<string, never>,
        ApiResponse<Job>,
        JobInput> = (req, res, next) => {
        const data = req.body;
        try {
            const newJob = JobModel.create(data)
            return res.status(201).json({
                success: true,
                message: 'Job created successfully',
                data: newJob
            })
            
        } catch (error) {
            handleHttpError(error, req, res, next)
        }
    }

    static updateJob : RequestHandler<
        {id: string},
        ApiResponse<UpdateResult>,
        JobInput
    > = (req, res, next) => {
        const { id } = req.params;
        const { title, company, location, description, data, content } = req.body;

        if (!title || !company || !location || !description || !data || !content) return res.status(400).json({ success: false, error: "Missing required fields for full update"})
        
        try {
            const updateJob = JobModel.partialUpdateJob(id, { title, company, location, description, data, content })
            
            return res.status(200).json({
                success: true,
                data: updateJob
            }) 
            
        } catch (error) {
            handleHttpError(error, req, res, next)
        }
        
            //: res.status(400).json({error: 'Error on update'})
    }

    static partialUpdateJob : RequestHandler<
        {id: string},
        ApiResponse<UpdateResult>,
        JobInput> = (req, res, next) => {
        const { id } = req.params;

        try {
            const fieldsToUpdate = req.body;
    
            if(Object.keys(fieldsToUpdate).length === 0) return res.status(400).json({ success: false, error: "No fields provided to update"});
    
            const partialUpdate = JobModel.partialUpdateJob(id, fieldsToUpdate);
            
            return res.status(200).json({
                success: true,
                data: partialUpdate 
            }) 
            
        } catch (error: unknown) {
            handleHttpError(error, req, res, next)
        }

        
        
    }

    static deleteJob : RequestHandler<{id:  string}, ApiResponse<never>> = (req, res, next) => {
        const { id } = req.params;

        try {
            const deleted = JobModel.deleteJob(id);
            if (deleted) {
                return res.status(204).json({
                    success: true,
                    message: "Job deleted successfully",
                })
            }
        } catch (error: unknown) {
            handleHttpError(error, req, res, next)
        }
    }

 

}