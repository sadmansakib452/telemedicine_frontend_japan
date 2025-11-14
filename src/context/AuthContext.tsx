/**
 * Auth Context
 * 
 * Global authentication context for the application.
 * Provides authentication state and operations to all components.
 */

'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import {
  login as loginApi,
  register as registerApi,
  verifyEmail as verifyEmailApi,
  logout as logoutApi,
  getCurrentUser,
  updateUser as updateUserApi,
} from '@/services/api/auth.service';
import {
  setAccessToken,
  removeAccessToken,
  getAccessToken,
} from '@/utils/token';
import {
  refreshAccessTokenIfNeeded,
  setupAutoTokenRefresh,
  clearAutoTokenRefresh,
} from '@/utils/token-refresh';
import { RouteHelpers, PUBLIC_ROUTES } from '@/config/routes';
import { isApprovalPendingError, isPendingApprovalMessage } from '@/utils/approval-helpers';
import type { User } from '@/types/user.types';
import type { LoginRequest, RegisterRequest, UpdateUserRequest, VerifyEmailRequest } from '@/types/user.types';
import type { UserType } from '@/config/constants';

/**
 * Auth State
 */
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  pendingVerificationEmail: string | null; // Email waiting for OTP verification
  pendingVerificationUserType: UserType | null; // User type during verification
  isVerifyingEmail: boolean; // Loading state for OTP verification
  showApprovalPending: boolean; // Show approval pending modal
  approvalPendingMessage: string | null; // Approval error message
}

/**
 * Auth Context Type
 */
interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<{ email: string; userType: UserType }>; // Returns email and user type for OTP verification
  verifyEmail: (data: VerifyEmailRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (data: UpdateUserRequest) => Promise<void>;
  clearError: () => void;
  clearPendingVerification: () => void; // Clear pending verification email
  clearApprovalPending: () => void; // Clear approval pending state
}

