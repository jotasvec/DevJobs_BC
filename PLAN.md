# PLAN.md - DevJobs Implementation Roadmap

### Project: DevJobs
### Last Updated: 2026-07-21
### Stack: Express 5 + TypeScript (backend) | React 19 + Vite 7 + Tailwind CSS v4 + JavaScript (frontend)

---

## 1. Architecture Overview

```
backend/          Express 5 + TypeScript  (tsx dev, tsc build)
  src/lib/auth.ts                better-auth instance
  src/middlewares/auth.ts        requireSession, requireRoles (global Request augmentation)
  src/middlewares/cors.ts        CORS with credentials
  src/middlewares/validateSchemas.ts  Zod validation wrapper
  src/routes/api.ts              Central API router — all routes mounted under /api
  src/routes/auth.ts             better-auth handler at /api/auth
  src/routes/jobs.ts             Jobs CRUD
  src/routes/technologies.ts     Technologies CRUD
  src/routes/users.ts            Users CRUD (self-update + admin)
  src/routes/seekerProfile.ts    Seeker profile (GET/PUT own, GET by userId)
  src/routes/recruiterProfile.ts Recruiter profile (GET/PUT own, GET by userId)
  src/routes/companies.ts        Companies CRUD (public read, admin write)
  src/controllers/               jobs, technologies, users, seekerProfile, recruiterProfile, company
  src/models/                    job, technology, user, seekerProfile, recruiterProfile, company
  src/schemas/                   jobs, technologies, users, profiles (Zod)
  src/types/                     TypeScript interfaces
  src/constants.ts               ROLES, HTTP_STATUS, ERROR_CODES, MESSAGES, TABLES, PAGINATION
  src/db/                        database.ts, seed.js, seed-users.ts, seed-companies.ts, seed-seeker.ts, seed-recruiter.ts
  migrations/                    001-005 .sql files + migrate.js runner
  src/__tests__/                 setup.ts, api.test.ts

frontend/         React 19 + Vite 7 + Tailwind CSS v4 + JavaScript (no TS)
  src/context/AuthContext.jsx    AuthContext (createContext)
  src/context/AuthProvider.jsx   Session provider (useSession, signOut, refetch)
  src/lib/auth-client.js         better-auth client (signIn, signUp, signOut, useSession)
  src/hooks/                     useAuth, useRouter, useFilters
  src/schemas/                   signUp.js, userProfile.js, seekerProfile.js, recruiterProfile.js, users.js
  src/router/                    Link, NavLink, ProtectedRoute (with isPending guard)
  src/components/                AuthForm, InputField, Header, Footer, Avatar, Loading, SearchField
  src/pages/                     Home, Jobs, JobDetail, SignIn, SignUp (Seeker/Recruiter), Profile (User/Seeker/Recruiter), Companies, NotFound
  src/constants.js               ROLES, MODALITY, LEVEL, ROUTES, API (all /api/... prefixed), PAGINATION, UI, ERRORS, profileFields
  vite.config.js                 Dynamic proxy — derives from API constants, proxies all /api/* to backend
```

---

## 2. What's Done

### 2.1 Backend - Fully Working

| Area | Status | Details |
|------|--------|---------|
| Auth (better-auth) | ✅ | Email/password, cookie sessions, role field (seeker/recruiter/admin), lastName field |
| Auth middlewares | ✅ | `requireSession`, `requireRoles(...)` with global Request augmentation |
| CORS | ✅ | Credentials enabled, origin whitelist |
| All routes under `/api` | ✅ | Central `api.ts` router, auth at `/api/auth` |
| Jobs CRUD | ✅ | Full CRUD with role-based protection, `created_by` tracking |
| Technologies CRUD | ✅ | Full CRUD with admin protection, 130+ seeded |
| Users CRUD | ✅ | Self-update via PATCH (session-based), admin-only PUT/DELETE, role-based field filtering |
| Seeker Profile | ✅ | GET/PUT own profile, GET by userId, Zod validation |
| Recruiter Profile | ✅ | GET/PUT own profile, GET by userId, Zod validation |
| Companies | ✅ | Public read, admin write (CRUD), FK to jobs |
| Zod validation | ✅ | Schemas for jobs, technologies, users, profiles |
| Database | ✅ | SQLite with 13 tables + `_migrations`, WAL mode |
| Migrations system | ✅ | Numbered .sql files (001-005) + migrate.js runner |
| Tests | ✅ | 21/21 passing |
| TypeScript build | ✅ | `tsc` compiles clean |

