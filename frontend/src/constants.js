import { Users, Clock, Eye, Star, CheckCircle, XCircle, Archive } from 'lucide-react'

// ===========================
// Roles
// ===========================
export const ROLES = {
  SEEKER: 'seeker',
  RECRUITER: 'recruiter',
  ADMIN: 'admin',
}

// ===========================
// Application statuses
// ===========================
export const APPLICATION_STATUS = {
  PENDING: 'pending',
  REVIEWED: 'reviewed',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  SHORTLISTED:  'shortlisted', 
  WITHDRAWN:  'withdrawn'
}

// ===========================
// Application status colors (for StatusBadge)
// ===========================
export const APPLICATION_STATUS_COLORS = {
  pending:    { bg: 'bg-amber-500',  text: 'text-amber-800'  },
  reviewed:   { bg: 'bg-blue-500',   text: 'text-blue-800'   },
  shortlisted:{ bg: 'bg-purple-500', text: 'text-purple-800' },
  accepted:   { bg: 'bg-green-500',  text: 'text-green-800'  },
  rejected:   { bg: 'bg-red-500',    text: 'text-red-800'    },
  withdrawn:  { bg: 'bg-gray-500',   text: 'text-gray-800'   },
}

// ===========================
// Application stat cards (for dashboards)
// ===========================
export const APPLICATION_STAT_CARDS = [
    { key: 'total', label: 'Total', icon: Users, color: 'text-text', bg: 'bg-surface' },
    { key: 'pending', label: 'Pending', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { key: 'reviewed', label: 'Reviewed', icon: Eye, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { key: 'shortlisted', label: 'Shortlisted', icon: Star, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { key: 'accepted', label: 'Accepted', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
    { key: 'rejected', label: 'Rejected', icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
    { key: 'withdrawn', label: 'Withdrawn', icon: Archive, color: 'text-gray-500', bg: 'bg-gray-500/10' },
]

// ===========================
// Job modality
// ===========================
export const MODALITY = {
  REMOTE: 'remote',
  ONSITE: 'onsite',
  HYBRID: 'hybrid',
}

export const MODALITY_OPTIONS = [
  { value: MODALITY.REMOTE, label: 'Remote' },
  { value: MODALITY.ONSITE, label: 'Onsite' },
  { value: MODALITY.HYBRID, label: 'Hybrid' },
]

// ===========================
// Job levels
// ===========================
export const LEVEL = {
  JUNIOR: 'junior',
  MID: 'mid',
  SENIOR: 'senior',
}

export const LEVEL_OPTIONS = [
  { value: LEVEL.JUNIOR, label: 'Junior' },
  { value: LEVEL.MID, label: 'Mid' },
  { value: LEVEL.SENIOR, label: 'Senior' },
]

// ===========================
// Modality badge colors
// ===========================
export const MODALITY_COLORS = {
  remote: 'bg-emerald-500/15 text-emerald-400',
  onsite: 'bg-purple-500/15 text-purple-400',
  hybrid: 'bg-sky-500/15 text-sky-400',
}

// ===========================
// Level badge colors
// ===========================
export const LEVEL_COLORS = {
  junior: 'bg-amber-500/15 text-amber-400',
  mid: 'bg-lime-500/15 text-lime-400',
  senior: 'bg-rose-500/15 text-rose-400',
}

// ===========================
// Routes
// ===========================
export const ROUTES = {
  HOME: '/',
  JOBS: '/jobs',
  COMPANIES: '/companies',
  SIGNIN: '/signin',
  SIGNUP_SEEKER: '/signup',
  SIGNUP_RECRUITER: '/r_signup',
  PROFILE: '/profile',
  MY_APPLICATIONS: '/my-applications',
  MY_JOBS: '/my-jobs',
  CREATE_JOB: '/create-job',
  SAVED_JOBS: '/saved-jobs',
  COMPANY_PROFILE: '/company-profile',
  DASHBOARD: '/dashboard',
}

// ===========================
// API paths
// ===========================
export const API = {
  JOBS: '/api/jobs',
  USERS: '/api/users',
  TECHNOLOGIES: '/api/technologies',
  APPLICATIONS: '/api/applications',
  AUTH: '/api/auth',
  COMPANIES: '/api/companies',
}

// ===========================
// Pagination
// ===========================
export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  FRONTEND_LIMIT: 4,
}

// ===========================
// UI text
// ===========================
export const UI = {
  APP_NAME: 'DevJobs',
  LOADING: 'Loading...',
  LOADING_JOBS: 'Loading jobs...',
  LOADING_JOB_DETAILS: 'Loading job details...',
  LOADING_PROFILE: 'Loading user details...',
  GO_HOME: 'Go Home',
  APPLY_NOW: 'Apply Now',
  LOGIN_TO_APPLY: 'Login to Apply',
  APPLIED: 'Applied',
  CREATE_ACCOUNT: 'Create Account',
  CREATING_ACCOUNT: 'Creating Account...',
  SIGN_IN: 'Sign In',
  SIGNING_IN: 'Signing in...',
  SIGN_UP: 'Sign Up',
  LOGOUT: 'Logout',
  WELCOME_BACK: 'Welcome Back',
  FIND_YOUR_NEXT_ROLE: 'Find your next developer role',
  ALREADY_HAVE_ACCOUNT: 'Already have an account?',
  DONT_HAVE_ACCOUNT: "Don't have an account?",
  REMEMBER_ME: 'Remember me',
  FORGOT_PASSWORD: 'Forgot password?',
  TERMS_AND_CONDITIONS: 'I agree to the Terms & Conditions',
  PAGE_NOT_FOUND: 'Page not found',
  PAGE_NOT_FOUND_DESC: "The page you're looking for doesn't exist or has been removed.",
  BACK_HOME: 'Back Home',
  CLEAR: 'Clear',
  JOBS: 'Jobs',
  START: 'Start',
  COMPANIES: 'Companies',
  SALARIES: 'Salaries',
  POST_A_JOB: 'Post a Job',
  MY_APPLICATIONS: 'My Applications',
  MY_JOBS: 'My Jobs',
  CREATE_JOB: 'Post a Job',
  EDIT_PROFILE: 'Edit Profile',
  SAVE_CHANGES: 'Save Changes',
  CANCEL: 'Cancel',
  DELETE: 'Delete',
  CONFIRM: 'Confirm',
  BACK: 'Back',
  NEXT: 'Next',
  PREV: 'Prev',
  NO_RESULTS: 'No results found',
  FOOTER_TEXT: '2026 DevJobs, all rights reserved.',
}

// ===========================
// Error messages
// ===========================
export const ERRORS = {
  GENERIC: 'An error occurred',
  NETWORK: 'Network error. Please try again.',
  UNAUTHORIZED: 'You need to log in to access this page.',
  FORBIDDEN: "You don't have permission to perform this action.",
  NOT_FOUND: 'The resource was not found.',
  VALIDATION: 'Please check your input and try again.',
  SIGN_IN_FAILED: 'Sign in failed. Please check your credentials.',
  SIGN_UP_FAILED: 'Sign up failed. Please try again.',
  APPLY_FAILED: 'Failed to submit application. Please try again.',
}


export const profileFields = [
    {
      name: "resumeUrl",
      label: "Resume",
      type: "url"
    },
    {
      name: "linkedin",
      label: "LinkedIn",
      type: "url"
    },
    {
      name: "github",
      label: "Github",
      type: "url"
    },
    {
      name: "portfolio",
      label: "Portfolio",
      type: "url"
    },
    {
        name: "coverLetter",
        label: "Cover Letter",
        type: "text"
    },
];

export const APPLICATION_TABLE_HEADER = [
  "Company",
  "Job Title",
  "status",
  "Location",
  "Last Update",
  "Applied On"
]; 