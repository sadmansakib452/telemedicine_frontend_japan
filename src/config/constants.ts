/**
 * Application Constants
 * 
 * Centralized constants for status values, message types, user types, and other app-wide constants.
 */

/**
 * User Types
 */
export const USER_TYPES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  SHOP_OWNER: 'shop_keeper',
  ADMIN: 'admin',
} as const;

export type UserType = typeof USER_TYPES[keyof typeof USER_TYPES];

/**
 * Broadcast Status Values
 */
export const BROADCAST_STATUS = {
  OPEN: 'open',
  ASSISTED: 'assisted',
  CLOSED: 'closed',
} as const;

export type BroadcastStatus = typeof BROADCAST_STATUS[keyof typeof BROADCAST_STATUS];

/**
 * Broadcast Status Configuration
 * Used for UI display (labels, colors, actions)
 */
export const BROADCAST_STATUS_CONFIG = {
  [BROADCAST_STATUS.OPEN]: {
    label: 'Open',
    color: 'green',
    canRespond: true,
  },
  [BROADCAST_STATUS.ASSISTED]: {
    label: 'Assisted',
    color: 'gray',
    canRespond: false,
  },
  [BROADCAST_STATUS.CLOSED]: {
    label: 'Closed',
    color: 'gray',
    canRespond: false,
  },
} as const;

/**
 * Conversation Types
 */
export const CONVERSATION_TYPES = {
  PATIENT_DOCTOR: 'patient_doctor',
  DOCTOR_SHOP_OWNER: 'doctor_shop_owner',
} as const;

export type ConversationType = typeof CONVERSATION_TYPES[keyof typeof CONVERSATION_TYPES];

/**
 * Conversation Status Values
 */
export const CONVERSATION_STATUS = {
  OPEN: 'open',
  CLOSED: 'closed',
} as const;

export type ConversationStatus = typeof CONVERSATION_STATUS[keyof typeof CONVERSATION_STATUS];

/**
 * Message Types
 */
export const MESSAGE_TYPES = {
  TEXT: 'text',
  PRESCRIPTION: 'prescription',
} as const;

export type MessageType = typeof MESSAGE_TYPES[keyof typeof MESSAGE_TYPES];

/**
 * Message Status Values
 */
export const MESSAGE_STATUS = {
  PENDING: 'PENDING',
  SENT: 'SENT',
  DELIVERED: 'DELIVERED',
  READ: 'READ',
} as const;

export type MessageStatus = typeof MESSAGE_STATUS[keyof typeof MESSAGE_STATUS];

/**
 * User Status Values (Online/Offline)
 */
export const USER_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
} as const;

export type UserStatus = typeof USER_STATUS[keyof typeof USER_STATUS];

/**
 * Prescription Validation Rules
 * Frontend validation limits (backend has no limits)
 */
export const PRESCRIPTION_VALIDATION = {
  MEDICINE_DETAILS: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 5000,
    MESSAGE: 'Medicine details must be between 5 and 5000 characters',
  },
  PATIENT_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
    MESSAGE: 'Patient name must be between 2 and 100 characters',
  },
} as const;

/**
 * Pagination Defaults
 */
export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  CURSOR_KEY: 'cursor',
  LIMIT_KEY: 'limit',
} as const;

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * WebSocket Event Names
 */
export const WS_EVENTS = {
  // Connection events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',
  
  // Room management
  JOIN_ROOM: 'joinRoom',
  LEAVE_ROOM: 'leaveRoom',
  JOINED_ROOM: 'joinedRoom',
  LEFT_ROOM: 'leftRoom',
  
  // Broadcast events (doctors only)
  NEW_BROADCAST: 'new_broadcast',
  BROADCAST_ASSISTED: 'broadcast_assisted',
  
  // Conversation events (all users)
  CONVERSATION: 'conversation',
  
  // Message events (all users)
  MESSAGE: 'message',
  MESSAGE_STATUS_UPDATED: 'messageStatusUpdated',
  
  // Prescription events (shop owners only)
  NEW_PRESCRIPTION: 'new_prescription',
  
  // User status events (all users)
  USER_STATUS_CHANGE: 'userStatusChange',
} as const;

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Validation failed. Please check your input.',
  BROADCAST_ALREADY_ASSISTED: 'This broadcast has already been assisted by another doctor.',
  CONVERSATION_ALREADY_EXISTS: 'Conversation already exists for this broadcast.',
  TOKEN_EXPIRED: 'Your session has expired. Please log in again.',
  TOKEN_INVALID: 'Invalid token. Please log in again.',
} as const;

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful.',
  REGISTER_SUCCESS: 'Registration successful.',
  LOGOUT_SUCCESS: 'Logout successful.',
  BROADCAST_CREATED: 'Broadcast created successfully.',
  MESSAGE_SENT: 'Message sent successfully.',
  PRESCRIPTION_SENT: 'Prescription sent successfully.',
  CONVERSATION_CREATED: 'Conversation created successfully.',
} as const;