### 2.2 Frontend - Fully Working

| Area | Status | Details |
|------|--------|---------|
| Auth client | ✅ | `createAuthClient` from `better-auth/react` |
| AuthProvider | ✅ | Session management, `user`, `isLoggedIn`, `isPending`, `logout`, `refetch` |
| ProtectedRoute | ✅ | Handles `isPending` (shows loading) before checking `isLoggedIn` |
| SignIn page | ✅ | `signIn.email()`, post-login redirect via `state.from` |
| SignUp (Seeker) | ✅ | `useForm` + `zodResolver`, `signUp.email({ role: "seeker" })`, auto-login |
| SignUp (Recruiter) | ✅ | Same pattern, `role: "recruiter"` |
| Header | ✅ | Auth-aware, profile link with user.id, logout |
| Vite proxy | ✅ | Dynamic — derives proxy routes from API constants, `/api/*` → backend |
| Zod schemas (frontend) | ✅ | signUp.js, userProfile.js, seekerProfile.js, recruiterProfile.js |
| InputField component | ✅ | Reusable, supports react-hook-form `register` |
| AuthForm component | ✅ | Sign-in/sign-up modes, error display |
| Tailwind CSS v4 | ✅ | Installed with @tailwindcss/vite, theme configured |

### 2.3 Pages Working

| Page | Route | Status |
|------|-------|--------|
| Home | `/` | ✅ Hero, search, quick filters |
| Jobs | `/jobs` | ✅ Filterable list with pagination, debounced search |
| Job Detail | `/jobs/:jobID` | ✅ Full detail view, ApplyButton (placeholder) |
| Companies | `/companies` | ✅ Company listing page (placeholder) |
| SignIn | `/signin` | ✅ Auth wired, redirect back |
| SignUp (Seeker) | `/signup` | ✅ Zod + useForm + auto-login |
| SignUp (Recruiter) | `/r_signup` | ✅ Same pattern |
| Profile | `/profile/:userID` | ✅ Protected (isPending guard), fetches user + role-specific profile, combined Zod schema, save via PATCH + PUT |
| 404 | `*` | ✅ Not found page |

---

## 3. API Endpoints (Current State)

All backend routes are prefixed with `/api` (mounted via `api.ts`).

### Auth (`/api/auth`)
| Endpoint | Auth | Notes |
|----------|------|-------|
| `POST /api/auth/sign-in/email` | ❌ | better-auth built-in |
| `POST /api/auth/sign-up/email` | ❌ | better-auth built-in |
| `POST /api/auth/sign-out` | ✅ | better-auth built-in |
| `GET /api/auth/get-session` | ✅ | better-auth built-in, returns user + session |

### Jobs (`/api/jobs`)
| Endpoint | Auth | Role |
|----------|------|------|
| `GET /api/jobs` | ❌ | Public, supports query filters |
| `GET /api/jobs/:id` | ❌ | Public |
| `POST /api/jobs` | ✅ | recruiter, admin |
| `PATCH /api/jobs/:id` | ✅ | recruiter, admin |
| `PUT /api/jobs/:id` | ✅ | recruiter, admin |
| `DELETE /api/jobs/:id` | ✅ | admin |

### Users (`/api/users`)
| Endpoint | Auth | Role |
|----------|------|------|
| `GET /api/users` | ✅ | admin (full), recruiter (limited) |
| `GET /api/users/:id` | ✅ | self (full), recruiter (limited) |
| `PATCH /api/users/:id` | ✅ | self (no role escalation), admin (all fields) |
| `PUT /api/users/:id` | ✅ | admin only |
| `DELETE /api/users/:id` | ✅ | admin only |

### Seeker Profile (`/api/users`)
| Endpoint | Auth | Role |
|----------|------|------|
| `GET /api/users/me/seeker-profile` | ✅ | seeker (own) |
| `PUT /api/users/me/seeker-profile` | ✅ | seeker (own), Zod validated |
| `GET /api/users/seeker-profile/:userId` | ✅ | any authenticated |

