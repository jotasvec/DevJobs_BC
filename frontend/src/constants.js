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
}

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
// Routes
// ===========================
export const ROUTES = {
  HOME: '/',
  JOBS: '/jobs',
  SIGNIN: '/signin',
  SIGNUP_SEEKER: '/signup',
  SIGNUP_RECRUITER: '/r_signup',
  PROFILE: '/profile',
  MY_APPLICATIONS: '/my-applications',
  MY_JOBS: '/my-jobs',
  CREATE_JOB: '/create-job',
}

// ===========================
// API paths
// ===========================
export const API = {
  JOBS: '/jobs',
  USERS: '/users',
  TECHNOLOGIES: '/technologies',
  APPLICATIONS: '/applications',
  AUTH: '/api/auth',
  COMPANIES: '/companies',
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
    },
    {
      name: "linkedin",
      label: "LinkedIn",
    },
    {
      name: "github",
      label: "Github",
    },
    {
        name: "portfolio",
        label: "Portfolio",
    },
    
    
];