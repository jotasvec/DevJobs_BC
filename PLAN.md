# PLAN.md - Technology Lookup Table Implementation

### Project: DevJobs_BC
### Date: 2026-05-06
### Objective: Implement normalized technology management with Option A (Lookup Table)

---

## 1. Overview

Create a standardized technology management system with:
- A reference table for all technologies
- Proper many-to-many relationship with jobs
- Pre-populated common technologies
- Category support for organization
- Ready for PostgreSQL migration

---

## 2. Current State

### Existing Tables:
```
- jobs (id, title, company, location, description, modality, level, created_at)
- job_contents (id, job_id, description, responsibilities, requirements, about)
- job_technologies (id, job_id, technology) ← PROBLEMATIC
- users (id, email, password, name, role, avatar, bio, resume, skills, created_at)
- applications (id, user_id, job_id, status, cover_letter, created_at)
```

### Problems with Current `job_technologies`:
- No standardization (duplicates: "React", "react", "REACT")
- No referential integrity
- Hard to manage updates
- Not scalable for PostgreSQL

---

## 3. Target State

### New Database Schema:

```sql
-- 1. Technologies reference table (NEW)
CREATE TABLE technologies (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    category TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Job-Technologies junction table (REPLACE job_technologies)
CREATE TABLE job_technologies (
    id TEXT PRIMARY KEY,
    job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    technology_id TEXT NOT NULL REFERENCES technologies(id) ON DELETE CASCADE,
    UNIQUE(job_id, technology_id)
);

-- 3. Technology categories reference (NEW)
CREATE TABLE technology_categories (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT
);
```

### Pre-populated Technologies by Category:

| Category | Technologies |
|----------|---------------|
| **Frontend** | React, Vue.js, Angular, Next.js, Nuxt.js, Svelte, Tailwind CSS, Bootstrap, TypeScript, JavaScript |
| **Backend** | Node.js, Express, Django, Flask, Spring Boot, Ruby on Rails, Laravel, Go, Rust, C# |
| **Database** | PostgreSQL, MySQL, MongoDB, Redis, SQLite, Oracle, SQL Server, Elasticsearch, Firebase |
| **DevOps** | Docker, Kubernetes, AWS, Azure, GCP, Terraform, Ansible, Jenkins, GitLab CI, GitHub Actions |
| **Mobile** | React Native, Flutter, Swift, Kotlin, Ionic, Expo |
| **Testing** | Jest, Cypress, Playwright, Selenium, Mocha, Chai, Robot Framework |
| **Tools** | Git, GitHub, GitLab, Bitbucket, Jira, Figma, Sketch, Postman, Swagger |
| **Languages** | Python, JavaScript, TypeScript, Java, C#, Go, Rust, Ruby, PHP, Swift, Kotlin, Scala |

---

## 4. Implementation Phases

### Phase 1: Database Migration (Priority: HIGH)

1. **Create new tables:**
   - `technology_categories`
   - `technologies`
   - New `job_technologies` (with foreign keys)

2. **Migrate existing data:**
   - Extract unique technology names from current `job_technologies`
   - Insert into new `technologies` table
   - Create junction records in new `job_technologies`

3. **Update seed.js:**
   - Include new tables creation
   - Include pre-populated technologies

4. **Drop old table (after verification):**
   - Remove old `job_technologies` table

### Phase 2: Backend Models (Priority: HIGH)

1. **Create new model: `backend/models/technology.js`**
   - `getAll()` - Get all technologies with categories
   - `getByCategory(category)` - Get technologies by category
   - `getOrCreate(name, category)` - Get existing or create new
   - `getPopular()` - Get most used technologies

2. **Update `backend/models/job.js`:**
   - Modify `getAll()` to JOIN with new `job_technologies` + `technologies`
   - Modify `getJobById()` to return technology objects with id and name
   - Fix `partialUpdateJob()` to handle technology IDs
   - Fix `updateJob()` to handle technology IDs

