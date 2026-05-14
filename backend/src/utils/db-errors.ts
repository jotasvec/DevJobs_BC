/**
 * Mapping especific error from the database
 */

import { SQLiteError } from "../types/index.js"

export const handleDBError = (error : unknown): never => {
    if (error instanceof Error) {
        const err = error as SQLiteError

        //SQLite Logic
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') throw new Error("DUPLICATED_TECHNOLOGY");
        if (err.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') throw new Error('INVALID_CATEGORY');

        // Postgres logic
        // TODO: must be changed
        // if (err.code === '23505') throw new Error('DUPLICATE_ENTITY') or Error("DUPLICATED_TECHNOLOGY");
        // if (err.code === '23503') throw new Error('FOREIGN_KEY_VIOLATION');
            
    }
    // if is not a known DB Error, throw the original error.
    throw error
}