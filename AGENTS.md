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
  src/lib/auth.ts       better-auth instance
  src/middlewares/auth.ts  requireSession, requireRoles
  src/routes/           auth, jobs, technologies, users
  src/controllers/      jobs, technologies
  src/models/           job, technology

frontend/         React 19 + Vite 7 + JavaScript (no TS)
  src/context/AuthContext.jsx  Auth provider (better-auth/react client)
  src/lib/auth-client.js     better-auth client instance
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

## Plan

Full roadmap: `PLAN.md` — read before making structural changes.

## Reminder
- Don't replace any file or block if code, without supervision and after an approve.