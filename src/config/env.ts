/**
 * Environment Configuration
 * 
 * Centralized configuration for API URLs, WebSocket URLs, and environment-specific settings.
 * All environment variables should be accessed through this file.
 */

/**
 * API Base URL
 * Default: http://localhost:4000/api (development)
 * Production: Set via NEXT_PUBLIC_API_URL environment variable
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

/**
 * WebSocket URL
 * Default: http://localhost:4000 (development)
 * Production: Set via NEXT_PUBLIC_WS_URL environment variable
 * Note: WebSocket uses the same host as API, Socket.IO path is handled by the library
 */
export const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000';

/**
 * Environment
 * Development, Production, or Test
 */
export const ENV = process.env.NODE_ENV || 'development';

/**
 * Is Development Environment
 */
export const IS_DEV = ENV === 'development';

/**
 * Is Production Environment
 */
export const IS_PROD = ENV === 'production';

/**
 * API Timeout (in milliseconds)
 * Default: 30 seconds
 */
export const API_TIMEOUT = 30000;

/**
 * WebSocket Reconnection Attempts
 * Default: 5 attempts
 */
export const WS_RECONNECT_ATTEMPTS = 5;

/**
 * WebSocket Reconnection Delay (in milliseconds)
 * Default: 1000ms (1 second)
 * Uses exponential backoff
 */
export const WS_RECONNECT_DELAY = 1000;

/**
 * Token Refresh Buffer (in milliseconds)
 * Refresh token 5 minutes before expiry
 * Default: 5 * 60 * 1000 (5 minutes)
 */
export const TOKEN_REFRESH_BUFFER = 5 * 60 * 1000;

/**
 * Access Token Storage Key
 * Store in memory or localStorage
 */
export const ACCESS_TOKEN_KEY = 'access_token';

/**
 * Refresh Token Storage Key
 * Stored in httpOnly cookie by backend
 */
export const REFRESH_TOKEN_KEY = 'refresh_token';

