-- 004: Remove resume and skills from user table
-- bio is kept on the user table per project decision
-- Note: SQLite < 3.35.0 does not support ALTER TABLE DROP COLUMN
-- If your SQLite version is older, you'll need to recreate the table.
-- Check version: sqlite3 --version

-- For SQLite >= 3.35.0:
ALTER TABLE user DROP COLUMN resume;
ALTER TABLE user DROP COLUMN skills;
