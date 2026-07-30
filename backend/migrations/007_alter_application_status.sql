CREATE TABLE applications_new (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
    job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'reviewed', 'accepted', 'rejected')),
    cover_letter TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, job_id)
);

INSERT INTO applications_new SELECT * FROM applications;
DROP TABLE applications;
ALTER TABLE applications_new RENAME TO applications;