# PLAN.md - DevJobs Implementation Roadmap

### Project: DevJobs
### Last Updated: 2026-07-18
### Stack: Express 5 + TypeScript (backend) | React 19 + Vite 7 + JavaScript (frontend)

---

## 1. Architecture Overview

```
backend/          Express 5 + TypeScript  (tsx dev, tsc build)
  src/lib/auth.ts            better-auth instance
  src/middlewares/auth.ts     requireSession, requireRoles
  src/middlewares/cors.ts     CORS with credentials
  src/middlewares/validateSchemas.ts  Zod validation wrapper
  src/routes/                auth, jobs, technologies, users
  src/controllers/           jobs, technologies, users
  src/models/                job, technology, user
  src/schemas/               jobs, technologies, users (Zod)
  src/types/                 TypeScript interfaces
  src/db/                    database.ts, seed.js, seed-users.ts
  src/__tests__/             setup.ts, api.test.ts

frontend/         React 19 + Vite 7 + JavaScript (no TS)
  src/context/               AuthContext, AuthProvider
  src/lib/auth-client.js     better-auth client (signIn, signUp, signOut, useSession)
  src/hooks/                 useAuth, useRouter, useFilters
  src/schemas/               signUp.js (Zod)
  src/router/                Link, NavLink, ProtectedRoute
  src/components/            AuthForm, InputField, Header, Footer, Avatar, Loading, SearchField
  src/pages/                 Home, Jobs, JobsDetails, SignIn, SignUp (Seeker/Recruiter), Profile, NotFound
```

---

## 2. What's Done

### 2.1 Backend - Fully Working

| Area | Status | Details |
|------|--------|---------|
| Auth (better-auth) | ✅ | Email/password, cookie sessions, role field (seeker/recruiter/admin) |
| Auth middlewares | ✅ | `requireSession`, `requireRoles(...)` |
| CORS | ✅ | Credentials enabled, origin whitelist |
| Jobs CRUD | ✅ | Full CRUD with role-based protection |
| Technologies CRUD | ✅ | Full CRUD with admin protection, 130+ seeded |
| Users CRUD | ✅ | Full CRUD with role-based field filtering |
| Zod validation | ✅ | Schemas for jobs, technologies, users |
| Database | ✅ | SQLite with 9 tables, WAL mode |
| Tests | ✅ | 21/21 passing |
| TypeScript build | ✅ | `tsc` compiles clean |

### 2.2 Frontend - Auth Integrated

| Area | Status | Details |
|------|--------|---------|
| Auth client | ✅ | `createAuthClient` from `better-auth/react` |
| AuthProvider | ✅ | Session management, `user`, `isLoggedIn`, `logout` |
| SignIn page | ✅ | `signIn.email()`, post-login redirect via `state.from` |
| SignUp (Seeker) | ✅ | `useForm` + `zodResolver`, `signUp.email({ role: "seeker" })`, auto-login |
| SignUp (Recruiter) | ✅ | Same pattern, `role: "recruiter"` |
| ProtectedRoute | ✅ | Redirects to `/signin` with `state.from` |
| Header | ✅ | Auth-aware, logout redirects to `/` |
| Vite proxy | ✅ | `/api`, `/users`, `/jobs`, `/technologies` |
| Zod schema (frontend) | ✅ | `signUp.js` with password complexity rules |
| InputField component | ✅ | Reusable, supports react-hook-form `register` |
| AuthForm component | ✅ | Sign-in/sign-up modes, error display |

### 2.3 Pages Working

| Page | Route | Status |
|------|-------|--------|
| Home | `/` | ✅ Hero, search, quick filters |
| Jobs | `/jobs` | ✅ Filterable list with pagination |
| Job Detail | `/jobs/:jobID` | ✅ Full detail view, ApplyButton |
| SignIn | `/signin` | ✅ Auth wired, redirect back |
| SignUp (Seeker) | `/signup` | ✅ Zod + useForm + auto-login |
| SignUp (Recruiter) | `/r_signup` | ✅ Same pattern |
| Profile | `/profile/:userID` | ✅ Protected, fetches user data |
| 404 | `*` | ✅ Not found page |

---

## 3. What's Next

### Phase 1: Applications System (Priority: HIGH)

The `applications` table exists in the DB but has no API or UI.

