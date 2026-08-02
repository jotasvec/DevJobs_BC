import { Router } from "express";
import { seekerProfileRouter } from "./seekerProfile.js";
import { recruiterProfileRouter } from "./recruiterProfile.js";
import { companiesRouter } from "./companies.js";
import { jobsRouter } from "./jobs.js";
import { technologiesRouter } from "./technologies.js";
import { usersRouter } from "./users.js";
import { applicationsRouter } from "./applications.js";


const api: Router = Router();

// Companies Router
api.use('/companies', companiesRouter);

// Jobs Router
api.use('/jobs', jobsRouter);

// Technologies Router
api.use('/technologies', technologiesRouter);

// Users router
api.use('/users', usersRouter);
// Profile routes (mounted on /users to share the /users prefix)
api.use('/users', seekerProfileRouter);
api.use('/users', recruiterProfileRouter);
//Applications router
api.use('/applications', applicationsRouter)

export default api;