### Recruiter Profile (`/api/users`)
| Endpoint | Auth | Role |
|----------|------|------|
| `GET /api/users/me/recruiter-profile` | ✅ | recruiter (own) |
| `PUT /api/users/me/recruiter-profile` | ✅ | recruiter (own), Zod validated |
| `GET /api/users/recruiter-profile/:userId` | ✅ | any authenticated |

### Companies (`/api/companies`)
| Endpoint | Auth | Role |
|----------|------|------|
| `GET /api/companies` | ❌ | Public |
| `GET /api/companies/:id` | ❌ | Public |
| `POST /api/companies` | ✅ | admin |
| `PATCH /api/companies/:id` | ✅ | admin |
| `DELETE /api/companies/:id` | ✅ | admin |

### Technologies (`/api/technologies`)
| Endpoint | Auth | Role |
|----------|------|------|
| `GET /api/technologies` | ❌ | Public |
| `GET /api/technologies/grouped` | ❌ | Public |
| `GET /api/technologies/categories` | ❌ | Public |
| `GET /api/technologies/category/:category` | ❌ | Public |
| `GET /api/technologies/:id` | ❌ | Public |
| `POST /api/technologies` | ✅ | admin |
| `PUT /api/technologies/:id` | ✅ | admin |
| `DELETE /api/technologies/:id` | ✅ | admin |

---

## 4. Database Schema

### Current Tables (13 + _migrations)

```sql
-- better-auth tables (created via npx auth@latest migrate)
user            (id, email, name, lastName, role, bio, emailVerified, image, createdAt, updatedAt)
session         (id, expiresAt, token, userId, ipAddress, userAgent, createdAt, updatedAt)
account         (id, accountId, providerId, userId, accessToken, refreshToken, ...)
verification    (id, identifier, value, expiresAt, createdAt, updatedAt)

-- Application tables (via seed.js)
jobs            (id, title, company, location, modality, level, salaryMin, salaryMax, created_at, created_by FK→user)
job_contents    (id, job_id, description, responsibilities, requirements, about)
technologies    (id, name, category, created_at)
technology_categories (id, name, description)
job_technologies (id, job_id, technology_id)
applications    (id, user_id, job_id, status, cover_letter, created_at)

-- Profile tables (via migrations 001-005)
company         (id, name, description, website, logo, industry, size, location, createdAt)
seeker_profile  (userId FK→user, resumeUrl, linkedin, github, portfolio, expectedSalary, modality, location, experienceYears)
recruiter_profile (userId FK→user, companyId FK→company, position, phone, department)

-- Migration tracking
_migrations     (id, name, applied_at)
```

### Migrations
| File | Purpose |
|------|---------|
| `001_create_company.sql` | Create company table |
| `002_create_user_profile_tables.sql` | Create seeker_profile + recruiter_profile |
| `003_add_company_id_to_jobs.sql` | Add companyId FK to jobs |
| `004_drop_user_columns.sql` | Drop resume + skills from user |
| `005_drop_recruiter_bio.sql` | Drop bio from recruiter_profile |
| `migrate.js` | Runner with `_migrations` tracking |

---

## 5. What's Next

### Phase 0: Frontend Redesign with Tailwind (Priority: HIGH - IN PROGRESS)

- [x] Install Tailwind CSS v4 + @tailwindcss/vite
- [x] Configure theme tokens matching existing colors
- [ ] Migrate Header component to Tailwind utilities
- [ ] Migrate Job cards to Tailwind utilities
- [ ] Migrate Auth forms (SignIn, SignUp) to Tailwind utilities
- [ ] Migrate Profile page to Tailwind utilities
- [ ] Remove unused CSS from index.css

### Phase 1: Applications System (Priority: HIGH)

The `applications` table exists in the DB but has no API or UI.

**Backend:**
- [ ] Create `backend/src/schemas/applications.ts` — Zod schema for application input
- [ ] Create `backend/src/models/application.ts` — Application model (create, getByJob, getByUser, updateStatus, delete)
- [ ] Create `backend/src/controllers/application.ts` — Application controller
- [ ] Create `backend/src/routes/applications.ts` — Application routes
- [ ] Register routes in `api.ts`
- [ ] Protect endpoints:
  - `POST /api/applications` — seeker only (apply to job)
  - `GET /api/applications?jobId=` — recruiter/admin (view applicants for their jobs)
  - `GET /api/applications?userId=` — seeker (view own applications)
  - `PATCH /api/applications/:id` — recruiter/admin (update status)
  - `DELETE /api/applications/:id` — seeker (withdraw application)

