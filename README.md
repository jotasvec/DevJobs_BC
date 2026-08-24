# DevJobs

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white)

A full-stack job board for developers with authentication, role-based dashboards, job posting, and application tracking.

---

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Features](#features)
- [Project Structure](#project-structure)

---

## Overview

DevJobs is a pnpm monorepo with a React 19 frontend and Express 5/TypeScript backend. It provides:

- **Job seekers**: browse/search jobs, filter by tech/modality/level, apply with cover letter
- **Recruiters**: post jobs, manage company profile, review applicants, update application statuses
- **Admins**: full access to all resources

Authentication is handled by **better-auth** with cookie-based sessions. The frontend uses **React Query** for server state and **Zod** for form validation.

---

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm 9+

### Install & Run

```bash
git clone <repo-url>
cd devjobs_react

pnpm install

# Backend (port 3050)
pnpm --filter @devjobs/api dev

# Frontend (port 5173, proxies to 3050)
pnpm --filter frontend dev
```

### Seed Database

```bash
cd backend && node src/db/seed.js
```

### Build

```bash
pnpm --filter @devjobs/api build    # TypeScript → dist/
pnpm --filter frontend build        # Vite → dist/
```

---

## Architecture

```
devjobs_react/
├── backend/              Express 5 + TypeScript
│   ├── src/
│   │   ├── config.ts             CORS, environment
│   │   ├── constants.ts          Roles, statuses, error codes
│   │   ├── db/                   SQLite database + migrations
│   │   ├── controllers/          Route handlers
│   │   ├── models/               Database queries
│   │   ├── routes/               Express routers
│   │   ├── schemas/              Zod validation schemas
│   │   ├── middlewares/          Auth, CORS, validation
│   │   ├── types/                TypeScript interfaces
│   │   └── utils/                Error handling, Zod helpers
│   └── migrations/               Numbered SQL migration files
│
├── frontend/             React 19 + Vite 7 + Tailwind CSS v4
│   ├── src/
│   │   ├── components/           Reusable UI
│   │   ├── pages/                Route pages
│   │   ├── hooks/                Custom hooks
│   │   ├── services/             API service functions
│   │   ├── schemas/              Frontend Zod schemas
│   │   ├── context/              Auth context
│   │   ├── lib/                  API client, auth client
│   │   └── router/               Protected route wrappers
│   └── vite.config.js            Proxy to localhost:3050
│
└── pnpm-workspace.yaml
```

---

## Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| React 19 | UI library |
| Vite 7 | Build tool & dev server |
| Tailwind CSS v4 | Utility-first styling |
| React Router 7 | Client-side routing |
| @tanstack/react-query | Server state management |
| Zod | Form & API validation |
| react-hook-form | Form handling |
| lucide-react | Icons |
| better-auth/react | Authentication client |

### Backend

| Technology | Purpose |
|------------|---------|
| Express 5 | Web framework |
| TypeScript (strict) | Type safety |
| better-auth | Authentication (cookie sessions) |
| better-sqlite3 | SQLite database |
| Zod | Request validation |
| tsx | Dev server (watch mode) |
| tsc | Production build |

### Dev Tools

| Tool | Purpose |
|------|---------|
| pnpm | Package manager (workspaces) |
| Git | Version control |
| ESLint | Linting |

---

## Database Schema

### Core Tables

| Table | Description |
|-------|-------------|
| `jobs` | Job postings with companyId, created_by, modality, level |
| `job_contents` | Description, responsibilities, requirements, about |
| `job_technologies` | Junction: jobs ↔ technologies |
| `company` | Company profiles (name, industry, location, website) |
| `user` | Auth users (better-auth managed) |
| `seeker_profile` | Seeker-specific data (location, modality, skills, links) |
| `recruiter_profile` | Recruiter-specific data (companyId, position, department) |
| `applications` | Job applications with status tracking & snapshot fields |
| `technologies` | 100+ technologies across 8 categories |
| `technology_categories` | Technology category grouping |

### Application Statuses

```
pending → reviewed → shortlisted → accepted / rejected
                                         ↘ withdrawn
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/sign-up/email` | Register | Public |
| `POST` | `/api/auth/sign-in/email` | Sign in | Public |
| `POST` | `/api/auth/sign-out` | Sign out | Session |
| `GET` | `/api/auth/get-session` | Current session | Session |

### Jobs

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET` | `/api/jobs` | List jobs (filterable, paginated) | Public |
| `GET` | `/api/jobs/:id` | Job details | Public |
| `POST` | `/api/jobs` | Create job | Recruiter, Admin |
| `PATCH` | `/api/jobs/:id` | Update job | Recruiter (owner), Admin |
| `DELETE` | `/api/jobs/:id` | Delete job | Admin |

**Filters:** `?text=`, `?technology=`, `?level=`, `?modality=`, `?location=`, `?createdBy=`, `?limit=`, `?offset=`

### Applications

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET` | `/api/applications` | List applications | Seeker (own), Recruiter (own jobs), Admin |
| `GET` | `/api/applications/stats/recruiter` | Aggregate stats | Recruiter, Admin |
| `GET` | `/api/applications/stats?jobId=` | Per-job stats | Recruiter, Admin |
| `GET` | `/api/applications/:id` | Application detail | Owner / Job owner |
| `POST` | `/api/applications` | Submit application | Seeker |
| `PATCH` | `/api/applications/:id` | Update status/notes | Recruiter, Admin |
| `DELETE` | `/api/applications/:id` | Withdraw application | Seeker, Recruiter, Admin |

### Companies

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET` | `/api/companies` | List companies | Public |
| `GET` | `/api/companies/:id` | Company detail | Public |
| `POST` | `/api/companies` | Create company | Recruiter, Admin |
| `PATCH` | `/api/companies/:id` | Update company | Recruiter (owner), Admin |

### Users & Profiles

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET` | `/api/users` | List users | Admin |
| `GET` | `/api/users/:id` | User + profile | Session |
| `PATCH` | `/api/users/:id` | Update user | Session |
| `GET` | `/api/users/seeker/:userId` | Seeker profile | Session |
| `GET` | `/api/users/recruiter/:userId` | Recruiter profile | Session |

### Technologies

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET` | `/api/technologies` | List technologies | Public |
| `GET` | `/api/technologies/grouped` | Grouped by category | Public |
| `GET` | `/api/technologies/categories` | List categories | Public |
| `POST` | `/api/technologies` | Create technology | Admin |
| `PATCH` | `/api/technologies/:id` | Update technology | Admin |
| `DELETE` | `/api/technologies/:id` | Delete technology | Admin |

### Response Format

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

---

## Features

### Implemented

- [x] Job listing with pagination & filtering (tech, modality, level, location)
- [x] Full-text search with debounced input
- [x] Job detail pages with company info
- [x] Company listings & profiles
- [x] better-auth authentication (cookie-based sessions)
- [x] Role-based access control (seeker, recruiter, admin)
- [x] Separate sign-up flows (seeker / recruiter)
- [x] Job application system with cover letter
- [x] Application status tracking (6 states)
- [x] Recruiter dashboard with aggregate stats
- [x] Per-job applicant management (shortlist, reject, accept)
- [x] Seeker: my applications + withdraw
- [x] Recruiter: job postings → view applicants per job
- [x] Recruiter: create job with company autocomplete
- [x] Profile editing (user info + role-specific fields)
- [x] Company profile management
- [x] Technology management (100+ technologies, 8 categories)
- [x] Dark theme with Tailwind CSS v4
- [x] Responsive sidebar navigation
- [x] Protected routes with role guards
- [x] React Query for server state caching
- [x] Zod validation on frontend & backend
- [x] Database migrations system
- [x] CORS configuration

### Planned

- [ ] Saved jobs / bookmarks
- [ ] Job recommendations based on skills
- [ ] File upload for resumes/portfolios
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] PostgreSQL migration

---

## Project Structure

```
frontend/src/
├── components/
│   ├── ApplicationForm.jsx       Job application form
│   ├── Avatar.jsx                User avatar (unavatar.io)
│   ├── CompanyForm.jsx           Company creation form
│   ├── DataTable.jsx             Reusable data table
│   ├── Footer.jsx                Site footer with nav links
│   ├── Header.jsx                Auth-aware navigation
│   ├── InputField.jsx            Form input wrapper
│   ├── Loading.jsx               Loading spinner
│   ├── SearchField.jsx           Search input
│   ├── SelectField.jsx           Select dropdown
│   ├── Sidebar.jsx               Role-based sidebar nav
│   ├── SidebarLayout.jsx         Sidebar + content layout
│   ├── StatsCards.jsx            Stats card grid
│   ├── StatusBadge.jsx           Application status badge
│   └── TextareaField.jsx         Textarea wrapper
├── pages/
│   ├── Home.jsx                  Landing page
│   ├── NotFound.jsx              404 page
│   ├── Detail/JobsDetails.jsx    Job detail page
│   ├── Jobs/                     Job listing + pagination
│   ├── companies/                Company listing + profile
│   ├── applications/             Dashboard, MyApplications, JobsPosted, ApplicationsPerJob
│   ├── createJobs/               Job creation form
│   ├── profile/                  User profile (Seeker/Recruiter)
│   ├── signIn/                   Sign in
│   ├── signUp/                   Sign up (Seeker/Recruiter)
│   └── savedJobs/                Saved jobs (placeholder)
├── hooks/
│   ├── useAuth.jsx               Auth context hook
│   ├── useCombinedSchema.jsx     Merged Zod schemas + useForm
│   ├── useCompany.jsx            Company data (React Query)
│   ├── useFilters.jsx            URL search params + pagination
│   ├── useJobs.jsx               Job fetching with AbortController
│   ├── useRouter.jsx             Navigation wrapper
│   └── useUserProfile.jsx        User + role profile fetch
├── services/
│   ├── applications.services.js  Application CRUD
│   ├── company.services.js       Company CRUD
│   ├── jobs.services.js          Job CRUD
│   └── users.services.js         User/profile CRUD
├── schemas/
│   └── jobs.js                   Frontend job Zod schemas
├── context/
│   └── AuthContext.jsx           Auth provider
├── lib/
│   ├── api.js                    HTTP client (get, post, put, patch, del)
│   └── auth-client.js            better-auth client instance
└── router/
    ├── Link.jsx                  Link & NavLink components
    └── ProtectedRoute.jsx        Auth & role route guards
```

```
backend/src/
├── controllers/
│   ├── applications.ts           Application handlers
│   ├── jobs.ts                   Job handlers
│   ├── technologies.ts           Technology handlers
│   └── users.ts                  User handlers
├── models/
│   ├── application.ts            Application SQL queries
│   ├── job.ts                    Job SQL queries
│   ├── technology.ts             Technology SQL queries
│   └── user.ts                   User SQL queries
├── routes/
│   ├── applications.ts           Application routes
│   ├── jobs.ts                   Job routes
│   ├── technologies.ts           Technology routes
│   └── users.ts                  User routes
├── schemas/
│   ├── applications.ts           Application Zod schemas
│   ├── jobs.ts                   Job Zod schemas
│   ├── profiles.ts               Profile & company Zod schemas
│   └── users.ts                  User Zod schemas
├── middlewares/
│   ├── auth.ts                   requireSession, requireRoles
│   ├── cors.ts                   CORS middleware
│   └── validateSchemas.ts        Zod validation wrapper
├── types/
│   ├── applications.ts           Application types
│   ├── index.ts                  Generic types (ApiResponse, etc.)
│   └── jobs.ts                   Job types
├── utils/
│   ├── db-errors.ts              Database error handler
│   ├── http-errors.ts            HTTP error handler
│   └── zodUtils.ts               Zod → SQL helpers
├── db/
│   ├── database.ts               SQLite connection
│   └── seed.js                   Database seeder
├── config.ts                     CORS origins
├── constants.ts                  Roles, statuses, error codes
└── index.ts                      Express app entry point
```
