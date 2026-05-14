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

## 10. User Authentication System

### Objective
Implement complete user authentication system with JWT and role-based access control (RBAC)

---

### 10.1 Overview

Create a secure authentication system that supports:
- User registration and login
- JWT-based authentication
- Role-based access control (seeker, employer, admin)
- Token refresh mechanism

---

### 10.2 Database Changes

```sql
-- Add columns to existing users table
ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT 1;
ALTER TABLE users ADD COLUMN last_login DATETIME;

-- New table for refresh tokens
CREATE TABLE refresh_tokens (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

### 10.3 New Files to Create

| File | Purpose |
|------|---------|
| `backend/models/user.js` | User CRUD operations |
| `backend/models/auth.js` | Authentication operations |
| `backend/routes/auth.js` | Auth routes (login, register, logout, refresh) |
| `backend/routes/users.js` | User management routes |
| `backend/controllers/auth.js` | Auth request handlers |
| `backend/controllers/users.js` | User request handlers |
| `backend/schemas/user.js` | User validation schemas |
| `backend/middlewares/auth.js` | JWT verification middleware |
| `backend/middlewares/admin.js` | Admin role verification |

---

### 10.4 User Roles

| Role | Permissions |
|------|-------------|
| **seeker** | View jobs, apply to jobs, update own profile |
| **employer** | + Create jobs, update own jobs, view applicants |
| **admin** | + Manage users, manage technologies, full access |

---

### 10.5 API Endpoints

**Authentication:**
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| **POST** | `/auth/register` | Register new user | No |
| **POST** | `/auth/login` | Login (returns JWT) | No |
| **POST** | `/auth/logout` | Invalidate refresh token | Yes |
| **POST** | `/auth/refresh` | Refresh expired JWT | No |

**User Management:**
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| **GET** | `/users/me` | Get current user profile | Yes |
| **PUT** | `/users/me` | Update own profile | Yes |
| **GET** | `/users` | List all users | Admin |
| **PUT** | `/users/:id/role` | Change user role | Admin |
| **PUT** | `/users/:id/status` | Activate/deactivate user | Admin |

---

### 10.6 JWT Implementation

- **Access token**: 15 minutes expiry, contains user ID and role
- **Refresh token**: 7 days expiry, stored in database
- **Payload**: `{ userId, email, role }`
- **Secret**: Stored in environment variable `JWT_SECRET`

---

### 10.7 Implementation Steps

**Step 1: Install Dependencies**
```bash
npm install jsonwebtoken bcryptjs
```

**Step 2: Update seed.js**
- Add sample users (seeker, employer, admin)
- Add is_active and last_login columns to users table

**Step 3: Create Models**
- `backend/models/user.js` - User CRUD
- `backend/models/auth.js` - Token management

**Step 4: Create Schemas**
- `backend/schemas/user.js` - Registration/login validation

**Step 5: Create Middlewares**
- `backend/middlewares/auth.js` - Verify JWT
- `backend/middlewares/admin.js` - Verify admin role

**Step 6: Create Controllers**
- `backend/controllers/auth.js` - Login, register, logout, refresh
- `backend/controllers/users.js` - User management

**Step 7: Create Routes**
- `backend/routes/auth.js` - Auth endpoints
- `backend/routes/users.js` - User management endpoints

**Step 8: Register Routes**
- Add to `backend/app.js`

**Step 9: Test**
- Verify login/logout/JWT works
- Verify role-based access

---

### 10.8 Acceptance Criteria

- [ ] Users can register with email and password
- [ ] Users can login and receive JWT
- [ ] Protected routes require valid JWT
- [ ] Admin routes require admin role
- [ ] Token refresh works correctly
- [ ] Logout invalidates refresh token
- [ ] Role-based access control works

---

### 10.9 Dependencies

- `jsonwebtoken` - JWT generation and verification
- `bcryptjs` - Password hashing

---

### 10.10 Timeline Estimate

| Step | Effort | Description |
|------|--------|-------------|
| Step 1 | 5 min | Install dependencies |
| Step 2 | 30 min | Update seed with sample users |
| Step 3 | 1 hour | Create models |
| Step 4 | 30 min | Create schemas |
| Step 5 | 30 min | Create middlewares |
| Step 6 | 1 hour | Create controllers |
| Step 7 | 30 min | Create routes |
| Step 8 | 15 min | Register routes |
| Step 9 | 1 hour | Test and fix |

**Total: ~5 hours**