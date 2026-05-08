import crypto from 'node:crypto'
import { db } from '../db/database.js'

export class TechnologyModel {
    static getAll({ category, search } = {}) {
        let query = `
            SELECT id, name, category, created_at 
            FROM technologies 
            WHERE 1=1
        `
        const params = []

        if (category) {
            query += ` AND LOWER(category) = LOWER(?)`
            params.push(category)
        }

        if (search) {
            query += ` AND name LIKE ?`
            params.push(`%${search}%`)
        }

        query += ` ORDER BY category, name`

        const technologies = db.prepare(query).all(...params)

        return {
            total: technologies.length,
            data: technologies
        }
    }

    static getGrouped() {
/*         const query = `
            SELECT id, name, category, created_at 
            FROM technologies 
            ORDER BY category, name
        `
        const technologies = db.prepare(query).all() */
        const technologies = this.getAll()
        const grouped = {}

        for (const tech of technologies) {
            if (!grouped[tech.category]) grouped[tech.category] = [];

            grouped[tech.category].push({
                id: tech.id,
                name: tech.name,
                category: tech.category
            });
        }

        return {
            total: technologies.length,
            data: grouped
        }
    }

    static getById(id) {
        const query = `
            SELECT id, name, category, created_at 
            FROM technologies 
            WHERE id = ?
        `
        return db.prepare(query).get(id)
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

    static getByName(name) {
        const query = `
            SELECT id, name, category, created_at 
            FROM technologies 
            WHERE LOWER(name) = LOWER(?)
        `
        return db.prepare(query).get(name)
    }

    static create({ name, category }) {
        const id = crypto.randomUUID()
        const createdAt = new Date().toISOString()

        const query = `
            INSERT INTO technologies (id, name, category, created_at)
            VALUES (?, ?, ?, ?)
        `

        try {
            db.prepare(query).run(id, name, category, createdAt)
            return { id, name, category, created_at: createdAt }
            
        } catch (error) {
            if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
                throw new Error('DUPLICATE_TECHNOLOGY');
            }
            throw error
        }
    }

    static update(id, { name, category }) {
        const updates = []
        const params = []

        if (name) {
            updates.push('name = ?')
            params.push(name)
        }
        if (category) {
            updates.push('category = ?')
            params.push(category)
        }

        if (updates.length === 0) {
            return { success: false, error: 'No fields to update' }
        }

        const query = `UPDATE technologies SET ${updates.join(', ')} WHERE id = ?`
        params.push(id)
        

        try {
            const result = db.prepare(query).run(...params)
            if (result.changes === 0) return { success: false, error: 'Technology not found' }
            
            return this.getById(id)


        } catch (error) {
            if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
                return {
                    success: false,
                    error: 'DUPLICATED_TECHNOLOGY',
                    message: `Technology "${name}" already exists in category "${category}"`
                }
            }
            if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
                return {
                    success: false,
                    error: 'INVALID_CATEGORY',
                    message: `The value "${category}, is not a valid Category"`
                }
                //throw new Error('INVALID_CATEGORY');
            }
            throw error
        }
        
    }

    static delete(id) {
        const query = `DELETE FROM technologies WHERE id = ?`
        const result = db.prepare(query).run(id)

        if (result.changes === 0) {
            return { success: false, error: 'Technology not found' }
        }

        return { success: true, message: 'Technology deleted successfully' }
    }

    static getCategories() {
        const query = `
            SELECT DISTINCT category 
            FROM technologies 
            ORDER BY category
        `
        const categories = db.prepare(query).all()
        return categories.map(c => c.category)
    }
}