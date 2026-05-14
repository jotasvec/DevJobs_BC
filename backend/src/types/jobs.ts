// ================================
// TYPES
// ================================

export interface Job {
    id: string
    title: string
    company: string
    location: string
    description: string
    created_at: string
    data: {
        modality: 'remote' | 'onsite' | 'hybrid'
        level: 'junior' | 'mid' | 'senior'
        technology: string[]
    },
    content: JobContent | null
    
}

export interface JobContent {
    description: string
    responsibilities : string
    requirements : string
    about : string
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


