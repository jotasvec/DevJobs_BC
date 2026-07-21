Reset the database by deleting jobs.db, re-running migrations, and re-seeding all data:

1. Delete: `rm backend/jobs.db`
2. Migrate: `cd backend && node --import tsx migrations/migrate.js`
3. Seed everything (run seed command)

Confirm the database is fresh with the db-status command after.
