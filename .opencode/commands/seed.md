Seed the database with test data. Run these in order:

1. Seed users: `cd backend && node --import tsx src/db/seed-users.ts`
2. Seed companies: `cd backend && node --import tsx src/db/seed-companies.ts`
3. Seed seeker profiles: `cd backend && node --import tsx src/db/seed-seeker.ts`
4. Seed recruiter profiles: `cd backend && node --import tsx src/db/seed-recruiter.ts`

Report success/failure for each step.
