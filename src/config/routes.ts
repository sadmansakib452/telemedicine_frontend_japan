/**
 * Route Constants
 * 
 * Centralized route definitions for the application.
 * All routes should be accessed through this file to ensure consistency.
 */

/**
 * Public Routes
 */
export const PUBLIC_ROUTES = {
  HOME: '/',
  LOGIN: '/signin',
  REGISTER: '/signup',
  RESET_PASSWORD: '/reset-password',
} as const;

/**
 * Protected Routes (Main App)
 */
export const PROTECTED_ROUTES = {
  // Conversations (all user types)
  CONVERSATIONS: '/conversations',
  CONVERSATION_DETAIL: (id: string) => `/conversations/${id}`,
  
  // Broadcasts (doctors only)
  BROADCASTS_INBOX: '/broadcasts-inbox',
  BROADCAST_DETAIL: (id: string) => `/broadcasts-inbox/${id}`,
  
  // Admin routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/dashboard/users',
  ADMIN_CONVERSATIONS: '/admin/dashboard/conversations',
  ADMIN_PRESCRIPTIONS: '/admin/dashboard/prescriptions',
  ADMIN_BROADCASTS: '/admin/dashboard/broadcasts',
} as const;

/**
 * API Routes
 */
export const API_ROUTES = {
  // Auth routes
  AUTH: {
    REGISTER: '/auth/register',
    VERIFY_EMAIL: '/auth/verify-email',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    ME: '/auth/me',
    UPDATE: '/auth/update',
  },
  
  // Conversation routes
  CONVERSATION: {
    BASE: '/chat/conversation',
    LIST: '/chat/conversation',
    DETAIL: (id: string) => `/chat/conversation/${id}`,
    CREATE: '/chat/conversation',
    RESPOND_TO_BROADCAST: (broadcastId: string) => `/chat/conversation/broadcast/${broadcastId}/respond`,
  },
  
  // Message routes
  MESSAGE: {
    BASE: '/chat/message',
    LIST: '/chat/message',
    SEND: '/chat/message',
    UPDATE_STATUS: (id: string) => `/chat/message/${id}/status`,
  },
  
  // Broadcast routes
  BROADCAST: {
    BASE: '/chat/broadcast',
    CREATE: '/chat/broadcast',
    INBOX: '/chat/broadcast/inbox', // Doctors only - returns only "open" broadcasts
    PATIENT: '/chat/broadcast/patient', // Patient's own broadcasts
    DETAIL: (id: string) => `/chat/broadcast/${id}`,
    DELETE: (id: string) => `/chat/broadcast/${id}`,
  },
  
  // Prescription routes
  PRESCRIPTION: {
    BASE: '/chat/prescription',
    LIST: '/chat/prescription',
    DETAIL: (id: string) => `/chat/prescription/${id}`,
  },
  
  // Shop Owner routes
  SHOP_OWNER: {
    CONVERSATIONS: '/chat/shop-owner/conversations',
    PRESCRIPTIONS: '/chat/shop-owner/prescriptions',
    PRESCRIPTION_DETAIL: (id: string) => `/chat/shop-owner/prescriptions/${id}`,
  },
  
  // Admin routes
  ADMIN: {
    USERS: '/admin/user',
    USER_DETAIL: (id: string) => `/admin/user/${id}`,
    USER_DELETE: (id: string) => `/admin/user/${id}`,
    STATISTICS: '/admin/user/statistics',
    VERIFICATIONS: '/admin/verification',
    VERIFICATION_APPROVE: (id: string) => `/admin/verification/${id}/approve`,
    VERIFICATION_REJECT: (id: string) => `/admin/verification/${id}/reject`,
  },
} as const;

/**
 * Route Helpers
 */
export const RouteHelpers = {
  /**
   * Check if route is public
   */
  isPublicRoute: (path: string): boolean => {
    return Object.values(PUBLIC_ROUTES).includes(path as any);
  },
  
  /**
   * Check if route is protected
   */
  isProtectedRoute: (path: string): boolean => {
    return path.startsWith('/conversations') || 
           path.startsWith('/broadcasts-inbox') || 
           path.startsWith('/admin');
  },
  
  /**
   * Check if route requires admin role
   */
  isAdminRoute: (path: string): boolean => {
    return path.startsWith('/admin');
  },
  
  /**
   * Check if route requires doctor role
   */
  isDoctorRoute: (path: string): boolean => {
    return path.startsWith('/broadcasts-inbox');
  },
  
  /**
   * Get redirect route based on user type
   */
  getRedirectRoute: (userType: string): string => {
    switch (userType) {
      case 'admin':
        return PROTECTED_ROUTES.ADMIN_DASHBOARD;
      case 'doctor':
        return PROTECTED_ROUTES.BROADCASTS_INBOX;
      case 'shop_keeper':
      case 'shop_owner': // Handle both backend values
        return PROTECTED_ROUTES.CONVERSATIONS;
      case 'patient':
        return PROTECTED_ROUTES.CONVERSATIONS;
      default:
        return PUBLIC_ROUTES.HOME;
    }
  },
};

