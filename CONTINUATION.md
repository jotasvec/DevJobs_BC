# CONTINUATION.md — Setup & Continue on Another Computer

### Last Updated: 2026-07-26

---

## 1. Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 20+ | Runtime |
| pnpm | 9+ | Package manager |
| Git | 2.x | Version control |

---

## 2. Clone & Install

```bash
git clone <repo-url>
cd devjobs_react
pnpm install
```

If you see `[ERR_PNPM_IGNORED_BUILDS]` for native modules (better-sqlite3, esbuild, @swc/core):
```bash
rm -rf backend/node_modules frontend/node_modules node_modules pnpm-lock.yaml
pnpm install
```

---

## 3. Environment Variables

Create `backend/.env`:
```env
PORT=3050
NODE_ENV=development
BETTER_AUTH_SECRET=<your-secret-here>
BETTER_AUTH_URL=http://localhost:3050
```

> **Do NOT commit `.env` files.** The `.gitignore` should exclude them.
> Generate a new secret with: `openssl rand -hex 32`

---

## 4. Database Setup

```bash
# 1. Run migrations (creates tables)
cd backend && node --import tsx migrations/migrate.js

# 2. Seed data (users, companies, profiles, technologies)
pnpm --filter backend seed:users
pnpm --filter backend seed:companies
pnpm --filter backend seed:seeker
pnpm --filter backend seed:recruiter
```

The `applications` table is created by `seed.js` but NOT by migrations yet.
**Migration 006** (planned) will fix the CHECK constraint. Until then, run `seed.js` to get the table.

---

## 5. Start Development Servers

```bash
# Terminal 1 — Backend
pnpm --filter backend dev

# Terminal 2 — Frontend
pnpm --filter frontend dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3050
- API base: http://localhost:3050/api

---

## 6. Current State

### What's Done
- Full auth system (sign-up, sign-in, sessions, roles)
- Jobs CRUD with filters and pagination
- Technologies CRUD (130+ seeded)
- Users CRUD with role-based access
- Seeker & Recruiter profiles
- Companies CRUD
- Tailwind CSS v4 migration (partially complete)
- 21/21 backend tests passing

### What's Next (Phase 1 — Applications System)
See `PLAN.md` section 5 "Phase 1" for the full detailed plan.

**Quick summary:**
1. **Migration 006** — Fix `applications` table CHECK constraint (add `'reviewed'`)
2. **Backend** — Schema, types, model, controller, routes for applications
3. **Frontend** — ApplicationModal, MyApplications page, ApplicantDashboard, StatusBadge, wire ApplyButton
4. **Seed** — Add sample application data

---

## 7. Key Files to Read First

| File | Why |
|------|-----|
| `PLAN.md` | Full roadmap, conventions, what's done vs next |
| `SPECS.md` | API specs, component specs, DB schema |
| `AGENTS.md` | Dev commands, critical quirks, conventions |
| `backend/src/constants.ts` | All constants (roles, statuses, messages, tables) |
| `frontend/src/constants.js` | Frontend constants (routes, API paths, UI text) |
| `backend/src/routes/api.ts` | How routes are registered |
| `backend/src/routes/jobs.ts` | Route pattern to follow |
| `backend/src/models/job.ts` | Model pattern to follow |
| `backend/src/controllers/jobs.ts` | Controller pattern to follow |

---

## 8. Conventions (Critical)

- **All TypeScript imports** must use `.js` extension: `import { x } from './file.js'`
- **Backend package name**: `@devjobs/api` — use `pnpm --filter @devjobs/api build`
- **API paths**: All prefixed with `/api` (frontend constants + backend router)
- **API responses**: `{ success: boolean, data?, error?, message? }`
- **Frontend**: JavaScript only (no TypeScript)
- **Backend**: TypeScript with strict mode
- **Zod schemas** in `backend/src/schemas/` for request validation
- **Constants** centralized in both `backend/src/constants.ts` and `frontend/src/constants.js`
- **Tailwind v4**: Use `@theme` block for tokens, `@utility` for shared classes
- **DB**: SQLite file at `backend/jobs.db`
- **Migrations**: Numbered `.sql` files in `backend/migrations/`

---

## 9. Git Status

```bash
git status          # Check current changes
git log --oneline -5  # Recent commits
git diff             # See what changed
```

The `main` branch may be ahead of `origin/main`. Push with:
```bash
git push origin main
```

---

## 10. Common Issues

### Native module build errors
```bash
rm -rf backend/node_modules frontend/node_modules node_modules pnpm-lock.yaml
pnpm install
```

### TypeScript import errors
All imports must use `.js` extension:
```ts
import { auth } from '../lib/auth.js';  // ✅
import { auth } from '../lib/auth';     // ❌
```

### better-auth migrate CLI fails
The `npx auth@latest migrate` CLI may fail if `better-sqlite3` native bindings aren't built. Fix via reinstall above.

### Database already exists
If `jobs.db` exists and you want a fresh start:
```bash
rm backend/jobs.db
cd backend && node --import tsx migrations/migrate.js
# Then re-seed
```