**Frontend:**
- [ ] Wire ApplyButton on JobDetail page to `POST /api/applications` with session cookie
- [ ] Create "My Applications" page — seeker views own applications with status
- [ ] Create applicant dashboard — recruiter views applicants per job
- [ ] Add application status badge component

### Phase 2: Job Management for Recruiters (Priority: HIGH)

**Backend:**
- [ ] Add `GET /api/jobs?createdBy=` filter (recruiter sees own jobs)

**Frontend:**
- [ ] Job creation form (recruiter) with technology multi-select from `/api/technologies`
- [ ] Job edit form (recruiter)
- [ ] "My Jobs" dashboard (recruiter) — list, edit, delete own jobs

### Phase 3: Profile Polish (Priority: MEDIUM)

**Frontend:**
- [ ] Profile save success/error feedback (toast or inline message)
- [ ] Clean `reset()` calls — spread `userData.data` not `userData`
- [ ] Recruiter profile: company dropdown with create-new option
- [ ] Avatar upload or integration with external service

### Phase 4: Polish & Cleanup (Priority: LOW)

- [ ] Fix Header: hardcoded Avatar username → `user.name` or `user.email`
- [ ] Fix Header: empty `<a href="">` for Companies/Salaries → disabled or real routes
- [ ] Fix `NotFound.jsx` — ensure consistent English text
- [ ] Social auth providers (GitHub, Google) — currently commented out in `auth.ts`
- [ ] Add missing test coverage (profile endpoints, PATCH self-update)
- [ ] Update AGENTS.md — architecture section is stale (doesn't mention profiles, companies, migrations)

---

## 6. Environment Variables

```env
# Backend (.env)
PORT=3050
BETTER_AUTH_SECRET=your_secret_here
BETTER_AUTH_URL=http://localhost:3050
FRONTEND_URL=http://localhost:5173
DATABASE_URL=./jobs.db
```

---

## 7. Commands

```bash
pnpm install                      # Install all workspaces (root)
pnpm --filter backend dev         # Backend dev server (tsx watch)
pnpm --filter frontend dev        # Frontend dev server (vite)
pnpm --filter backend build       # TypeScript compile
pnpm --filter backend test        # Run tests

# Database
cd backend && node --import tsx migrations/migrate.js   # Run pending migrations
pnpm --filter backend db          # Run migrations (alias)
pnpm --filter backend seed:users  # Seed users via better-auth
pnpm --filter backend seed:companies  # Seed companies
pnpm --filter backend seed:seeker # Seed seeker profiles
pnpm --filter backend seed:recruiter # Seed recruiter profiles

# Opencode custom commands
opencode /verify-backend           # Build + test backend
opencode /verify-frontend          # Build frontend
opencode /migrate                  # Run migrations
opencode /seed                     # Seed all data
opencode /db-status                # Check migration status
opencode /db-reset                 # Reset DB (drop + migrate + seed)
```

---

## 8. Conventions

- Frontend stays **JavaScript** (no TypeScript migration planned)
- Backend is **TypeScript** with strict mode
- API responses: `{ success: boolean, data?, error?, message? }`
- All imports use `.js` extension (Bundler moduleResolution)
- Zod schemas in `backend/src/schemas/` for request validation
- `validateSchemas` middleware wraps Zod schemas on routes
- Constants centralized in `backend/src/constants.ts` and `frontend/src/constants.js`
- All API paths prefixed with `/api` (frontend constants, backend router)
- `backend_js_bckup/` = old JS backend backup, do not modify
- Tailwind CSS v4 with custom theme tokens (`--color-*`, `--font-*`)
- Theme colors: `background`, `surface`, `card`, `accent`, `text`, `text-secondary`, `text-muted`, `border`, `success`, `error`
- Prefer Tailwind utilities over inline styles or CSS modules for new components
- Existing CSS in `index.css` (~1500 lines) will be migrated gradually
