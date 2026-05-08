// ================================
// TYPES
// ================================

export interface Job {
    id: string
    title: string
    company: string
    location: string
    description: string
    modality: 'remote' | 'onsite' | 'hybrid'
    level: 'junior' | 'mid' | 'senior'
    created_at: string
}

export interface JobContent {
    description: string
    responsibilities : string
    requirements : string
    about : string
}

export interface JobDetails extends Job{
    technologies: string[]
    content: JobContent | null
}

export interface JobFilter {
    text?: string
    title?: string
    level?: string
    technology?: string
    location?: string
    modality?: string
    limit?: number
    offset?: number
}

