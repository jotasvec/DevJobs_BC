import { Router } from 'express'
import { TechnologiesController } from '../controllers/technologies.js'
import { validateSchemas } from '../middlewares/validateSchemas.js'
import { TechnologySchema, technologyUpdateSchema } from '../schemas/technologies.js'
import { requireRoles, requireSession } from '@/middlewares/auth.js'

const technologiesRouter: Router = Router()

// Public endpoints
technologiesRouter.get('/', TechnologiesController.getAll)
technologiesRouter.get('/grouped', TechnologiesController.getGrouped)
technologiesRouter.get('/categories', TechnologiesController.getCategories)
technologiesRouter.get('/category/:category', TechnologiesController.getByCategory)
technologiesRouter.get('/:id', TechnologiesController.getById)

// Admin endpoints (need admin middleware - to be added)
technologiesRouter.post(
    '/',
    // TODO isAdmin? 
    requireSession,
    requireRoles('admin'),
    validateSchemas(TechnologySchema), 
    TechnologiesController.create
)
technologiesRouter.patch(
    '/:id', 
    // TODO isAdmin? 
    requireSession,
    requireRoles('admin'),
    validateSchemas(technologyUpdateSchema),
    TechnologiesController.update
)
technologiesRouter.delete(
    '/:id', 
    // TODO isAdmin? 
    requireSession,
    requireRoles('admin'),
    TechnologiesController.delete
)

export { technologiesRouter }