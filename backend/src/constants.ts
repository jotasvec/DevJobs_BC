// ===========================
// Roles
// ===========================
export const ROLES = {
  SEEKER: 'seeker',
  RECRUITER: 'recruiter',
  ADMIN: 'admin',
} as const

export type Role = typeof ROLES[keyof typeof ROLES]

// ===========================
// Application statuses
// ===========================
export const APPLICATION_STATUS = {
  PENDING: 'pending',
  REVIEWED: 'reviewed',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
} as const

export type ApplicationStatus = typeof APPLICATION_STATUS[keyof typeof APPLICATION_STATUS]

// ===========================
// Job modality
// ===========================
export const MODALITY = {
  REMOTE: 'remote',
  ONSITE: 'onsite',
  HYBRID: 'hybrid',
} as const

export type Modality = typeof MODALITY[keyof typeof MODALITY]

// ===========================
// Job levels
// ===========================
export const LEVEL = {
  JUNIOR: 'junior',
  MID: 'mid',
  SENIOR: 'senior',
} as const

export type Level = typeof LEVEL[keyof typeof LEVEL]

// ===========================
// HTTP status codes
// ===========================
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const

// ===========================
// API response keys
// ===========================
export const RESPONSE = {
  SUCCESS: 'success',
  ERROR: 'error',
  DATA: 'data',
  MESSAGE: 'message',
} as const

// ===========================
// Database table names
// ===========================
export const TABLES = {
  JOBS: 'jobs',
  JOB_CONTENTS: 'job_contents',
  JOB_TECHNOLOGIES: 'job_technologies',
  TECHNOLOGIES: 'technologies',
  TECHNOLOGY_CATEGORIES: 'technology_categories',
  USERS: 'user',
  SESSIONS: 'session',
  ACCOUNTS: 'account',
  APPLICATIONS: 'applications',
  SEEKER_PROFILES: 'seeker_profile',
  RECRUITER_PROFILES: 'recruiter_profile',
  COMPANIES: 'company',
} as const

// ===========================
// Error codes
// ===========================
export const ERROR_CODES = {
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NO_FIELDS_PROVIDED: 'NO_FIELDS_PROVIDED',
  FAILED_TO_CREATE: 'FAILED_TO_CREATE',
  DUPLICATED_TECHNOLOGY: 'DUPLICATED_TECHNOLOGY',
  INVALID_CATEGORY: 'INVALID_CATEGORY',
  MISSING_REQUIRED_FIELDS: 'MISSING_REQUIRED_FIELDS',
} as const

// ===========================
// Success messages
// ===========================
export const MESSAGES = {
  JOB_CREATED: 'Job created successfully',
  JOB_UPDATED: 'Job updated successfully',
  JOB_DELETED: 'Job deleted successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  TECHNOLOGY_CREATED: 'New technology successfully added',
  TECHNOLOGY_DELETED: 'Technology deleted successfully',
  APPLICATION_CREATED: 'Application submitted successfully',
  APPLICATION_UPDATED: 'Application updated successfully',
  APPLICATION_DELETED: 'Application withdrawn successfully',
  AUTHENTICATION_REQUIRED: 'Authentication required',
  INVALID_SESSION: 'Invalid session',
  NO_VALID_FIELDS: 'No valid fields provided to update',
  MISSING_REQUIRED_FIELDS: 'Missing required fields for full update',
  PROFILE_UPDATED: 'Profile updated successfully',
  COMPANY_CREATED: 'Company created successfully',
  COMPANY_UPDATED: 'Company updated successfully',
  COMPANY_DELETED: 'Company deleted successfully',
} as const

// ===========================
// Pagination defaults
// ===========================
export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  DEFAULT_OFFSET: 0,
} as const
