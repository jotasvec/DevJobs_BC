// ================================
// TYPES
// ================================

export interface ApiResponse<T>{
    success: boolean
    data?: T
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