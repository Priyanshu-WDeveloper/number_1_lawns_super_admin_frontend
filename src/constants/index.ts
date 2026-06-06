// App Routes
export const ROUTES = {
  // Public routes
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',

  // Super Admin routes
  SUPER_ADMIN_DASHBOARD: '/super-admin/dashboard',
  SUPER_ADMIN_PROFILE: '/super-admin/profile',
  SUPER_ADMIN_CHANGE_PASSWORD: '/super-admin/change-password',
  SUPER_ADMIN_ADMINS: '/super-admin/admins',
  ADMIN_CREATE: '/super-admin/admin/create',
  ADMIN_VIEW: '/super-admin/admin/:id',
  ADMIN_EDIT: '/super-admin/admin/:id/edit',
  SUPER_ADMIN_BILLING: '/super-admin/billing',
  SUPER_ADMIN_NOTIFICATIONS: '/super-admin/notifications',

  // Admin routes (for layout references)
  NOTIFICATIONS: '/notifications',

  // Default redirects
  SUPER_ADMIN_DEFAULT_REDIRECT: '/super-admin/dashboard',
} as const;

export const ROLES = {
  SUPER_ADMIN: 1,
  ADMIN: 2,
} as const;

export const API_ROUTES = {
  AUTH: {
    LOGIN: '/admins/login',
    SUPER_LOGIN: '/superadmins/login',
    LOGOUT: '/auth/logout',
  },
  CUSTOMERS: {
    LIST: '/admins/customers',
    CREATE: '/admins/customers',
    DETAILS: (id: string) => `/admins/customers/${id}`,
    UPDATE: (id: string) => `/admins/customers/${id}`,
    DELETE: (id: string) => `/admins/customers/${id}`,
    STATUS: (id: string) => `/admins/customers/${id}/status`,
  },
  EMPLOYEES: {
    LIST: '/admins/employees',
    DETAILS: (id: string) => `/admins/employees/${id}`,
    CREATE: '/admins/employees',
    UPDATE: (id: string) => `/admins/employees/${id}`,
    DELETE: (id: string) => `/admins/employees/${id}`,
    STATUS: (id: string) => `/admins/employees/${id}/status`,
    SET_VALIDITY: (id: string) => `/admins/employees/${id}/validity`,
    REMOVE_VALIDITY: (id: string) => `/admins/employees/${id}/validity`,
    UPLOAD: '/admins/upload',
  },
  JOBS: {
    LIST: '/jobs',
    DETAILS: (id: string) => `/jobs/${id}`,
    CREATE: '/jobs',
    UPDATE: (id: string) => `/jobs/${id}`,
    DELETE: (id: string) => `/jobs/${id}`,
    CANCEL: '/jobs/cancel',
    COMPLETE: '/jobs/complete',
    ASSIGN_EMPLOYEE: '/jobs/assign-employee',
    RECEIPT: (id: string) => `/jobs/${id}/receipt`,
  },
  PARENT_JOBS: {
    LIST: '/jobs/parents',
    CANCEL: (id: string) => `/jobs/parents/${id}/cancel`,
  },
  CHILD_JOBS: {
    LIST: '/jobs',
  },
  INVOICES: {
    LIST: '/invoices',
    VIEW_BY_JOB: (jobId: string) => `/invoices/${jobId}/view`,
    DOWNLOAD: (jobId: string) => `/invoices/${jobId}/download`,
  },
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
    DELETE: (id: string) => `/notifications/${id}`,
    DELETE_ALL: '/notifications',
  },
  ADMINS: {
    LIST: '/admins',
    DETAILS: (id: string) => `/admins/${id}`,
    SELF: '/admins/details',
    CHANGE_PASSWORD: '/admins/change-password',
  },
  SUPER_ADMINS: {
    ADMINS: {
      LIST: '/superadmins/admins',
      DETAILS: (id: string) => `/superadmins/edit-admin/${id}`,
      CREATE: '/superadmins/add-admin',
      UPDATE: (id: string) => `/superadmins/edit-admin/${id}`,
      DELETE: (id: string) => `/super-admin/admins/${id}`,
      SET_VALIDITY: (id: string) => `/superadmins/validity/${id}`,
      REMOVE_VALIDITY: (id: string) => `/superadmins/validity/${id}`,
      RESET_PASSWORD: (id: string) => `/superadmins/admins/${id}/password`,
    },
    CHANGE_PASSWORD: '/superadmins/change-password',
    BILLING: {
      STATS: '/super-admin/billing/stats',
      INVOICES: '/super-admin/billing/invoices',
    },
  },
} as const;
// UI Constants
export const UI = {
  SIDEBAR_WIDTH: '19rem',
  BORDER_RADIUS: '20px',
  CARD_RADIUS: '20px',

  // Colors
  COLORS: {
    PRIMARY: '#16610E',
    PRIMARY_LIGHT: '#edf8e7',
    TEXT: '#151515',
    TEXT_SECONDARY: '#777',
    BORDER: '#ececec',
    BACKGROUND: '#F4F7EF',
    BACKGROUND_INNER: '#f8f8f5',
  },

  // Spacing
  PADDING: {
    MAIN: 'px-4 pt-5 pb-5',
    CARD: 'p-6',
  },

  // Breakpoints
  BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
  },
} as const;
