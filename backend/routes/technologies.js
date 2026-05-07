import { Router } from 'express'
import { TechnologiesController } from '../controllers/technologies.js'

const technologiesRouter = Router()

// Public endpoints
technologiesRouter.get('/', TechnologiesController.getAll)
technologiesRouter.get('/grouped', TechnologiesController.getGrouped)
technologiesRouter.get('/categories', TechnologiesController.getCategories)
technologiesRouter.get('/category/:category', TechnologiesController.getByCategory)
technologiesRouter.get('/:id', TechnologiesController.getById)

// Admin endpoints (need admin middleware - to be added)
technologiesRouter.post('/', TechnologiesController.create)
technologiesRouter.put('/:id', TechnologiesController.update)
technologiesRouter.delete('/:id', TechnologiesController.delete)

export { technologiesRouter }