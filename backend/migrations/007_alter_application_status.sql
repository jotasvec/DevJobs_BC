DROP TABLE applications_new;

CREATE TABLE applications_new (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
    job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,

    contact_email TEXT,
    contact_phone TEXT,
    resume_url TEXT,
    portfolio_url TEXT,
    cover_letter TEXT,

    status TEXT NOT NULL DEFAULT 'pending'
        CHECK(status IN ('pending', 'reviewed', 'shortlisted', 'accepted', 'rejected', 'withdrawn')),

    recruiter_archived_at DATETIME,
    seeker_archived_at DATETIME,

    recruiter_notes TEXT,
    reviewed_at DATETIME,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(user_id, job_id)
);

INSERT INTO applications_new (id, user_id, job_id, status, cover_letter, created_at)
SELECT id, user_id, job_id, status, cover_letter, created_at FROM applications;
DROP TABLE applications;
ALTER TABLE applications_new RENAME TO applications;