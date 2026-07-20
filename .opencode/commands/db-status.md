Check the current database state. Run these queries and display results:

1. Users: `sqlite3 backend/jobs.db "SELECT id, email, name, lastName, role FROM user;"`
2. Companies: `sqlite3 backend/jobs.db "SELECT id, name, industry FROM company;"`
3. Seeker profiles: `sqlite3 backend/jobs.db "SELECT sp.userId, u.email, sp.location, sp.modality FROM seeker_profile sp JOIN user u ON sp.userId = u.id;"`
4. Recruiter profiles: `sqlite3 backend/jobs.db "SELECT rp.userId, u.email, c.name, rp.position FROM recruiter_profile rp JOIN user u ON rp.userId = u.id LEFT JOIN company c ON rp.companyId = c.id;"`
5. Jobs count: `sqlite3 backend/jobs.db "SELECT COUNT(*) FROM jobs;"`
