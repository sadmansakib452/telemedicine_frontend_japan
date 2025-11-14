/**
 * Token Utilities
 * 
 * Utilities for managing JWT tokens (access token storage and retrieval).
 * Access token is stored in memory or localStorage.
 * Refresh token is stored in httpOnly cookie by backend.
 */

import { ACCESS_TOKEN_KEY } from '@/config/env';

/**
 * Storage type for access token
 */
type TokenStorage = 'memory' | 'localStorage' | 'sessionStorage';

/**
 * In-memory token storage (fallback)
 */
let memoryToken: string | null = null;

/**
 * Get access token from storage
 * 
 * Priority: memory > localStorage > sessionStorage
 * 
 * @returns Access token or null if not found
 */
export const getAccessToken = (): string | null => {
  // Check memory first (most secure, cleared on page refresh)
  if (memoryToken) {
    return memoryToken;
  }
  
  // Check localStorage (persists across sessions)
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (stored) {
      return stored;
    }
    
    // Check sessionStorage (cleared on tab close)
    const sessionStored = sessionStorage.getItem(ACCESS_TOKEN_KEY);
    if (sessionStored) {
      return sessionStored;
    }
  }
  
  return null;
};

/**
 * Set access token in storage
 * 
 * @param token Access token to store
 * @param storage Storage type ('memory', 'localStorage', or 'sessionStorage')
 */
export const setAccessToken = (
  token: string,
  storage: TokenStorage = 'localStorage'
): void => {
  // Always store in memory for immediate access
  memoryToken = token;
  
  if (typeof window !== 'undefined') {
    // Store in cookie for middleware access (server-side can read cookies)
    // Cookie is not httpOnly so client-side can also read it
    // Use SameSite=Lax for CSRF protection, Secure in production (HTTPS only)
    const expires = new Date();
    expires.setTime(expires.getTime() + 60 * 60 * 1000); // 1 hour (matching token expiry)
    
    // Get domain (optional - for production with subdomains)
    const domain = typeof window !== 'undefined' ? window.location.hostname : '';
    
    // Build cookie string
    // Note: In production, you may want to add Secure flag (requires HTTPS)
    const isProduction = process.env.NODE_ENV === 'production';
    const secureFlag = isProduction ? '; Secure' : '';
    const cookieString = `${ACCESS_TOKEN_KEY}=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Lax${secureFlag}`;
    
    document.cookie = cookieString;
    
    switch (storage) {
      case 'localStorage':
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
        break;
      case 'sessionStorage':
        sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
        break;
      case 'memory':
        // Already stored in memory
        break;
    }
  }
};

/**
 * Remove access token from all storage
 */
export const removeAccessToken = (): void => {
  // Clear memory
  memoryToken = null;
  
  // Clear from storage
  if (typeof window !== 'undefined') {
    // Clear from cookie (set expires to past date)
    document.cookie = `${ACCESS_TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  }
};

/**
 * Check if access token exists
 * 
 * @returns True if token exists, false otherwise
 */
export const hasAccessToken = (): boolean => {
  return getAccessToken() !== null;
};

/**
 * Get token from Authorization header
 * 
 * @param authHeader Authorization header value (e.g., "Bearer <token>")
 * @returns Token or null if invalid format
 */
export const getTokenFromHeader = (authHeader: string | null): string | null => {
  if (!authHeader) {
    return null;
  }
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1];
};

/**
 * Create Authorization header
 * 
 * @param token Access token
 * @returns Authorization header value
 */
export const createAuthHeader = (token: string): string => {
  return `Bearer ${token}`;
};

/**
 * Decode JWT token (without verification)
 * 
 * @param token JWT token
 * @returns Decoded token payload or null if invalid
 */
export const decodeToken = (token: string): any | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (error) {
    return null;
  }
};

/**
 * Check if token is expired
 * 
 * @param token JWT token
 * @returns True if expired, false otherwise
 */
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return true;
  }
  
  const expiryTime = decoded.exp * 1000; // Convert to milliseconds
  const currentTime = Date.now();
  
  return currentTime >= expiryTime;
};

/**
 * Get token expiry time
 * 
 * @param token JWT token
 * @returns Expiry time in milliseconds or null if invalid
 */
export const getTokenExpiry = (token: string): number | null => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return null;
  }
  
  return decoded.exp * 1000; // Convert to milliseconds
};

/**
 * Check if token needs refresh
 * 
 * @param token JWT token
 * @param bufferTime Buffer time in milliseconds (default: 5 minutes)
 * @returns True if token needs refresh, false otherwise
 */
export const shouldRefreshToken = (
  token: string,
  bufferTime: number = 5 * 60 * 1000 // 5 minutes
): boolean => {
  const expiryTime = getTokenExpiry(token);
  if (!expiryTime) {
    return true;
  }
  
  const currentTime = Date.now();
  const timeUntilExpiry = expiryTime - currentTime;
  
  // Refresh if token expires within buffer time
  return timeUntilExpiry <= bufferTime;
};

