import { ROLES } from "@/constants";
import { ApplicationsController } from "@/controllers/applications";
import { requireRoles, requireSession } from "@/middlewares/auth";
import { Router } from "express";


const applicationsRouter : Router = Router()

//private endopints, 
applicationsRouter.get('/', requireSession, ApplicationsController.getAll)
applicationsRouter.get('/:id', requireSession, ApplicationsController.getById)
applicationsRouter.post('/', requireSession, requireRoles(ROLES.SEEKER), ApplicationsController.create)
//update status by recruiter
applicationsRouter.patch('/:id', requireSession, requireRoles(ROLES.RECRUITER), ApplicationsController.update)
applicationsRouter.put('/:id', requireSession, ApplicationsController.update)

// archived by Seeker or Recruiter
applicationsRouter.delete('/:id', requireSession, ApplicationsController.delete)


export { applicationsRouter }
