-- 001: Create company table
-- Must exist before recruiter_profile references it

CREATE TABLE IF NOT EXISTS company (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    website TEXT,
    logo TEXT,
    industry TEXT,
    size TEXT,
    location TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
