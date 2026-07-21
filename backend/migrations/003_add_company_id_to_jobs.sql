-- 003: Add companyId FK to jobs table
-- Links jobs to the company table while keeping the text 'company' column for now

ALTER TABLE jobs ADD COLUMN companyId TEXT REFERENCES company(id) ON DELETE SET NULL;
