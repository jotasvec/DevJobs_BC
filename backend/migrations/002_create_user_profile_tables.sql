-- 002: Create seeker_profile and recruiter_profile tables
-- These extend the user table with role-specific data

CREATE TABLE IF NOT EXISTS seeker_profile (
    userId TEXT PRIMARY KEY,
    resumeUrl TEXT,
    coverLetter TEXT,
    linkedin TEXT,
    github TEXT,
    portfolio TEXT,
    expectedSalary INTEGER,
    modality TEXT CHECK(modality IN ('remote', 'onsite', 'hybrid')),
    location TEXT,
    experienceYears INTEGER,
    FOREIGN KEY (userId) REFERENCES "user"(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS recruiter_profile (
    userId TEXT PRIMARY KEY,
    companyId TEXT,
    position TEXT,
    department TEXT,
    bio TEXT,
    FOREIGN KEY (userId) REFERENCES "user"(id) ON DELETE CASCADE,
    FOREIGN KEY (companyId) REFERENCES company(id) ON DELETE SET NULL
);
