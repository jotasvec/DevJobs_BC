# AGENTS.md — DevJobs

## Commands

```bash
pnpm install              # Install all workspaces (root)
pnpm --filter backend dev  # Backend dev server (tsx watch)
pnpm --filter frontend dev # Frontend dev server (vite)
pnpm --filter backend build # TypeScript compile → dist/
```

## Critical Quirks

### pnpm + native modules
`pnpm-workspace.yaml` has `allowBuilds` for `better-sqlite3`, `esbuild`, `@swc/core`.
If you see `[ERR_PNPM_IGNORED_BUILDS]`, delete lockfiles + node_modules and reinstall:
```bash
rm -rf backend/node_modules frontend/node_modules node_modules pnpm-lock.yaml
pnpm install
```

### Import extensions
Backend uses `module: "ESNext"` + `moduleResolution: "Bundler"`.
**All imports must use `.js` extension**, even when importing `.ts` files:
```ts
import { auth } from "../lib/auth";        // ❌ won't compile
import { auth } from "../lib/auth.js";     // ✅ correct
```

### Database
- SQLite file: `backend/jobs.db` (at repo root, symlinked)
- Seed: `backend/src/db/seed.js` — run manually to reset data
- better-auth tables: `user`, `session`, `account`, `verification` (created via `npx auth@latest migrate`)
- The `npx auth@latest migrate` CLI may fail if `better-sqlite3` native bindings aren't built — fix via reinstall above

## Architecture

```
backend/          Express 5 + TypeScript  (tsx dev, tsc build)
  src/lib/auth.ts                better-auth instance
  src/middlewares/auth.ts        requireSession, requireRoles
  src/middlewares/cors.ts        CORS with credentials
  src/middlewares/validateSchemas.ts  Zod validation wrapper
  src/routes/api.ts              Central API router — all routes under /api
  src/routes/auth.ts             better-auth handler at /api/auth
  src/routes/jobs.ts             Jobs CRUD
  src/routes/technologies.ts     Technologies CRUD
  src/routes/users.ts            Users CRUD (self-update + admin)
  src/routes/seekerProfile.ts    Seeker profile (GET/PUT own, GET by userId)
  src/routes/recruiterProfile.ts Recruiter profile (GET/PUT own, GET by userId)
  src/routes/companies.ts        Companies CRUD (public read, admin/recruiter write)
  src/routes/applications.ts     Applications CRUD (apply, status updates, stats)
  src/controllers/               jobs, technologies, users, seekerProfile, recruiterProfile, company, application
  src/models/                    job, technology, user, seekerProfile, recruiterProfile, company, application
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
  src/hooks/                     useAuth, useRouter, useFilters, useUserProfile, useCombinedSchema, useConfirm, useRecruiterJobs
  src/schemas/                   signUp.js, userProfile.js, seekerProfile.js, recruiterProfile.js, users.js
  src/router/                    Link, NavLink, ProtectedRoute (with isPending guard)
  src/components/                AuthForm, InputField, TextareaField, Header, Footer, Avatar, Loading, SearchField, Modal, ConfirmDialog, StatusBadge, DataTable, Sidebar
  src/components/UI/             Modal.jsx (compound: Header, Body, Footer)
  src/pages/                     Home, Jobs, JobsDetails, SignIn, SignUp (Seeker/Recruiter), Profile (User/Seeker/Recruiter), Companies, NotFound
  src/pages/applications/        MyApplications, JobsPosted, ApplicantDashboard, ApplicationsPerJob
  src/pages/Detail/              JobsDetails
  src/services/                  jobs.services.js, users.services.js, company.services.js, applications.services.js, technologies.services.js
  src/constants.js               ROLES, MODALITY, LEVEL, ROUTES, API (all /api/... prefixed), PAGINATION, UI, ERRORS, profileFields
  vite.config.js                 Dynamic proxy — derives from API constants, proxies all /api/* to backend
```

## Auth State

- better-auth uses **cookie-based sessions** (not JWT)
- Roles: `seeker` (default), `recruiter`/`employer`, `admin`
- Protected endpoints per `PLAN.md` section 10.1
- `req.user` is attached by `requireSession` middleware
- See `PLAN.md` for full endpoint → role mapping

## Conventions

- Frontend stays **JavaScript** (no TypeScript migration planned)
- Backend is **TypeScript** with strict mode
- API responses: `{ success: boolean, data?, error?, message? }`
- Zod schemas in `backend/src/schemas/` for request validation
- `validateSchemas` middleware wraps Zod schemas on routes
- `backend_js_bckup/` = old JS backend backup, do not modify

### Frontend Styling
- Tailwind CSS v4 via `@tailwindcss/vite` plugin
- Custom theme tokens in `index.css` `@theme` block
- Existing CSS variables still work alongside Tailwind
- Use Tailwind utilities for new components, migrate old CSS gradually
- Font families: `font-sans` (Inter Variable), `font-mono` (JetBrains Mono), `font-heading` (Sora)
- Theme colors: `background`, `surface`, `card`, `accent`, `text`, `text-secondary`, `text-muted`, `border`, `success`, `error`

## Plan

Full roadmap: `PLAN.md` — read before making structural changes.

## Reminder
- Don't replace any file or block if code, without supervision and after an approve.