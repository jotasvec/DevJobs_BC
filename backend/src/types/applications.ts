export interface ApplicationFilters {
    userId?: string;
    jobId?: string;
    status?: string;
    limit?: number;
    offset?: number;
}

export interface ApplicationStats {
    pending: number;
    reviewed: number;
    shortlisted: number;
    accepted: number;
    rejected: number;
    withdrawn: number;
    total: number;
}