import { Router } from "express";
import { JobsController } from "../controllers/jobs.js";
import { validateJob, validatePartialJob } from "../schemas/jobs.js";

const jobsRouter = Router() //jobs router

// Validation on Create a new JOb
function validateOnCreate(req, res, next ) {
    const result = validateJob(req.body)

    if(!result.success) return res.status(400).json({error: 'Invalid Creation Request', details: result.error.errors })

    req.body = result.data
    return next()
}

// validate partial Job
function validateOnUpdate(req, res, next ) {
    const result = validatePartialJob(req.body)

    if(!result.success) return res.status(400).json({error: 'Invalid Creation Request', details: result.error.errors })

    req.body = result.data
    return next()
}


jobsRouter.get('/', (req, res) => {
    // res.header('Access-Control-Allow-Origin', 'http://localhost:5173') //replaced by CORS
   JobsController.getAll(req, res)
})
// it can be -> jobsRouter.get('/', JobsController.getAll())
// get ID
jobsRouter.get('/:id', JobsController.getJobById)

// Create new job
jobsRouter.post('/', validateOnCreate, JobsController.createNewJob)
// Update resource 
jobsRouter.patch('/:id', validateOnUpdate, JobsController.partialUpdateJob)

// replace resource 
jobsRouter.put('/:id', JobsController.updateJob)
//Delete
jobsRouter.delete('/:id', JobsController.deleteJob)

export { jobsRouter }

