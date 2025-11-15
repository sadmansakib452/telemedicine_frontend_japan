/**
 * Auth Service
 * 
 * Service layer for authentication-related API calls.
 * Handles login, register, logout, token refresh, and user profile management.
 */

import { apiPost, apiGet, apiUpload } from '@/utils/api-client';
import { handleApiError } from '@/utils/error-handler';
import { API_ROUTES } from '@/config/routes';
import type {
  LoginRequest,
  RegisterRequest,
  UpdateUserRequest,
  AuthResponse,
  RegisterResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  User,
} from '@/types/user.types';
import type { ApiResponse } from '@/types/api.types';

/**
 * Register a new user
 * 
 * After registration, backend sends OTP to email.
 * User must verify email before logging in.
 * 
 * Maps frontend user types to backend API types:
 * - shop_keeper -> shop_owner (backend expects shop_owner)
 * 
 * @param data Registration data
 * @returns Registration response (OTP sent message)
 * @throws ApiError if registration fails
 */
export const register = async (
  data: RegisterRequest
): Promise<RegisterResponse> => {
  try {
    // Map frontend user type to backend API type
    // Frontend uses 'shop_keeper', backend expects 'shop_owner'
    const apiData = {
      ...data,
      type: data.type === 'shop_keeper' ? 'shop_owner' : data.type,
    };
    
    const response = await apiPost<RegisterResponse>(
      API_ROUTES.AUTH.REGISTER,
      apiData,
      { skipAuth: true }
    );
    
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Verify email with OTP
 * 
 * Verifies the email address using the 6-digit OTP code sent to the user's email.
 * After successful verification, user can log in.
 * 
 * @param data Email and OTP token
 * @returns Verification response
 * @throws ApiError if verification fails
 */
export const verifyEmail = async (
  data: VerifyEmailRequest
): Promise<VerifyEmailResponse> => {
  try {
    const response = await apiPost<VerifyEmailResponse>(
      API_ROUTES.AUTH.VERIFY_EMAIL,
      data,
      { skipAuth: true }
    );
    
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Login with email and password
 * 
 * @param data Login credentials
 * @returns Auth response with access token and user data
 * @throws ApiError if login fails
 */
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  try {
    const response = await apiPost<AuthResponse>(
      API_ROUTES.AUTH.LOGIN,
      data,
      { skipAuth: true }
    );
    
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Logout current user
 * 
 * Backend deletes refresh token from Redis (server-side invalidation)
 * Frontend should clear access token and redirect to login
 * 
 * @returns Success response
 * @throws ApiError if logout fails
 */
export const logout = async (): Promise<ApiResponse<{ message: string }>> => {
  try {
    const response = await apiPost<ApiResponse<{ message: string }>>(
      API_ROUTES.AUTH.LOGOUT
    );
    
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Refresh access token
 * 
 * Uses refresh token stored in httpOnly cookie to get new access token
 * Access token lifetime: 1 hour
 * Refresh token lifetime: 7 days
 * 
 * @param refreshToken Refresh token (optional, backend reads from cookie)
 * @returns New access token
 * @throws ApiError if token refresh fails
 */
export const refreshToken = async (
  refreshToken?: string
): Promise<{ access_token: string }> => {
  try {
    const response = await apiPost<{
      success: boolean;
      authorization: {
        type: string;
        access_token: string;
      };
    }>(
      API_ROUTES.AUTH.REFRESH_TOKEN,
      refreshToken ? { refresh_token: refreshToken } : undefined,
      { skipAuth: true }
    );
    
    return {
      access_token: response.data.authorization.access_token,
    };
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get current user profile
 * 
 * @returns Current user data
 * @throws ApiError if request fails
 */
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await apiGet<ApiResponse<User>>(API_ROUTES.AUTH.ME);
    
    if (!response.data.data) {
      throw new Error('User data not found in response');
    }
    
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Update user profile
 * 
 * Always uses multipart/form-data (required by backend even without file upload)
 * Supports avatar upload via multipart/form-data
 * Old avatar is deleted on upload
 * 
 * @param data User update data (can include file for avatar)
 * @returns Updated user data
 * @throws ApiError if update fails
 */
export const updateUser = async (
  data: UpdateUserRequest
): Promise<User> => {
  try {
    // Always use multipart/form-data (required by backend)
    const formData = new FormData();
    
    // Add text fields (only if provided)
    if (data.name) formData.append('name', data.name);
    if (data.first_name) formData.append('first_name', data.first_name);
    if (data.last_name) formData.append('last_name', data.last_name);
    if (data.email) formData.append('email', data.email);
    if (data.address) formData.append('address', data.address);
    if (data.phone_number) formData.append('phone_number', data.phone_number);
    
    // Add avatar file if included (field name: 'image')
    if (data.image && data.image instanceof File) {
      formData.append('image', data.image);
    }
    
    // Use PATCH method with multipart/form-data
    const response = await apiUpload<ApiResponse<User>>(
      API_ROUTES.AUTH.UPDATE,
      formData,
      { method: 'PATCH' }
    );
    
    if (!response.data.data) {
      throw new Error('User data not found in response');
    }
    
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Update user profile (name, first_name, last_name only)
 * 
 * Simplified version for profile page that only updates name fields.
 * Always uses multipart/form-data (required by backend).
 * 
 * @param profileData Profile data (name, first_name, last_name)
 * @returns Success response
 * @throws ApiError if update fails
 */
export const updateUserProfile = async (profileData: {
  name?: string;
  first_name?: string;
  last_name?: string;
}): Promise<{ success: boolean; message: string }> => {
  try {
    // Always use multipart/form-data (required by backend)
    const formData = new FormData();
    
    // Add fields only if provided (trim whitespace)
    let hasFields = false;
    if (profileData.name && profileData.name.trim()) {
      formData.append('name', profileData.name.trim());
      hasFields = true;
    }
    if (profileData.first_name && profileData.first_name.trim()) {
      formData.append('first_name', profileData.first_name.trim());
      hasFields = true;
    }
    if (profileData.last_name && profileData.last_name.trim()) {
      formData.append('last_name', profileData.last_name.trim());
      hasFields = true;
    }
    
    // Check if formData has any entries - backend might require at least one field
    if (!hasFields) {
      throw new Error('At least one field must be provided to update');
    }
    
    // Use PATCH method with multipart/form-data
    const response = await apiUpload<{ success: boolean; message: string }>(
      API_ROUTES.AUTH.UPDATE,
      formData,
      { method: 'PATCH' }
    );
    
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Change user password
 * 
 * Requires old password for verification.
 * Email is not required (backend uses JWT token to identify user).
 * 
 * @param oldPassword Current password
 * @param newPassword New password (minimum 8 characters)
 * @returns Success response
 * @throws ApiError if password change fails
 */
export const changePassword = async (
  oldPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiPost<{ success: boolean; message: string }>(
      API_ROUTES.AUTH.CHANGE_PASSWORD,
      {
        old_password: oldPassword,
        new_password: newPassword,
        // Note: email is NOT required - backend uses JWT token
      }
    );
    
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

