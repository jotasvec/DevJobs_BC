export interface ApplicationQuery {
    userId: string; 
    jobId : string; 
    contact_email: string;
    contact_phone: string;
    resume_url: string;
    portfolio_url: string;
    cover_letter: string;
    status?: string;
    recruiter_notes?: string;
    reviewed_at?: string;
    recruiter_archived_at?: string;
    seeker_archived_at?: string;
    created_at?: string;
    updated_at?: string;
}