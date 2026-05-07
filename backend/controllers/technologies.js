import { TechnologyModel } from '../models/technology.js'
import { validateTechnology, validateTechnologyUpdate, validateTechnologyId } from '../schemas/technologies.js'

export class TechnologiesController {
    static async getAll(req, res) {
        const { category, search } = req.query

        const result = TechnologyModel.getAll({ category, search })

        return res.json(result)
    }

    static async getGrouped(req, res) {
        const result = TechnologyModel.getGrouped()

        return res.json(result)
    }

    static async getById(req, res) {
        const { id } = req.params

        const idValidation = validateTechnologyId(id)
        if (!idValidation.success) {
            return res.status(400).json({ 
                error: 'Invalid ID format',
                details: idValidation.error.errors 
            })
        }

        const technology = TechnologyModel.getById(id)

        if (!technology) {
            return res.status(404).json({ error: 'Technology not found' })
        }

        return res.json(technology)
    }

    static async getByCategory(req, res) {
        const { category } = req.params

        const result = TechnologyModel.getByCategory(category)

        return res.json(result)
    }

    static async create(req, res) {
        const validation = validateTechnology(req.body)

        if (!validation.success) {
            return res.status(400).json({ 
                error: 'Invalid technology data',
                details: validation.error.errors 
            })
        }

        const { name, category } = validation.data

        const existing = TechnologyModel.getByName(name)
        if (existing) {
            return res.status(409).json({ 
                error: 'Technology already exists',
                message: `Technology "${name}" already exists` 
            })
        }

        const result = TechnologyModel.create({ name, category })

        if (!result.success) {
            return res.status(400).json({ 
                error: result.error,
                message: result.message 
            })
        }

        return res.status(201).json(result)
    }

    static async update(req, res) {
        const { id } = req.params

        const idValidation = validateTechnologyId(id)
        if (!idValidation.success) {
            return res.status(400).json({ 
                error: 'Invalid ID format',
                details: idValidation.error.errors 
            })
        }

        const validation = validateTechnologyUpdate(req.body)
        if (!validation.success) {
            return res.status(400).json({ 
                error: 'Invalid update data',
                details: validation.error.errors 
            })
        }

        const validCategories = TechnologyModel.getCategories()
        if (!validCategories.includes(req.body.category)) {
            return res.status(400).json({ 
                error: 'Invalid Category data',
                message: `${req.body.category} is not a valid category. please select from: ${validCategories}` 
            })
        }

        const existing = TechnologyModel.getById(id)
        if (!existing) {
            return res.status(404).json({ error: 'Technology not found' })
        }

        if (validation.data.name) {
            const nameExists = TechnologyModel.getByName(validation.data.name)
            if (nameExists && nameExists.id !== id) {
                return res.status(409).json({ 
                    error: 'Technology name already exists',
                    message: `Technology "${validation.data.name}" already exists` 
                })
            }
        }

        const result = TechnologyModel.update(id, validation.data)

        if (!result.success) {
            return res.status(400).json({ 
                error: result.error 
            })
        }

        return res.json(result)
    }

    static async delete(req, res) {
        const { id } = req.params

        const idValidation = validateTechnologyId(id)
        if (!idValidation.success) {
            return res.status(400).json({ 
                error: 'Invalid ID format',
                details: idValidation.error.errors 
            })
        }

        const existing = TechnologyModel.getById(id)
        if (!existing) {
            return res.status(404).json({ error: 'Technology not found' })
        }

        const result = TechnologyModel.delete(id)

        return res.json(result)
    }

    static async getCategories(req, res) {
        const categories = TechnologyModel.getCategories()

        return res.json({ categories })
    }
}