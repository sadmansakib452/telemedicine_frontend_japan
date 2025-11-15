/**
 * User Types
 * 
 * Type definitions for user-related data structures.
 */

import { UserType } from '@/config/constants';

/**
 * User Information
 */
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  avatar_url: string | null;
  type: UserType;
  address?: string | null;
  phone_number?: string | null;
  approved_at?: string | null;
  created_at: string;
  updated_at: string;
}


/**
 * Auth Response
 */
export interface AuthResponse {
  success: boolean;
  authorization: {
    type: string;
    access_token: string;
    refresh_token?: string;
  };
  type: UserType; // User type is at root level in actual response
  message?: string;
  // Note: User data is fetched separately via /auth/me endpoint
}

/**
 * Registration Response (OTP Flow)
 * 
 * After registration, backend sends OTP to email.
 * No access token is returned - user must verify email first.
 */
export interface RegisterResponse {
  success: boolean;
  message: string;
  // Note: No authorization field - OTP verification required
}

/**
 * Verify Email Request (OTP)
 */
export interface VerifyEmailRequest {
  email: string;
  token: string; // 6-digit OTP
}

/**
 * Verify Email Response
 */
export interface VerifyEmailResponse {
  success: boolean;
  message: string;
}

/**
 * Login Request
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Register Request
 */
export interface RegisterRequest {
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  type: UserType;
}

/**
 * Update User Request
 */
export interface UpdateUserRequest {
  name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  address?: string;
  phone_number?: string;
  image?: File; // For avatar upload (multipart/form-data)
}

/**
 * User Statistics (Admin)
 */
export interface UserStatistics {
  users: {
    total: number;
    by_type: {
      patient: number;
      doctor: number;
      shop_owner: number;
      admin: number;
    };
  };
  approved_users: {
    total: number;
    by_type: {
      patient: number;
      doctor: number;
      shop_owner: number;
    };
  };
  pending_verifications: {
    total: number;
    by_type: {
      doctor: number;
      shop_owner: number;
    };
  };
}

/**
 * User List Item (Admin)
 */
export interface UserListItem {
  id: string;
  name: string;
  email: string;
  type: UserType;
  approved_at: string | null;
  avatar_url: string | null;
  created_at: string;
}

