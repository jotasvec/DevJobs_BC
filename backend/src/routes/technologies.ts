import { Router } from 'express'
import { TechnologiesController } from '../controllers/technologies.js'
import { validateSchemas } from '../middlewares/validateSchemas.js'
import { TechnologySchema, technologyUpdateSchema } from '../schemas/technologies.js'
import { requireRoles, requireSession } from '@/middlewares/auth.js'
import { ROLES } from '../constants.js'

const technologiesRouter: Router = Router()

// Public endpoints
technologiesRouter.get('/', TechnologiesController.getAll)
technologiesRouter.get('/grouped', TechnologiesController.getGrouped)
technologiesRouter.get('/categories', TechnologiesController.getCategories)
technologiesRouter.get('/category/:category', TechnologiesController.getByCategory)
technologiesRouter.get('/:id', TechnologiesController.getById)

technologiesRouter.post(
    '/',
    requireSession,
    requireRoles(ROLES.ADMIN),
    validateSchemas(TechnologySchema),
    TechnologiesController.create
)
technologiesRouter.patch(
    '/:id',
    requireSession,
    requireRoles(ROLES.ADMIN),
    validateSchemas(technologyUpdateSchema),
    TechnologiesController.update
)
technologiesRouter.delete(
    '/:id',
    requireSession,
    requireRoles(ROLES.ADMIN),
    TechnologiesController.delete
)

export { technologiesRouter }