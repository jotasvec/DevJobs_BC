import { Router } from 'express'
import { TechnologiesController } from '../controllers/technologies.js'
import { validateSchemas } from '../middlewares/validateSchemas.js'
import { technologySchema, technologyUpdateSchema } from '../schemas/technologies.js'

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
    validateSchemas(technologySchema), 
    TechnologiesController.create
)
technologiesRouter.patch(
    '/:id', 
    // TODO isAdmin? 
    validateSchemas(technologyUpdateSchema),
    TechnologiesController.update
)
technologiesRouter.delete(
    '/:id', 
    // TODO isAdmin? 
    TechnologiesController.delete
)

export { technologiesRouter }