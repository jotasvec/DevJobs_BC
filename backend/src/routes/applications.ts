import { ROLES } from "@/constants";
import { ApplicationsController } from "@/controllers/applications";
import { requireRoles, requireSession } from "@/middlewares/auth";
import { validateSchemas } from "@/middlewares/validateSchemas";
import { CreateApplicationSchema, UpdateStatusSchema } from "@/schemas/applications";
import { Router } from "express";


const applicationsRouter : Router = Router()

//private endopints, 
applicationsRouter.get('/', requireSession, ApplicationsController.getAll)
applicationsRouter.get('/stats/recruiter', requireSession, requireRoles(ROLES.RECRUITER, ROLES.ADMIN), ApplicationsController.getRecruiterStats)
applicationsRouter.get('/stats', requireSession, requireRoles(ROLES.RECRUITER, ROLES.ADMIN), ApplicationsController.getStats)

applicationsRouter.get('/:id', requireSession, ApplicationsController.getById)
applicationsRouter.post(
    '/', 
    requireSession, 
    requireRoles(ROLES.SEEKER), 
    validateSchemas(CreateApplicationSchema),
    ApplicationsController.create
)
//update status by recruiter
applicationsRouter.patch(
    '/:id', 
    requireSession, 
    requireRoles(ROLES.RECRUITER, ROLES.ADMIN),
    validateSchemas(UpdateStatusSchema),
    ApplicationsController.update
)
//applicationsRouter.put('/:id', requireSession, ApplicationsController.update)

// archived by Seeker or Recruiter
applicationsRouter.delete('/:id', requireSession, requireRoles(ROLES.SEEKER, ROLES.RECRUITER, ROLES.ADMIN), ApplicationsController.delete)
 

export { applicationsRouter }
