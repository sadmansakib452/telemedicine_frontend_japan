/**
 * Token Refresh Utilities
 * 
 * Utilities for managing token refresh logic with API integration.
 * Handles automatic token refresh before expiry and 401 error handling.
 */

import { refreshToken } from '@/services/api/auth.service';
import {
  getAccessToken,
  setAccessToken,
  removeAccessToken,
  shouldRefreshToken as shouldRefresh,
  isTokenExpired,
} from './token';
import { TOKEN_REFRESH_BUFFER } from '@/config/env';
import { ApiError } from './error-handler';
import { HTTP_STATUS } from '@/config/constants';
import { isApprovalPendingError } from './approval-helpers';

/**
 * Refresh access token if needed
 * 
 * Checks if token needs refresh (expires within buffer time) and refreshes if needed.
 * 
 * @param bufferTime Buffer time in milliseconds (default: 5 minutes)
 * @returns New access token or null if refresh not needed
 * @throws ApiError if refresh fails
 */
export const refreshAccessTokenIfNeeded = async (
  bufferTime: number = TOKEN_REFRESH_BUFFER
): Promise<string | null> => {
  const currentToken = getAccessToken();
  
  if (!currentToken) {
    return null;
  }
  
  // Check if token is expired
  if (isTokenExpired(currentToken)) {
    // Token expired, try to refresh
    return await refreshAccessToken();
  }
  
  // Check if token needs refresh (expires within buffer time)
  if (shouldRefresh(currentToken, bufferTime)) {
    // Refresh token before expiry
    return await refreshAccessToken();
  }
  
  // Token is still valid, no refresh needed
  return null;
};

/**
 * Refresh access token
 * 
 * Calls API to get new access token using refresh token from httpOnly cookie.
 * Handles approval pending errors by clearing tokens.
 * 
 * @returns New access token
 * @throws ApiError if refresh fails
 */
export const refreshAccessToken = async (): Promise<string> => {
  try {
    const { access_token } = await refreshToken();
    
    // Store new access token
    setAccessToken(access_token);
    
    return access_token;
  } catch (error) {
    // Check if error is about pending approval
    if (isApprovalPendingError(error)) {
      // User is not approved, clear tokens
      // This will trigger logout in AuthContext
      removeAccessToken();
      throw new ApiError(
        'Your account is pending admin approval. Please wait for approval before accessing the system.',
        HTTP_STATUS.FORBIDDEN,
        'ApprovalPending'
      );
    }
    
    // Other errors (expired, invalid, etc.)
    removeAccessToken();
    throw error;
  }
};

/**
 * Handle 401 Unauthorized error
 * 
 * Attempts to refresh token on 401 error and retry request.
 * 
 * @param error Error to handle
 * @param retryCallback Callback to retry original request with new token
 * @returns Result from retry callback or throws error
 * @throws ApiError if refresh fails or retry fails
 */
export const handle401Error = async <T>(
  error: unknown,
  retryCallback: (newToken: string) => Promise<T>
): Promise<T> => {
  // Check if error is 401 Unauthorized
  if (
    error instanceof ApiError &&
    error.statusCode === HTTP_STATUS.UNAUTHORIZED
  ) {
    try {
      // Attempt to refresh token
      const newToken = await refreshAccessToken();
      
      // Retry original request with new token
      return await retryCallback(newToken);
    } catch {
      // Refresh failed, rethrow original error
      throw error;
    }
  }
  
  // Not a 401 error or refresh failed, rethrow
  throw error;
};

/**
 * Auto-refresh token before expiry
 * 
 * Sets up automatic token refresh based on token expiry time.
 * Should be called on app initialization or after login.
 * Handles approval pending errors by calling onApprovalPending callback.
 * 
 * @param onRefreshSuccess Callback when refresh succeeds
 * @param onRefreshError Callback when refresh fails
 * @param onApprovalPending Callback when refresh fails due to approval pending
 * @returns Interval ID for clearing interval
 */
export const setupAutoTokenRefresh = (
  onRefreshSuccess?: (token: string) => void,
  onRefreshError?: (error: Error) => void,
  onApprovalPending?: (error: Error) => void
): NodeJS.Timeout | null => {
  const currentToken = getAccessToken();
  
  if (!currentToken) {
    return null;
  }
  
  // Check token expiry and calculate refresh time
  const checkAndRefresh = async () => {
    try {
      const newToken = await refreshAccessTokenIfNeeded();
      if (newToken) {
        onRefreshSuccess?.(newToken);
      }
    } catch (error) {
      // Check if error is about approval pending
      if (isApprovalPendingError(error)) {
        onApprovalPending?.(error as Error);
      } else {
        onRefreshError?.(error as Error);
      }
    }
  };
  
  // Check immediately
  checkAndRefresh();
  
  // Check every minute
  const interval = setInterval(checkAndRefresh, 60 * 1000);
  
  return interval;
};

/**
 * Clear auto-refresh interval
 * 
 * @param intervalId Interval ID from setupAutoTokenRefresh
 */
export const clearAutoTokenRefresh = (
  intervalId: NodeJS.Timeout | null
): void => {
  if (intervalId) {
    clearInterval(intervalId);
  }
};