### Phase 3: API Endpoints (Priority: HIGH)

1. **Technology endpoints:**
   ```
   GET    /technologies              - Get all technologies
   GET    /technologies/:id          - Get single technology
   GET    /technologies/category/:category - Get by category
   POST   /technologies              - Create new technology (admin)
   PUT    /technologies/:id          - Update technology (admin)
   DELETE /technologies/:id          - Delete technology (admin)
   ```

2. **Update Job endpoints:**
   ```
   GET    /jobs                      - Jobs with technology objects
   GET    /jobs/:id                  - Job detail with technology objects
   POST   /jobs                      - Accept technology IDs array
   PATCH  /jobs/:id                  - Accept technology IDs for update
   PUT    /jobs/:id                  - Accept technology IDs for full update
   ```

### Phase 4: Frontend Integration (Priority: MEDIUM)

1. **Update Job Creation/Edit Forms:**
   - Convert technology input to searchable dropdown
   - Fetch available technologies from API
   - Allow multi-select from standardized list

2. **Update Job List/Detail:**
   - Display technology names from API response
   - Filter jobs by technology (existing functionality)

### Phase 5: PostgreSQL Preparation (Priority: LOW)

1. **Add indexes for performance:**
   ```sql
   CREATE INDEX idx_technologies_category ON technologies(category);
   CREATE INDEX idx_job_technologies_job ON job_technologies(job_id);
   CREATE INDEX idx_job_technologies_tech ON job_technologies(technology_id);
   ```

2. **Document migration steps:**
   - Export SQLite data
   - Transform to PostgreSQL format
   - Import to PostgreSQL

---

## 5. API Response Format (KEEP CURRENT)

The current format will be maintained:
```javascript
{
    "id": "123",
    "title": "Software Developer",
    "data": {
        "technology": ["React", "Node.js", "PostgreSQL"]
    }
}
```

Note: Internally the database uses IDs, but the API response converts to string array for frontend compatibility.

---

## 6. Files to Modify

### New Files:
| File | Description |
|------|-------------|
| `backend/models/technology.js` | Technology model |
| `backend/routes/technologies.js` | Technology routes |
| `backend/controllers/technologies.js` | Technology controller |
| `backend/schemas/technologies.js` | Technology validation schema |

### Modified Files:
| File | Changes |
|------|---------|
| `backend/db/seed.js` | Add new tables + pre-populated data |
| `backend/models/job.js` | Update queries to use new structure |
| `backend/routes/jobs.js` | (No changes needed) |
| `backend/controllers/jobs.js` | (No changes needed) |
| `frontend/src/pages/Jobs/JobCard.jsx` | Update display format |
| `frontend/src/pages/Jobs/index.jsx` | Update display format |
| `frontend/src/pages/Jobs/JobForm.jsx` | Add dropdown component |

---

## 7. Acceptance Criteria

- [x] New `technologies` table created with 50+ pre-populated technologies
- [x] New `job_technologies` junction table with proper foreign keys
- [x] `GET /technologies` returns all technologies with categories
- [x] `GET /technologies/grouped` returns technologies grouped by category
- [x] `GET /technologies?search=` filter works
- [x] `GET /technologies?category=` filter works
- [x] `GET /jobs` returns technology strings (maintains current format)
- [x] `POST /jobs` accepts technology IDs or names
- [x] `PATCH /jobs/:id` properly updates technologies
- [ ] Admin middleware for POST/PUT/DELETE /technologies
- [ ] Frontend displays technology names correctly
- [x] Database indexes added for performance

---

## 8. Timeline Estimate

| Phase | Effort | Description |
|-------|--------|-------------|
| Phase 1 | 2-3 hours | Database migration + seed update |
| Phase 2 | 2 hours | Backend models |
| Phase 3 | 2 hours | API endpoints |
| Phase 4 | 2-3 hours | Frontend integration |
| Phase 5 | 1 hour | PostgreSQL preparation |

