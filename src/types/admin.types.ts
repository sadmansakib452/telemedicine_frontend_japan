/**
 * Admin Types
 * 
 * Type definitions for admin-related data structures.
 */

import { UserType } from '@/config/constants';
import { User } from './user.types';
import { Conversation, ConversationListItem } from './conversation.types';
import { Message } from './message.types';
import { Broadcast } from './broadcast.types';

/**
 * System Statistics
 */
export interface Statistics {
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
      admin?: number;
    };
  };
  pending_verifications: {
    total: number;
    by_type: {
      doctor: number;
      shop_owner: number;
    };
  };
  conversations: {
    total: number;
  };
  prescriptions: {
    total: number;
  };
  broadcasts: {
    total: number;
    open: number;
    assisted: number;
  };
}

/**
 * Statistics Response
 */
export interface StatisticsResponse {
  success: boolean;
  data: Statistics;
}

/**
 * Pending Verification
 */
export interface PendingVerification {
  id: string;
  name: string;
  first_name?: string;
  last_name?: string;
  email: string;
  phone_number?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  type: UserType;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
  avatar: string | null;
  avatar_url: string | null;
}

/**
 * Pending Verifications Response
 */
export interface PendingVerificationsResponse {
  success: boolean;
  data: PendingVerification[];
  count: number;
}

/**
 * Approve User Response
 */
export interface ApproveUserResponse {
  success: boolean;
  message: string;
}

/**
 * Reject User Response
 */
export interface RejectUserResponse {
  success: boolean;
  message: string;
}

/**
 * User List Parameters
 */
export interface UserListParams {
  q?: string; // Search query (name or email)
  type?: UserType; // User type filter (patient, doctor, shop_owner, admin)
  approved?: 'approved' | 'pending'; // Approval status filter
  limit?: number; // Maximum number of users to return
  cursor?: string; // Cursor for pagination
}

/**
 * Admin User
 */
export interface AdminUser {
  id: string;
  name: string;
  first_name?: string;
  last_name?: string;
  email: string;
  phone_number?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  type: UserType;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
  avatar: string | null;
  avatar_url: string | null;
}

/**
 * User List Response
 */
export interface UserListResponse {
  success: boolean;
  data: AdminUser[];
  count: number;
}

/**
 * Conversation List Parameters
 */
export interface ConversationListParams {
  limit?: number; // Maximum number of conversations to return
  cursor?: string; // Cursor for pagination
}

/**
 * Admin Conversation
 */
export interface AdminConversation extends ConversationListItem {
  // Additional admin-specific fields if needed
}

/**
 * Conversation List Response
 */
export interface ConversationListResponse {
  success: boolean;
  data: AdminConversation[];
  count: number;
}

/**
 * Prescription List Parameters
 */
export interface PrescriptionListParams {
  limit?: number; // Maximum number of prescriptions to return
  cursor?: string; // Cursor for pagination
}

/**
 * Admin Prescription
 * Note: Message already includes sender and receiver fields
 */
export interface AdminPrescription extends Message {
  // Additional admin-specific fields
  conversation?: {
    id: string;
    type: string;
    status: string;
  };
}

/**
 * Prescription List Response
 */
export interface PrescriptionListResponse {
  success: boolean;
  data: AdminPrescription[];
  count: number;
}

/**
 * Broadcast List Parameters
 */
export interface BroadcastListParams {
  limit?: number; // Maximum number of broadcasts to return
  cursor?: string; // Cursor for pagination
}

/**
 * Admin Broadcast
 * Note: Broadcast already includes patient field, so we can use it directly
 */
export interface AdminBroadcast extends Broadcast {
  // Additional admin-specific fields if needed
}

/**
 * Admin Broadcast List Response
 */
export interface AdminBroadcastListResponse {
  success: boolean;
  data: AdminBroadcast[];
  count: number;
}