**Backend:**
- [ ] Create `backend/src/schemas/applications.ts` — Zod schema for application input
- [ ] Create `backend/src/models/application.ts` — Application model (create, getByJob, getByUser, updateStatus, delete)
- [ ] Create `backend/src/controllers/application.ts` — Application controller
- [ ] Create `backend/src/routes/applications.ts` — Application routes
- [ ] Register routes in `app.ts`
- [ ] Protect endpoints:
  - `POST /applications` — seeker only (apply to job)
  - `GET /applications?jobId=` — recruiter/admin (view applicants for their jobs)
  - `GET /applications?userId=` — seeker (view own applications)
  - `PATCH /applications/:id` — recruiter/admin (update status)
  - `DELETE /applications/:id` — seeker (withdraw application)

**Frontend:**
- [ ] Wire ApplyButton to `POST /applications` with session cookie
- [ ] Create applicant dashboard page (recruiter view)
- [ ] Create "My Applications" page (seeker view)

### Phase 2: Profile Improvements (Priority: MEDIUM)

**Backend:**
- [ ] Add `PATCH /users/:id` for self-profile update (seeker updates own bio, skills, resume)
- [ ] Add `POST /users/:id/avatar` for avatar upload (or use external service)

**Frontend:**
- [ ] Create profile edit form with `useForm` + Zod
- [ ] Add technology multi-select for skills
- [ ] Recruiter profile page (company info, posted jobs)

### Phase 3: Job Management (Priority: MEDIUM)

**Backend:**
- [ ] Add `GET /jobs?createdBy=` filter (recruiter sees own jobs)

**Frontend:**
- [ ] Job creation form (recruiter) with technology dropdown from `/technologies`
- [ ] Job edit form (recruiter)
- [ ] "My Jobs" dashboard (recruiter)

### Phase 4: Polish & Cleanup (Priority: LOW)

- [ ] Fix `NotFound.jsx` Spanish text → English
- [ ] Fix Header: hardcoded Avatar username → `user.name`
- [ ] Fix Header: empty `<a href="">` for Companies/Salaries → disabled or real routes
- [ ] Remove unused TypeScript types (`Seeker`, `Recruiter`, `Admin`, `Company` interfaces)
- [ ] Add missing test coverage (PATCH, PUT, DELETE endpoints)
- [ ] Social auth providers (GitHub, Google) — currently commented out in `auth.ts`

---

## 4. Database Schema

```sql
-- better-auth tables (via npx auth@latest migrate)
user            (id, email, password, name, role, bio, resume, skills, image, emailVerified, createdAt, updatedAt)
session         (id, expiresAt, token, userId, ipAddress, userAgent, createdAt, updatedAt)
account         (id, accountId, providerId, userId, accessToken, refreshToken, ...)
verification    (id, identifier, value, expiresAt, createdAt, updatedAt)

-- Application tables (via seed.js)
jobs            (id, title, company, location, description, modality, level, created_at, created_by)
job_contents    (id, job_id, description, responsibilities, requirements, about)
technologies    (id, name, category, created_at)
technology_categories (id, name, description)
job_technologies (id, job_id, technology_id)
applications    (id, user_id, job_id, status, cover_letter, created_at)
```

---

## 5. Protected Endpoints

| Endpoint | Auth Required | Role Required |
|----------|---------------|---------------|
| `GET /jobs` | ❌ | — |
| `GET /jobs/:id` | ❌ | — |
| `POST /jobs` | ✅ | recruiter, admin |
| `PUT /jobs/:id` | ✅ | recruiter, admin |
| `PATCH /jobs/:id` | ✅ | recruiter, admin |
| `DELETE /jobs/:id` | ✅ | admin |
| `GET /technologies` | ❌ | — |
| `POST /technologies` | ✅ | admin |
| `PUT /technologies/:id` | ✅ | admin |
| `DELETE /technologies/:id` | ✅ | admin |
| `GET /users` | ✅ | admin (full), recruiter (limited) |
| `GET /users/:id` | ✅ | admin (full), recruiter (limited) |
| `PUT /users/:id` | ✅ | admin |
| `PATCH /users/:id` | ✅ | admin |
| `DELETE /users/:id` | ✅ | admin |
| `POST /applications` | ✅ | seeker |
| `GET /applications` | ✅ | seeker (own), recruiter (job applicants), admin (all) |
| `PATCH /applications/:id` | ✅ | recruiter, admin |
| `DELETE /applications/:id` | ✅ | seeker (own), admin |

---

## 6. Environment Variables

```env
# Backend (.env)
PORT=3050
BETTER_AUTH_SECRET=your_secret_here
BETTER_AUTH_URL=http://localhost:3050
DATABASE_URL=./jobs.db
```

---

## 7. Commands

```bash
pnpm install                    # Install all workspaces
pnpm --filter @devjobs/api dev  # Backend dev server
pnpm --filter frontend dev      # Frontend dev server
pnpm --filter @devjobs/api build # TypeScript compile
pnpm --filter @devjobs/api test  # Run tests
```
