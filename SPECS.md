# SPECS.md - Component & API Specifications

### Project: DevJobs
### Last Updated: 2026-07-18

---

## 1. API Endpoints

### 1.1 Auth (`/api/auth/*`)

Handled by better-auth. Key endpoints:

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/api/auth/sign-up/email` | `{ name, email, password, role }` | `{ user, session }` |
| POST | `/api/auth/sign-in/email` | `{ email, password }` | `{ user, session }` |
| POST | `/api/auth/sign-out` | — | `{ success }` |
| GET | `/api/auth/get-session` | — | `{ user, session }` |

### 1.2 Jobs (`/jobs`)

| Method | Endpoint | Auth | Roles | Body | Response |
|--------|----------|------|-------|------|----------|
| GET | `/jobs` | ❌ | — | — | `{ success, data: Job[], pagination }` |
| GET | `/jobs?text=` | ❌ | — | — | Filtered by search text |
| GET | `/jobs?technology=` | ❌ | — | — | Filtered by technology name |
| GET | `/jobs?location=` | ❌ | — | — | Filtered by location |
| GET | `/jobs?level=` | ❌ | — | — | Filtered by level |
| GET | `/jobs/:id` | ❌ | — | — | `{ success, data: Job }` |
| POST | `/jobs` | ✅ | recruiter, admin | `JobInput` | `{ success, data: Job }` |
| PATCH | `/jobs/:id` | ✅ | recruiter, admin | `PartialJobInput` | `{ success, data: UpdateResult }` |
| PUT | `/jobs/:id` | ✅ | recruiter, admin | `JobInput` | `{ success, data: UpdateResult }` |
| DELETE | `/jobs/:id` | ✅ | admin | — | `{ success, data: UpdateResult }` |

**JobInput schema:**
```ts
{
  title: string        // min 5, max 50
  company: string
  location: string
  description: string
  data?: {
    technology?: string[]
    level?: string
    modality?: string
  }
  content?: {
    description?: string
    responsibilities?: string
    requirements?: string
    about?: string
  }
}
```

**Job response shape:**
```ts
{
  id: string
  title: string
  company: string
  location: string
  description: string
  modality: string
  level: string
  created_at: string
  created_by: string
  technologies: string[]    // technology names
  content: {
    description: string
    responsibilities: string
    requirements: string
    about: string
  }
}
```

### 1.3 Technologies (`/technologies`)

| Method | Endpoint | Auth | Roles | Body | Response |
|--------|----------|------|-------|------|----------|
| GET | `/technologies` | ❌ | — | — | `{ success, data: Technology[] }` |
| GET | `/technologies?search=` | ❌ | — | — | Filtered by name |
| GET | `/technologies?category=` | ❌ | — | — | Filtered by category |
| GET | `/technologies/grouped` | ❌ | — | — | `{ success, data: { [category]: Technology[] } }` |
| GET | `/technologies/categories` | ❌ | — | — | `{ success, data: string[] }` |
| GET | `/technologies/:id` | ❌ | — | — | `{ success, data: Technology }` |
| POST | `/technologies` | ✅ | admin | `TechnologyInput` | `{ success, data: Technology }` |
| PATCH | `/technologies/:id` | ✅ | admin | `PartialTechnologyUpdate` | `{ success, data: Technology }` |
| DELETE | `/technologies/:id` | ✅ | admin | — | `{ success, data: { deleted: boolean } }` |

**Technology response shape:**
```ts
{
  id: string
  name: string
  category: string
  created_at: string
}
```

### 1.4 Users (`/users`)

| Method | Endpoint | Auth | Roles | Body | Response |
|--------|----------|------|-------|------|----------|
| GET | `/users` | ✅ | admin, recruiter | — | `{ success, data: User[] }` |
| GET | `/users/:id` | ✅ | admin, recruiter | — | `{ success, data: User }` |
| PUT | `/users/:id` | ✅ | admin | `UserUpdate` | `{ success, data: User }` |
| PATCH | `/users/:id` | ✅ | admin | `Partial<UserUpdate>` | `{ success, data: User }` |
| DELETE | `/users/:id` | ✅ | admin | — | `{ success, data: { deleted: boolean } }` |

**User response shapes:**

Admin view:
```ts
{
  id: string
  email: string
  name: string
  role: "seeker" | "recruiter" | "admin"
  bio: string | null
  resume: string | null
  skills: string | null
  image: string | null
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}
```

Recruiter view (limited):
```ts
{
  id: string
  email: string
  name: string
  role: string
  image: string | null
}
```

### 1.5 Applications (`/applications`) — NOT YET IMPLEMENTED

| Method | Endpoint | Auth | Roles | Body | Response |
|--------|----------|------|-------|------|----------|
| POST | `/applications` | ✅ | seeker | `{ jobId, coverLetter? }` | `{ success, data: Application }` |
| GET | `/applications?jobId=` | ✅ | recruiter, admin | — | `{ success, data: Application[] }` |
| GET | `/applications?userId=` | ✅ | seeker | — | `{ success, data: Application[] }` |
| PATCH | `/applications/:id` | ✅ | recruiter, admin | `{ status }` | `{ success, data: Application }` |
| DELETE | `/applications/:id` | ✅ | seeker, admin | — | `{ success, data: { deleted: boolean } }` |

**Application response shape:**
```ts
{
  id: string
  user_id: string
  job_id: string
  status: "pending" | "reviewed" | "accepted" | "rejected"
  cover_letter: string | null
  created_at: string
}
```

---

## 2. Frontend Components

### 2.1 AuthForm (`components/AuthForm.jsx`)

Reusable form for sign-in and sign-up.

**Props:**
```js
{
  isSignUp: boolean          // Toggle sign-up mode (shows name + confirmPassword + T&C)
  onSubmit: function         // Form submit handler
  title: string              // Form heading
  subtitle: string           // Form subheading
  submitText: string         // Button text (e.g., "Sign In" or "Create Account")
  altText: string            // Footer text (e.g., "Don't have an account?")
  altButtonText: string      // Footer button text
  altButtonAction: function  // Footer button handler (receives 'seeker' or 'recruiter')
  register: function         // react-hook-form register function (optional)
  errors: object             // react-hook-form errors object (optional)
  error: string|Error        // Server error to display
}
```

**Behavior:**
- Sign-in mode: email + password + "Remember me" + "Forgot password?"
- Sign-up mode: name + email + password + confirmPassword + T&C checkbox
- Footer in sign-in mode: two buttons "Sign up as Seeker" / "Sign up as Recruiter"
- Footer in sign-up mode: "Sign In" link

### 2.2 InputField (`components/InputField.jsx`)

Reusable form input with label and error display.

**Props:**
```js
{
  name: string               // Input name and id
  label: string              // Label text
  placeholder: string        // Placeholder text
  type: string               // Input type (default: 'text')
  register: function         // react-hook-form register (optional)
  validation: object         // Validation rules for register (optional)
  disabled: boolean          // Disabled state (default: false)
  value: string              // Controlled value (optional)
  error: object              // Error object with .message property
}
```

### 2.3 Header (`components/Header.jsx`)

Navigation header with auth-aware content.

**Behavior:**
- Always shows: logo (DevJobs), nav links (Start, Jobs, Companies, Salaries)
- Logged out: shows "SignIn" link + "Post a Job" link
- Logged in: shows avatar + user name/email (links to profile) + "Logout" button
- Logout: calls `signOut()` then redirects to `/`

### 2.4 ProtectedRoute (`router/ProtectedRoute.jsx`)

Route guard for authenticated pages.

**Behavior:**
- Checks `isLoggedIn` from `useAuth()`
- If not logged in: redirects to `/signin` with `state={{ from: location.pathname }}`
- If logged in: renders child routes via `<Outlet />`

### 2.5 ApplyButton (`pages/Detail/JobsDetails.jsx`)

Apply button on job detail page.

**Props:**
```js
{
  className: string          // Additional CSS classes
}
```

**Behavior:**
- Logged out: shows "Login to Apply", navigates to `/signin`
- Logged in: shows "Apply Now", calls apply handler (currently placeholder)

### 2.6 SearchField (`components/SearchField.jsx`)

Search input with icon and submit.

**Props:**
```js
{
  onSearch: function         // Callback with search term
  placeholder: string        // Placeholder text
}
```

---

## 3. Frontend Hooks

### 3.1 useAuth (`hooks/useAuth.jsx`)

Consumes `AuthContext`. Must be used within `AuthProvider`.

**Returns:**
```js
{
  user: object|null          // Current user { id, email, name, role, image }
  isLoggedIn: boolean        // Whether user is authenticated
  isPending: boolean         // Session loading state
  session: object|null       // Full session object
  error: string|null         // Auth error
  logout: async function     // Sign out and clear session
  refetch: function          // Refetch session
}
```

### 3.2 useRouter (`hooks/useRouter.jsx`)

Wraps react-router's `useNavigate` and `useLocation`.

**Returns:**
```js
{
  currentPath: string        // Current pathname
  navigateTo: function       // Navigate to path
}
```

### 3.3 useFilters (`hooks/useFilters.jsx`)

Job filtering with URL search params and debounced search.

**Returns:**
```js
{
  jobs: array                // Filtered job list
  loading: boolean           // Fetch loading state
  filters: object            // Current filter values { search, technology, location, level }
  pagination: { page, totalPages, total }
  handleFilterChange: function
  handlePageChange: function
}
```

---

## 4. Frontend Schemas

### 4.1 signUp (`schemas/signUp.js`)

```js
{
  name: string               // min 10 characters
  email: string              // valid email format
  password: string           // 8-25 chars, uppercase, lowercase, digit, special char (!@#$%&*-)
  confirmPassword: string    // must match password
}
```

**Password regex:** `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*-])[A-Za-z\d!@#$%&*-]{8,}$/`

---

## 5. Backend Models

### 5.1 JobModel (`models/job.ts`)

| Method | Parameters | Returns |
|--------|-----------|---------|
| `getAll(query)` | `JobQuery` (pagination, filters) | `{ jobs: Job[], total, page, totalPages }` |
| `getJobById(id)` | `string` | `Job` |
| `create(input)` | Flattened job fields + content + technologies | `Job` |
| `partialUpdateJob(id, input)` | `PartialJobInput` | `UpdateResult` |
| `deleteJob(id)` | `string` | `UpdateResult` |

### 5.2 TechnologyModel (`models/technology.ts`)

| Method | Parameters | Returns |
|--------|-----------|---------|
| `getAll(search?, category?)` | Optional filters | `Technology[]` |
| `getGrouped()` | — | `{ [category]: Technology[] }` |
| `getById(id)` | `string` | `Technology` |
| `getByName(name)` | `string` | `Technology` |
| `create({ name, category })` | `TechQuery` | `Technology` |
| `update(id, { name, category })` | `string`, `TechQuery` | `Technology` |
| `delete(id)` | `string` | `{ deleted: boolean }` |
| `getCategories()` | — | `string[]` |

### 5.3 UserModel (`models/user.ts`)

| Method | Parameters | Returns |
|--------|-----------|---------|
| `getAll()` | — | `User[]` |
| `getById(id)` | `string` | `User` |
| `update(id, data)` | `string`, partial user fields | `User` |
| `delete(id)` | `string` | `{ deleted: boolean }` |

### 5.4 ApplicationModel — NOT YET IMPLEMENTED

Planned methods:
| Method | Parameters | Returns |
|--------|-----------|---------|
| `create(userId, jobId, coverLetter?)` | `string`, `string`, optional `string` | `Application` |
| `getByJobId(jobId)` | `string` | `Application[]` |
| `getByUserId(userId)` | `string` | `Application[]` |
| `updateStatus(id, status)` | `string`, `string` | `Application` |
| `delete(id)` | `string` | `{ deleted: boolean }` |

---

## 6. Backend Middlewares

### 6.1 requireSession (`middlewares/auth.ts`)

Extracts session from request via `auth.api.getSession()`. Attaches `req.user` with `{ id, email, name, role }`. Returns 401 if no valid session.

### 6.2 requireRoles(...roles) (`middlewares/auth.ts`)

Must be used after `requireSession`. Checks if `req.user.role` is in the allowed roles array. Returns 403 if role not permitted.

**Usage:**
```ts
router.post('/', requireSession, requireRoles('recruiter', 'admin'), controller.create)
```

### 6.3 validateSchemas(schema) (`middlewares/validateSchemas.ts`)

Wraps a Zod schema. Parses and sanitizes `req.body`. Returns 400 with validation errors if parsing fails.

### 6.4 corsMiddleware (`middlewares/cors.ts`)

CORS with credentials. Origin callback checks against `ACCEPTED_ORIGINS` from config.

---

## 7. Auth Flow

### 7.1 Sign Up

```
1. User fills form (name, email, password, confirmPassword)
2. Client-side Zod validation (signUpSchema)
3. signUp.email({ name, email, password, role }) → better-auth
4. If error → display in AuthForm
5. signIn.email({ email, password }) → auto-login
6. Redirect to /
```

### 7.2 Sign In

```
1. User fills form (email, password)
2. signIn.email({ email, password }) → better-auth
3. If error → display in AuthForm
4. Read location.state.from (from ProtectedRoute)
5. Navigate to state.from || '/'
```

### 7.3 Protected Route

```
1. User navigates to /profile/abc123
2. ProtectedRoute checks isLoggedIn
3. If not logged in → Navigate to /signin with { from: '/profile/abc123' }
4. SignIn reads state.from after login
5. Redirects back to /profile/abc123
```

### 7.4 Logout

```
1. User clicks Logout button in Header
2. signOut() → better-auth
3. refetch() → clear session state
4. Navigate to /
```

---

## 8. Vite Proxy Configuration

```js
proxy: {
  '/api': 'http://localhost:3050',        // Auth routes
  '/users': 'http://localhost:3050',      // User routes
  '/jobs': 'http://localhost:3050',       // Job routes
  '/technologies': 'http://localhost:3050' // Technology routes
}
```

All frontend fetch calls use relative URLs (e.g., `/jobs`, `/users/:id`). The Vite proxy forwards them to the backend in development. In production, a reverse proxy (nginx, Vercel, etc.) handles this.

---

## 9. Database Tables

### 9.1 better-auth tables

**user:**
```
id (TEXT PK), email (TEXT), password (TEXT), name (TEXT),
role (TEXT DEFAULT 'seeker'), bio (TEXT), resume (TEXT),
skills (TEXT), image (TEXT), emailVerified (BOOLEAN),
createdAt (DATETIME), updatedAt (DATETIME)
```

**session:**
```
id (TEXT PK), expiresAt (DATETIME), token (TEXT),
ipAddress (TEXT), userAgent (TEXT), userId (TEXT FK),
createdAt (DATETIME), updatedAt (DATETIME)
```

**account:**
```
id (TEXT PK), accountId (TEXT), providerId (TEXT),
userId (TEXT FK), accessToken (TEXT), refreshToken (TEXT),
idToken (TEXT), createdAt (DATETIME), updatedAt (DATETIME)
```

**verification:**
```
id (TEXT PK), identifier (TEXT), value (TEXT),
expiresAt (DATETIME), createdAt (DATETIME), updatedAt (DATETIME)
```

### 9.2 Application tables

**jobs:**
```
id (TEXT PK), title (TEXT), company (TEXT), location (TEXT),
description (TEXT), modality (TEXT), level (TEXT),
created_at (DATETIME), created_by (TEXT FK → user.id)
```

**job_contents:**
```
id (TEXT PK), job_id (TEXT FK → jobs.id),
description (TEXT), responsibilities (TEXT),
requirements (TEXT), about (TEXT)
```

**technologies:**
```
id (TEXT PK), name (TEXT UNIQUE), category (TEXT),
created_at (DATETIME)
```

**technology_categories:**
```
id (TEXT PK), name (TEXT UNIQUE), description (TEXT)
```

**job_technologies:**
```
id (TEXT PK), job_id (TEXT FK → jobs.id),
technology_id (TEXT FK → technologies.id)
```

**applications:**
```
id (TEXT PK), user_id (TEXT FK → user.id),
job_id (TEXT FK → jobs.id), status (TEXT DEFAULT 'pending'),
cover_letter (TEXT), created_at (DATETIME)
```
