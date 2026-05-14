import crypto from 'node:crypto'
import db  from '../db/database.js'
import { GroupedTechnologies, Technology, TechQuery } from '../types/technologies.js'
import { SQLiteError } from '../types/index.js'
import { handleDBError } from '../utils/db-errors.js'

export class TechnologyModel {
    static getAll( data : TechQuery = {}):{ total: number, data: Technology[] } {
        const {category, search } = data
        let query = `
            SELECT 
              t.id as id, 
              t.name as name, 
              t.category as category,
              t.created_at as created_at, 
              c.description as category_description
            FROM technologies t
            INNER JOIN technology_categories c ON t.category = c.name
            WHERE 1=1
        `
        const params = []

        if (category) {
            query += ` AND LOWER(t.category) = LOWER(?)`
            params.push(category)
        }

        if (search) {
            query += ` AND t.name LIKE ?`
            params.push(`%${search}%`)
        }

        query += ` ORDER BY t.category, name`

        const technologies = db.prepare(query).all(...params) as Technology[]

        return {
            total: technologies.length,
            data: technologies
        }
    }

    static getGrouped() : {total: number, data: GroupedTechnologies } {
/*         const query = `
            SELECT id, name, category, created_at 
            FROM technologies 
            ORDER BY category, name
        `
        const technologies = db.prepare(query).all() */
        const { data } : {data: Technology[]} = this.getAll()
        //const grouped : Record<string, Partial<Technology>[]> = {}
        const grouped : GroupedTechnologies = {}

        for (const tech of data) {
            const category = tech.category
            if (!grouped[category]) grouped[category] = [];

            grouped[category].push({
                id: tech.id,
                name: tech.name,
                category: tech.category
            });
        }

        return {
            total: data.length,
            data: grouped
        }
    }

    static getById(id : string) : Technology | null {
        const query = `
            SELECT id, name, category, created_at 
            FROM technologies 
            WHERE id = ?
        `
        const result = db.prepare(query).get(id) as Technology | undefined
        return result || null
    }

    /* static getByCategory(category) {
        const query = `
            SELECT id, name, category, created_at 
            FROM technologies 
            WHERE category = ?
            ORDER BY name
        `
        const technologies = db.prepare(query).all(category)

        return {
            total: technologies.length,
            data: technologies
        }
    } */

    static getByName(name: string): Technology | null {
        const query = `
            SELECT id, name, category, created_at 
            FROM technologies 
            WHERE LOWER(name) = LOWER(?)
        `
        const result = db.prepare(query).get(name) as Technology
        return result || null
    }

    static create({ name, category } : TechQuery) {
        const id = crypto.randomUUID()
        const createdAt = new Date().toISOString()

        const query = `
            INSERT INTO technologies (id, name, category, created_at)
            VALUES (?, ?, ?, ?)
        `

        try {
            db.prepare(query).run(id, name, category, createdAt)
            const newTechnology = this.getById(id);
            if(!newTechnology) throw new Error("FAILED_TO_CREATE");
            

            return newTechnology;
            
        } catch (error: unknown) {
            return handleDBError(error)
        }
    }

    static update(id: string ,fields: {name: string, category : string}) : Technology {
        const updates: string[] = []
        const params: (string | number )[] = []
        const { name, category } = fields

        if (name) {
            updates.push('name = ?')
            params.push(name)
        }
        if (category) {
            updates.push('category = ?')
            params.push(category)
        }

        if (updates.length === 0) throw new Error('NO_FIELDS_PROVIDED')

        const query = `UPDATE technologies SET ${updates.join(', ')} WHERE id = ?`
        params.push(id)
        

        try {
            const result = db.prepare(query).run(...params)
            if (result.changes === 0) throw new Error("NOT_FOUND");
            
            
            const updated = this.getById(id) as Technology
            if(!updated) throw new Error("NOT_FOUND");
            return updated

        } catch (error: unknown ) {
            return handleDBError(error)
        }
        
    }

    static delete(id: string) {
        const query = `DELETE FROM technologies WHERE id = ?`

        try {
            const result = db.prepare(query).run(id)
            if (result.changes === 0) throw new Error("NOT_FOUND");
            
            return { success: true, message: 'Technology deleted successfully' }
            
        } catch (error) {
            return handleDBError(error)
        }
    }

    static getCategories(): string[] {
        const query = `
            SELECT name  
            FROM technology_categories 
            ORDER BY name
        `
        const categories = db.prepare(query).all() as {name: string}[]
        return categories.map(c => c.name)
    }
}