**Total: ~9-11 hours**

---

## 9. Dependencies

- No new npm packages required
- Uses existing better-sqlite3
- Ready for PostgreSQL (no code changes needed for migration)

---

## Implementation Notes

1. **Technology count**: 50+ technologies as listed above
2. **Admin functionality**: POST/PUT/DELETE /technologies endpoints require admin role
3. **Default technologies**: User must fill technologies manually
4. **Migration approach**: Update seed.js directly

---

## 10. User Authentication System (better-auth)

### Objective
Implement complete user authentication system with better-auth and role-based access control (RBAC)

---

### 10.1 Current State (as of 2026-05-21)

**Completed:**
- [x] `better-auth` installed in backend + frontend
- [x] `.env` configured with `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL`
- [x] Auth instance created: `backend/src/lib/auth.ts`
- [x] Auth routes mounted: `backend/src/routes/auth.ts` → `/api/auth/*`
- [x] Routes registered in `app.ts`
- [x] Database tables created via `npx auth@latest migrate`:
  - `user` (with custom `role`, `avatar`, `bio`, `resume`, `skills`, `last_name` columns)
  - `session`
  - `account`
  - `verification`
- [x] `usersRouter` registered at `/users` in `app.ts`
- [x] `role` field configured in auth.ts with `defaultValue: "seeker"`

**Database Tables:**
```
user ──────────────────────────────────────────────────────────────
  id, email, password, name, last_name, role, avatar, bio, resume,
  skills, created_at, emailVerified, image, createdAt, updatedAt

session ───────────────────────────────────────────────────────────
  id, expiresAt, token, createdAt, updatedAt, ipAddress, userAgent,
  userId (FK → user.id)

account ───────────────────────────────────────────────────────────
  id, accountId, providerId, userId (FK → user.id), accessToken,
  refreshToken, idToken, createdAt, updatedAt, ...

verification ──────────────────────────────────────────────────────
  (auto-created by better-auth)
```

**User Roles:**
| Role | Permissions |
|------|-------------|
| **seeker** | View jobs, apply to jobs, update own profile |
| **employer/recruiter** | + Create/update jobs, view applicants, see limited user info |
| **admin** | + Manage users, manage technologies, full access |

**Protected Endpoints (agreed):**
| Endpoint | Auth Required | Role Required |
|----------|---------------|---------------|
| `GET /jobs` | ❌ No | — |
| `GET /jobs/:id` | ❌ No | — |
| `POST /jobs` | ✅ Yes | recruiter, admin |
| `PUT /jobs/:id` | ✅ Yes | recruiter, admin |
| `PATCH /jobs/:id` | ✅ Yes | recruiter, admin |
| `DELETE /jobs/:id` | ✅ Yes | admin |
| `GET /users` | ✅ Yes | admin (full), recruiter (limited) |
| `GET /users/:id` | ✅ Yes | admin (full), recruiter (limited) |
| `PUT /users/:id` | ✅ Yes | admin |
| `PATCH /users/:id` | ✅ Yes | admin |
| `DELETE /users/:id` | ✅ Yes | admin |
| `POST /technologies` | ✅ Yes | admin |
| `PUT /technologies/:id` | ✅ Yes | admin |
| `DELETE /technologies/:id` | ✅ Yes | admin |

---

### 10.2 Remaining Steps

**Step 1: Create Auth Middlewares**
- [ ] `backend/src/middlewares/auth.ts` → `requireSession` middleware
  - Extract session from request using `auth.api.getSession()`
  - Attach `req.user` to request object
  - Return 401 if no valid session
- [ ] `backend/src/middlewares/auth.ts` → `requireRoles(roles[])` middleware
  - Check if `req.user.role` is in allowed roles array
  - Return 403 if role not permitted
  - Usage: `requireRoles('admin', 'recruiter')`

