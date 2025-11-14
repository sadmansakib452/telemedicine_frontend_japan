/**
 * Auth Service
 * 
 * Service layer for authentication-related API calls.
 * Handles login, register, logout, token refresh, and user profile management.
 */

import { apiPost, apiGet, apiPatch, apiUpload } from '@/utils/api-client';
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
    // Check if avatar file is included (multipart/form-data)
    if (data.image && data.image instanceof File) {
      const formData = new FormData();
      
      // Add text fields
      if (data.name) formData.append('name', data.name);
      if (data.first_name) formData.append('first_name', data.first_name);
      if (data.last_name) formData.append('last_name', data.last_name);
      if (data.email) formData.append('email', data.email);
      if (data.address) formData.append('address', data.address);
      if (data.phone_number) formData.append('phone_number', data.phone_number);
      
      // Add avatar file (field name: 'image')
      formData.append('image', data.image);
      
      const response = await apiUpload<ApiResponse<User>>(
        API_ROUTES.AUTH.UPDATE,
        formData
      );
      
      if (!response.data.data) {
        throw new Error('User data not found in response');
      }
      
      return response.data.data;
    } else {
      // Regular JSON update (no file)
      const response = await apiPatch<ApiResponse<User>>(
        API_ROUTES.AUTH.UPDATE,
        data
      );
      
      if (!response.data.data) {
        throw new Error('User data not found in response');
      }
      
      return response.data.data;
    }
  } catch (error) {
    throw handleApiError(error);
  }
};

