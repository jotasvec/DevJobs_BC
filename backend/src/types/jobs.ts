// ================================
// TYPES
// ================================

import type { JobCompany, JobContent } from '../schemas/profiles.js'

export interface Job {
    id: string
    title: string
    created_by: string
    location: string
    description: string
    created_at: string
    company: JobCompany | null
    data: {
        modality: 'remote' | 'onsite' | 'hybrid'
        level: 'junior' | 'mid' | 'senior'
        technology: string[]
    },
    content: JobContent | null
}

export interface JobQuery {
    text?: string;
    title?: string;
    level?: string;
    technology?: string;
    location?: string;
    modality?: string;
    limit?: string;
    offset?: string;
}



export interface JobRow {
    id: string
    title: string
    created_by: string
    location: string
    description: string
    created_at: string
    level: string
    modality: string
    technologies: string
    company: string
    content: string
}

export interface UpdateResult {
    success: boolean
    changes?: number
    fields?: string[]
    error?: string
    unknownTechnologies?: string[]
    message?: string
    updates?: {
        job: UpdateResult
        jobContent: UpdateResult
        jobTechnologies: UpdateResult
    }
    totalChanges?: number
}