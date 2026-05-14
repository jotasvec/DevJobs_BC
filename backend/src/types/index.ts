// ================================
// TYPES
// ================================

export interface ApiResponse<T>{
    success: boolean
    data?: T | null
    error?: string
    message?: string
}

export interface PaginatedResponse<T>{
    total: number
    limit: number
    offset: number
    results: number
    data: T[]
}

export interface UpdateResult{
    success: boolean
    changes?: number
    message?: string
}

export interface SQLiteError extends Error {
    code: string
    errno?: number
}