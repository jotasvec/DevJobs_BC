import { RequestHandler, Router } from "express";
import { JobsController } from "../controllers/jobs.js";
import { PartialJobSchema, jobSchema } from "../schemas/jobs.js";
import { validateSchemas } from "../middlewares/validateSchemas.js";

const jobsRouter = Router() //jobs router

// Validation on Create a new JOb
/* const validateOnCreate: RequestHandler = (req , res, next ) => {
    const result = validateJob(req.body)

    if(!result.success) return res.status(400).json({error: 'Invalid Creation Request', details: result.error.errors })

    req.body = result.data
    return next()
} */

/* // validate partial Job
const validateOnUpdate : RequestHandler = (req, res, next ) => {
    const result = validatePartialJob(req.body)

    if(!result.success) return res.status(400).json({error: 'Invalid Update Request', details: result.error.errors })

    req.body = result.data
    return next()
} */


jobsRouter.get('/', (req, res, next) => {
    // res.header('Access-Control-Allow-Origin', 'http://localhost:5173') //replaced by CORS
    // If id is in query params, use getJobById
    const { id, ...rest } = req.query;
    if (id) {
        const queryString = new URLSearchParams(rest as Record<string, string>).toString();
        const redirectURL = queryString
            ? `/jobs/${id}?${rest}`
            : `/jobs/${id}`;

        return res.redirect(301,redirectURL)
    }
    // Otherwise, continue to getAll
    next()
}, JobsController.getAll )

// it can be -> jobsRouter.get('/', JobsController.getAll())
// get ID
jobsRouter.get('/:id', JobsController.getJobById)

// Create new job
jobsRouter.post('/', validateSchemas(jobSchema), JobsController.createNewJob)
// Update resource 
jobsRouter.patch('/:id', validateSchemas(PartialJobSchema), JobsController.partialUpdateJob)

// replace resource 
jobsRouter.put('/:id', JobsController.updateJob)
//Delete
jobsRouter.delete('/:id', JobsController.deleteJob)

export { jobsRouter }

