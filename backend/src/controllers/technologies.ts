import { RequestHandler } from 'express'
import { TechnologyModel } from '../models/technology.js'
import { TechnologyInput } from '../schemas/technologies.js'
import { ApiResponse } from '../types/index.js'
import { GroupedTechnologies, Technology, TechnologyCategory } from '../types/technologies.js'
import { handleHttpError } from '../utils/http-errors.js'
import { HTTP_STATUS, MESSAGES } from '../constants.js'


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

    static getGrouped : RequestHandler<
    Record<string, never>,
    ApiResponse<GroupedTechnologies>
    > = (req, res, next) =>  {
        try {
            const result = TechnologyModel.getGrouped()
            return res.status(HTTP_STATUS.OK).json({
                success: true,
                data: result.data
            })
        } catch (error: unknown) {
            handleHttpError(error, req, res, next)
        }
    }

    static getById: RequestHandler<
        {id: string},
        ApiResponse<Technology>
        > = (req, res, next) => {
        try {
            const { id } = req.params
            const technology = TechnologyModel.getById(id)

            if (!technology) return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'Technology not found' });

            return res.status(HTTP_STATUS.OK).json({ 
                success: true, 
                data: technology 
            })
        } catch (error: unknown) {
            handleHttpError(error, req, res, next)
        }
        
    }

    static getByCategory : RequestHandler<
        {category: string},
        ApiResponse<Technology[]>
        > = (req, res, next) => {
        const { category } = req.params;
        
        try {   
            const result = TechnologyModel.getAll({category});
            res.status(HTTP_STATUS.OK).json({
                success: true,
                data: result.data
            });
        } catch (error: unknown) {
            handleHttpError(error, req, res, next)
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

            res.status(HTTP_STATUS.CREATED).json({
                success: true,
                message: MESSAGES.TECHNOLOGY_CREATED,
                data: result
            })
        } catch (error: unknown) {
            handleHttpError(error, req, res, next)
        }
        
        
    }

    static update : RequestHandler<
        { id: string },
        ApiResponse<Technology>,
        TechnologyInput
    > = (req, res, next) => {
        const { id } = req.params
        const { category } = req.body
        
        const validCategories = TechnologyModel.getCategories()
        if (!validCategories.includes(category)) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                error: 'Invalid Category data',
                message: `${category} is not a valid category. please select from: ${validCategories}`
            })
        }

        try {
            const result = TechnologyModel.update(id, req.body)
            res.status(HTTP_STATUS.OK).json({
                success: true,
                data: result
            })
        } catch (error : unknown) {
            handleHttpError(error, req, res, next)
        }

    }

    static delete : RequestHandler<
        {id: string},
        ApiResponse<never>
        > = (req, res, next) =>  {

        const { id } = req.params
        try {
            const result = TechnologyModel.delete(id)
            res.status(HTTP_STATUS.NO_CONTENT).json({
                success: true,
                message: MESSAGES.TECHNOLOGY_DELETED,
            })
        } catch (error: unknown) {
            handleHttpError(error, req, res, next)
        }
    }

    static getCategories : RequestHandler<{
        id: string},
        ApiResponse<string[]>
        > = (req, res, next) => {
        try {
            const categories = TechnologyModel.getCategories()
    
            return res.status(HTTP_STATUS.OK).json({
                success: true,
                data: categories
            })
        } catch (error) {
            handleHttpError(error, req, res, next)
        }
    }
}