**Step 2: Complete Users Routes**
- [ ] `backend/src/routes/users.ts` → Implement handlers:
  - `GET /users` → Admin: full user list, Recruiter: limited fields (name, email, role only)
  - `GET /users/:id` → Same role-based field filtering
  - `PUT /users/:id` → Admin only (full update)
  - `PATCH /users/:id` → Admin only (partial update)
  - `DELETE /users/:id` → Admin only
- [ ] Create `backend/src/controllers/users.ts` → User request handlers
- [ ] Create `backend/src/models/user.ts` → User data access layer

**Step 3: Protect Job Endpoints**
- [ ] Update `backend/src/routes/jobs.ts`:
  - Add `requireSession` + `requireRoles('recruiter', 'admin')` to POST
  - Add `requireSession` + `requireRoles('recruiter', 'admin')` to PUT/PATCH
  - Add `requireSession` + `requireRoles('admin')` to DELETE
- [ ] Update `backend/src/controllers/jobs.ts`:
  - Attach `req.user` to created jobs (track who created them)

**Step 4: Protect Technology Admin Endpoints**
- [ ] Update `backend/src/routes/technologies.ts`:
  - Add `requireSession` + `requireRoles('admin')` to POST/PUT/DELETE
  - Keep GET endpoints public

**Step 5: Update TypeScript Types**
- [ ] `backend/src/types/user.ts` → Update to include better-auth session user type
- [ ] `backend/src/types/index.ts` → Add `SessionUser` interface if needed

**Step 6: (Optional) Seed Sample Users**
- [ ] Add sample users to `backend/src/db/seed.js`:
  - Admin: `admin@devjobs.com` / `admin1234`
  - Recruiter: `recruiter@company.com` / `recruit1`
  - Seeker: `seeker@test.com` / `password123`
- [ ] Note: better-auth handles password hashing automatically via sign-up API

---

### 10.3 File Structure After Completion

```
backend/src/
├── lib/
│   └── auth.ts                    ✅ Auth instance
├── routes/
│   ├── auth.ts                    ✅ Auth handler mount
│   ├── users.ts                   ⬜ User management (needs controllers)
│   ├── jobs.ts                    ⬜ Add auth middleware
│   └── technologies.ts            ⬜ Add auth middleware
├── controllers/
│   ├── jobs.ts                    ✅ Exists
│   ├── technologies.ts            ✅ Exists
│   └── users.ts                   ⬜ NEW
├── models/
│   ├── job.ts                     ✅ Exists
│   ├── technology.ts              ✅ Exists
│   └── user.ts                    ⬜ NEW
├── middlewares/
│   ├── auth.ts                    ⬜ NEW (requireSession, requireRoles)
│   ├── cors.ts                    ✅ Exists
│   └── validateSchemas.ts         ✅ Exists
└── types/
    ├── user.ts                    ⬜ Update with session types
    └── index.ts                   ✅ Exists
```

---

### 10.4 Dependencies

- `better-auth` — Already installed in backend + frontend
- No additional packages needed (better-auth handles password hashing, sessions, tokens)

---

### 10.5 Timeline Estimate

| Step | Effort | Description |
|------|--------|-------------|
| Step 1 | 30 min | Create auth middlewares |
| Step 2 | 1 hour | Complete users routes + controllers + models |
| Step 3 | 30 min | Protect job endpoints |
| Step 4 | 15 min | Protect technology admin endpoints |
| Step 5 | 15 min | Update TypeScript types |
| Step 6 | 15 min | (Optional) Seed sample users |

**Total: ~2.5 hours**

---

### 10.6 Notes

- better-auth uses cookie-based sessions by default
- Social providers (GitHub, Google) are configured but commented out in `auth.ts`
- `additionalFields` in `auth.ts` currently only has `role` — can add `lastName`, `avatar`, etc. later
- Frontend auth integration (AuthContext, sign-in/up pages) is a separate phase