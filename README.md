# DevJobs

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white)

A full-stack job board application for developers with user authentication, job posting management, and technology filtering.

---

## Table of Contents

- [Overview](#overview)
- [Technologies & Frameworks](#technologies--frameworks)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Features](#features)

---

## Overview

DevJobs is a monorepo project with a React frontend and Express/TypeScript backend. It provides:

- Job listing and search with technology filtering
- Normalized technology management (100+ technologies across 8 categories)
- User authentication with role-based access control (seeker, employer, admin)
- Job applications system
- RESTful API with TypeScript for type safety


---

## Technologies & Frameworks

### Frontend

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)
![React Spinners](https://img.shields.io/badge/React_Spinners-FF6B6B?style=for-the-badge)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.x | UI Library |
| Vite | 7.x | Build tool & dev server |
| React Router | 7.x | Client-side routing |
| React Spinners | 0.17 | Loading indicators |
| ESLint | 9.x | Linting |

### Backend

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white)
![tsx](https://img.shields.io/badge/tsx-3178C6?style=for-the-badge)

| Technology | Version | Purpose |
|------------|---------|---------|
| Express | 5.x | Web framework |
| TypeScript | 6.x | Type safety |
| better-sqlite3 | 7.x | SQLite database |
| Zod | 4.x | Schema validation |
| tsx | 4.x | TypeScript execution |
| CORS | 2.x | Cross-origin support |
| dotenv | 17.x | Environment variables |

### Development Tools

![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)

| Tool | Purpose |
|------|---------|
| pnpm | Package manager |
| TypeScript | Type checking & compilation |
| Git | Version control |


---

## Database Schema

### Core Tables

| Table | Description |
|-------|-------------|
| `jobs` | Job postings (title, company, location, modality, level) |
| `job_contents` | Detailed job content (description, responsibilities, requirements, about) |
| `job_technologies` | Junction table linking jobs to technologies |
| `users` | User accounts with roles (seeker, employer, admin) |
| `applications` | Job applications from seekers |
| `technologies` | Reference table of 100+ technologies |
| `technology_categories` | Categories for organizing technologies |

### Entity Relationship

```
┌──────────────┐       ┌────────────────────┐       ┌──────────────┐
│    jobs      │──────<│ job_technologies   │>───── │ technologies │
└──────────────┘       └────────────────────┘       └──────────────┘
       │                                              ▲
       │                                              │
       v                                              │
┌──────────────┐                              ┌──────────────┐
│ job_contents │                              │ technology   │
└──────────────┘                              │ _categories  │
                                              └──────────────┘
```

---

## API Endpoints

### Jobs API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/jobs` | List all jobs with filtering |
| `GET` | `/jobs/:id` | Get single job details |
| `POST` | `/jobs` | Create new job |
| `PATCH` | `/jobs/:id` | Partial update job |
| `PUT` | `/jobs/:id` | Full replace job |
| `DELETE` | `/jobs/:id` | Delete job |

**Query Parameters:**
- `?title=` - Search by title
- `?text=` - Full-text search
- `?level=` - Filter by level (junior, mid, senior)
- `?modality=` - Filter by modality (remote, onsite, hybrid)
- `?technology=` - Filter by technology
- `?location=` - Filter by location
- `?limit=` - Pagination limit (default: 10)
- `?offset=` - Pagination offset

### Technologies API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/technologies` | List all technologies |
| `GET` | `/technologies/grouped` | Technologies grouped by category |
| `GET` | `/technologies/categories` | List all categories |
| `GET` | `/technologies/category/:category` | Get technologies by category |
| `GET` | `/technologies/:id` | Get single technology |
| `POST` | `/technologies` | Create technology (admin) |
| `PATCH` | `/technologies/:id` | Update technology (admin) |
| `DELETE` | `/technologies/:id` | Delete technology (admin) |

**Query Parameters:**
- `?category=` - Filter by category
- `?search=` - Search by name

### Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

---


### Current Features

- [x] Job listing with pagination
- [x] Job filtering by technology, level, modality, location
- [x] Full-text search
- [x] Technology management (100+ technologies)
- [x] Technologies grouped by category
- [x] Job content management (description, responsibilities, requirements, about)
- [x] Technology validation on job creation/update
- [x] CORS middleware
- [x] Zod schema validation
- [x] TypeScript backend
- [x] SQLite database with proper indexes

### Planned Features

- [ ] User authentication (JWT)
- [ ] Role-based access control (seeker, employer, admin)
- [ ] Job application system
- [ ] User profile management
- [ ] Admin dashboard for technology management
- [ ] PostgreSQL migration path

---
