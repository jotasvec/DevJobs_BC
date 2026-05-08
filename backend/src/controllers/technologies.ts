import { RequestHandler } from 'express'
import { TechnologyModel } from '../models/technology.js'
import { TechnologyInput, PartialTechnologyUpdate} from '../schemas/technologies.js'
import { ApiResponse } from '../types/index.js'
import { Technology } from '../types/technologies.js'

export class TechnologiesController {
    static getAll : RequestHandler<
        Record<string, never>,
        ApiResponse<{total: number, data: Technology[]}>,
        Record<string, never>,
        { category?: string, search?: string }
    > = (req, res, next) => {
        try {
            const { category, search } = req.query
            const result = TechnologyModel.getAll({ category, search })
            res.json({
                success: true,
                data: result
            });
        } catch (error: unknown) {
            next(error)
        }

    }

    static getGrouped : RequestHandler = (req, res) =>  {
        const result = TechnologyModel.getGrouped()

        return res.json(result)
    }

    static getById: RequestHandler<{id: string}> = (req, res, next) => {
        try {
            const { id } = req.params
            const technology = TechnologyModel.getById(id)

            if (!technology) return res.status(404).json({ error: 'Technology not found' });
            
            return res.json({ data: technology})
        } catch (error) {
            next(error)
        }
        
    }

    static getByCategory : RequestHandler<{category: string}> = (req, res, next) => {
        try {
            
            const { category } = req.params;
            const result = TechnologyModel.getAll(category);
            res.json({data: result});
        } catch (error) {
            next(error)
        }
    }

    static create : RequestHandler<
        Record<string, never>,
        ApiResponse<Technology>,
        TechnologyInput
    > = (req, res, next) => {
        const { name, category } = req.body
        try {
            const result = TechnologyModel.create({ name, category })

            res.status(201).json({ 
                success: true,
                message: 'New technology successfully added',
                data: result
            })
        } catch (error: unknown) {
            // Cero 'any'. Verificamos que es un Error estándar de Node/JS
            if (error instanceof Error) {
                if (error.message === 'DUPLICATE_TECHNOLOGY') {
                    // El return es vital para que TypeScript entienda que aquí termina
                    res.status(409).json({ 
                        success: false, 
                        message: `Technology "${name}" already exists` 

                    });
                    return;
                }
            }
            next(error);
        }
        
        
    }

    static update : RequestHandler<
        { id: string },
        ApiResponse<Technology>,
        TechnologyInput
    > = (req, res, next) => {
        const { id } = req.params

        
        const validCategories = TechnologyModel.getCategories()
        if (!validCategories.includes(req.body.category)) {
            return res.status(400).json({ 
                success: false,
                error: 'Invalid Category data',
                message: `${req.body.category} is not a valid category. please select from: ${validCategories}` 
            })
        }

        try {
            const result = TechnologyModel.update(id, req.body)
            res.json({
                success: true,
                data: result
            })
        } catch (error : unknown) {
            if(error instanceof Error){
                switch (error.message) {
                    case "NOT_FOUND": 
                        res.status(404).json({ 
                            success: false,
                            error: error.message,
                            message: `${req.body.name} is not found` 
                        })
                        return;
                    case "DUPLICATE_TECHNOLOGY": 
                        res.status(409).json({ 
                            success: false,
                            error: error.message,
                            message: `${req.body.name} already exists` 
                        })
                        return;
                    case "NO_FIELDS_PROVIDED": 
                        res.status(400).json({ 
                            success: false,
                            error: error.message,
                            message: `no fields provided to update` 
                        })
                        return;
                }
            }
            next(error)
        }

    }

    static delete : RequestHandler<{id: string}> = (req, res, next) =>  {

        const { id } = req.params
        try {            
            const result = TechnologyModel.delete(id)
            res.status(204).json(result)
        } catch (error: unknown) {
            if(error instanceof Error){
                if (error.message === 'NOT_FOUND') {
                    return res.status(404).json({ 
                            success: false,
                            error: error.message,
                            message: `${req.body.name} is not found` 
                        })
                }
            }
            next(error)
        }
    }

    static getCategories : RequestHandler<{id: string}> = (req, res, next) => {
        const categories = TechnologyModel.getCategories()

        return res.json({ categories })
    }
}