/**
 * Auth Context
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Auth Provider Props
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Auth Provider
 * 
 * Provides authentication state and operations to all components.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    pendingVerificationEmail: null,
    pendingVerificationUserType: null,
    isVerifyingEmail: false,
    showApprovalPending: false,
    approvalPendingMessage: null,
  });
  
  /**
   * Update state helper
   */
  const updateState = useCallback((updates: Partial<AuthState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);
  
  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);
  
  /**
   * Fetch current user
   */
  const fetchCurrentUser = useCallback(async () => {
    try {
      updateState({ isLoading: true, error: null });
      
      // Check if token exists
      const token = getAccessToken();
      if (!token) {
        updateState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
        return;
      }
      
      // Refresh token if needed
      await refreshAccessTokenIfNeeded();
      
      // Fetch user data
      const user = await getCurrentUser();
      
      updateState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      // Token invalid or user not found
      removeAccessToken();
      updateState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch user',
      });
    }
  }, [updateState]);
  
  /**
   * Login
   * 
   * Handles login with approval check.
   * If user is not approved, shows approval pending modal.
   */
  const login = useCallback(
    async (credentials: LoginRequest) => {
      try {
        updateState({ isLoading: true, error: null, showApprovalPending: false });
        
        // Call login API
        const response = await loginApi(credentials);
        
        // Store access token
        setAccessToken(response.authorization.access_token);
        
        // Refresh token if needed (ensure token is valid before fetching user)
        await refreshAccessTokenIfNeeded();
        
        // Fetch user data (this updates the state with user info)
        const user = await getCurrentUser();
        updateState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
        
        // Setup auto token refresh
        setupAutoTokenRefresh();
        
        // Redirect based on user type from fetched user data
        // Prefer user.type from /auth/me endpoint over response.type
        // Use window.location.href for full page reload to ensure cookie is sent to middleware
        const userType = user?.type || response?.type;
        if (!userType) {
          console.error('User type not found in response or user data', { user, response });
          updateState({ 
            isLoading: false, 
            error: 'Failed to determine user type. Please try again.' 
          });
          return;
        }
        const redirectRoute = RouteHelpers.getRedirectRoute(userType);
        window.location.href = redirectRoute;
      } catch (error) {
        // Check if error is about pending approval
        if (isApprovalPendingError(error)) {
          const errorMessage = error instanceof Error ? error.message : 'Your account is pending admin approval. Please wait for approval before logging in.';
          updateState({
            isLoading: false,
            showApprovalPending: true,
            approvalPendingMessage: errorMessage,
            error: null, // Don't show error in form, show modal instead
          });
        } else {
          updateState({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Login failed',
            showApprovalPending: false,
          });
        }
        throw error;
      }
    },
    [updateState]
  );
  
  /**
   * Register
   * 
   * Registers a new user and sends OTP to email.
   * Returns email and user type for OTP verification step.
   */
  const register = useCallback(
    async (data: RegisterRequest): Promise<{ email: string; userType: UserType }> => {
      try {
        updateState({ isLoading: true, error: null });
        
        // Call register API (OTP will be sent to email)
        await registerApi(data);
        
        // Store email and user type for OTP verification
        updateState({
          isLoading: false,
          pendingVerificationEmail: data.email,
          pendingVerificationUserType: data.type,
        });
        
        // Return email and user type for OTP verification
        return { email: data.email, userType: data.type };
      } catch (error) {
        updateState({
          isLoading: false,
          error: error instanceof Error ? error.message : 'Registration failed',
        });
        throw error;
      }
    },
    [updateState]
  );
  
  /**
   * Verify Email with OTP
   * 
   * Verifies the email address using the 6-digit OTP code.
   * After successful verification:
   * - Patients: Auto-approved, redirect to login
   * - Doctors/Shop Owners: NOT approved, show pending approval page
   */
  const verifyEmail = useCallback(
    async (data: VerifyEmailRequest) => {
      try {
        updateState({ isVerifyingEmail: true, error: null });
        
        // Call verify email API
        const response = await verifyEmailApi(data);
        
        // Get user type from pending verification state
        const userType = state.pendingVerificationUserType;
        
        // Check if message indicates pending approval
        const isPending = isPendingApprovalMessage(response.message);
        
        // Clear pending verification email and user type
        updateState({
          isVerifyingEmail: false,
          pendingVerificationEmail: null,
          pendingVerificationUserType: null,
        });
        
        // Handle based on user type and approval status
        // Handle both 'shop_keeper' (frontend constant) and 'shop_owner' (backend value)
        const isShopOwner = userType === 'shop_keeper' || (userType as string) === 'shop_owner';
        if (isPending && (userType === 'doctor' || isShopOwner)) {
          // Doctor/Shop Owner - Pending approval
          // Redirect to verification success page with pending status
          router.push(`${PUBLIC_ROUTES.LOGIN}?verification=success&status=pending`);
        } else {
          // Patient - Auto-approved, or already approved
          // Redirect to login
          router.push(`${PUBLIC_ROUTES.LOGIN}?verification=success&status=approved`);
        }
      } catch (error) {
        updateState({
          isVerifyingEmail: false,
          error: error instanceof Error ? error.message : 'Email verification failed',
        });
        throw error;
      }
    },
    [updateState, router, state.pendingVerificationUserType]
  );
  
  /**
   * Clear pending verification email
   */
  const clearPendingVerification = useCallback(() => {
    updateState({ 
      pendingVerificationEmail: null,
      pendingVerificationUserType: null,
    });
  }, [updateState]);
  
  /**
   * Clear approval pending state
   */
  const clearApprovalPending = useCallback(() => {
    updateState({ 
      showApprovalPending: false,
      approvalPendingMessage: null,
    });
  }, [updateState]);
  
  /**
   * Logout
   */
  const logout = useCallback(async () => {
    try {
      updateState({ isLoading: true, error: null });
      
      // Call logout API (clears refresh token on server)
      await logoutApi();
      
      // Clear access token
      removeAccessToken();
      
      // Clear auto refresh
      clearAutoTokenRefresh(null);
      
      // Update state
      updateState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      
      // Redirect to login
      router.push(PUBLIC_ROUTES.LOGIN);
    } catch {
      // Even if logout API fails, clear local state
      removeAccessToken();
      updateState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      router.push(PUBLIC_ROUTES.LOGIN);
    }
  }, [updateState, router]);
  
  /**
   * Refresh user data
   */
  const refreshUser = useCallback(async () => {
    await fetchCurrentUser();
  }, [fetchCurrentUser]);
  
  /**
   * Update user profile
   */
  const updateUser = useCallback(
    async (data: UpdateUserRequest) => {
      try {
        updateState({ isLoading: true, error: null });
        
        // Call update API
        const updatedUser = await updateUserApi(data);
        
        // Update state
        updateState({
          user: updatedUser,
          isLoading: false,
        });
      } catch (error) {
        updateState({
          isLoading: false,
          error: error instanceof Error ? error.message : 'Update failed',
        });
        throw error;
      }
    },
    [updateState]
  );
  
  /**
   * Handle approval pending from token refresh
   */
  const handleApprovalPending = useCallback((error: Error) => {
    // Clear tokens and auth state
    removeAccessToken();
    updateState({
      user: null,
      isAuthenticated: false,
      showApprovalPending: true,
      approvalPendingMessage: error.message,
    });
    // Redirect to login
    router.push(`${PUBLIC_ROUTES.LOGIN}?status=approval_pending`);
  }, [updateState, router]);
  
  /**
   * Initialize auth state on mount
   */
  useEffect(() => {
    // Check if token exists and fetch user
    fetchCurrentUser().then(() => {
      // Setup auto token refresh after initial load
      const token = getAccessToken();
      if (token) {
        setupAutoTokenRefresh(
          undefined, // onRefreshSuccess
          undefined, // onRefreshError
          handleApprovalPending // onApprovalPending
        );
      }
    });
    
    // Cleanup auto refresh on unmount
    return () => {
      clearAutoTokenRefresh(null);
    };
  }, [fetchCurrentUser, handleApprovalPending]);
  
  const value: AuthContextType = {
    ...state,
    login,
    register,
    verifyEmail,
    logout,
    refreshUser,
    updateUser,
    clearError,
    clearPendingVerification,
    clearApprovalPending,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Use Auth Hook
 * 
 * Hook to access authentication context.
 * 
 * @returns Auth context value
 * @throws Error if used outside AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

