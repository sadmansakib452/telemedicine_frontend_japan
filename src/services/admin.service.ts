/**
 * Admin Service
 * 
 * Service layer for admin-related API operations.
 * Handles system statistics, user management, and activity monitoring.
 */

import { API_BASE_URL } from '@/config/env';
import { API_ROUTES } from '@/config/routes';
import { getAccessToken } from '@/utils/token';
import { parseApiError } from '@/utils/error-handler';
import type {
  Statistics,
  StatisticsResponse,
  PendingVerification,
  PendingVerificationsResponse,
  ApproveUserResponse,
  RejectUserResponse,
  UserListParams,
  UserListResponse,
  AdminUser,
  ConversationListParams,
  ConversationListResponse,
  AdminConversation,
  PrescriptionListParams,
  PrescriptionListResponse,
  AdminPrescription,
  BroadcastListParams,
  AdminBroadcastListResponse,
  AdminBroadcast,
} from '@/types/admin.types';

/**
 * Get system statistics
 * 
 * Returns system statistics including user counts, conversation counts, prescription counts, and broadcast counts.
 * Admin only.
 * 
 * @returns Promise resolving to system statistics
 */
export const getStatistics = async (): Promise<Statistics> => {
  const token = getAccessToken();

  if (!token) {
    throw new Error('No access token available');
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ROUTES.ADMIN.STATISTICS}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result: StatisticsResponse = await response.json();

    if (!response.ok) {
      throw parseApiError({ ...result, statusCode: response.status });
    }

    return result.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

/**
 * Get pending verifications
 * 
 * Returns all doctors and shop owners waiting for approval.
 * Admin only.
 * 
 * @returns Promise resolving to list of pending verifications
 */
export const getPendingVerifications = async (): Promise<PendingVerification[]> => {
  const token = getAccessToken();

  if (!token) {
    throw new Error('No access token available');
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ROUTES.ADMIN.VERIFICATIONS_PENDING}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result: PendingVerificationsResponse = await response.json();

    if (!response.ok) {
      throw parseApiError({ ...result, statusCode: response.status });
    }

    return result.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

/**
 * Approve a user
 * 
 * Approves a doctor or shop owner account.
 * Admin only.
 * 
 * @param id User ID to approve
 * @returns Promise resolving to success message
 */
export const approveUser = async (id: string): Promise<string> => {
  const token = getAccessToken();

  if (!token) {
    throw new Error('No access token available');
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ROUTES.ADMIN.USER_APPROVE(id)}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result: ApproveUserResponse = await response.json();

    if (!response.ok) {
      throw parseApiError({ ...result, statusCode: response.status });
    }

    return result.message;
  } catch (error) {
    throw parseApiError(error);
  }
};

/**
 * Reject a user
 * 
 * Rejects a doctor or shop owner account.
 * Admin only.
 * 
 * @param id User ID to reject
 * @returns Promise resolving to success message
 */
export const rejectUser = async (id: string): Promise<string> => {
  const token = getAccessToken();

  if (!token) {
    throw new Error('No access token available');
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ROUTES.ADMIN.USER_REJECT(id)}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result: RejectUserResponse = await response.json();

    if (!response.ok) {
      throw parseApiError({ ...result, statusCode: response.status });
    }

    return result.message;
  } catch (error) {
    throw parseApiError(error);
  }
};

/**
 * Get all users
 * 
 * Returns all users with optional filtering.
 * Admin only.
 * 
 * @param params Filter parameters (q, type, approved, limit, cursor)
 * @returns Promise resolving to list of users with pagination info
 */
export const getAllUsers = async (
  params?: UserListParams
): Promise<{ users: AdminUser[]; count: number; cursor?: string; hasMore: boolean }> => {
  const token = getAccessToken();

  if (!token) {
    throw new Error('No access token available');
  }

  try {
    const queryParams = new URLSearchParams();

    if (params?.q) {
      queryParams.append('q', params.q);
    }

    if (params?.type) {
      queryParams.append('type', params.type);
    }

    if (params?.approved) {
      queryParams.append('approved', params.approved);
    }

    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }

    if (params?.cursor) {
      queryParams.append('cursor', params.cursor);
    }

    const response = await fetch(
      `${API_BASE_URL}${API_ROUTES.ADMIN.ALL_USERS}?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result: UserListResponse = await response.json();

    if (!response.ok) {
      throw parseApiError({ ...result, statusCode: response.status });
    }

    const limit = params?.limit || 20;
    return {
      users: result.data,
      count: result.count,
      hasMore: result.data.length === limit,
    };
  } catch (error) {
    throw parseApiError(error);
  }
};

/**
 * Get all conversations
 * 
 * Returns all conversations in the system (view-only).
 * Admin only.
 * 
 * @param params Pagination parameters (limit, cursor)
 * @returns Promise resolving to list of conversations with pagination info
 */
export const getAllConversations = async (
  params?: ConversationListParams
): Promise<{ conversations: AdminConversation[]; count: number; cursor?: string; hasMore: boolean }> => {
  const token = getAccessToken();

  if (!token) {
    throw new Error('No access token available');
  }

  try {
    const queryParams = new URLSearchParams();

    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    } else {
      queryParams.append('limit', '20'); // Default limit
    }

    if (params?.cursor) {
      queryParams.append('cursor', params.cursor);
    }

    const response = await fetch(
      `${API_BASE_URL}${API_ROUTES.ADMIN.CONVERSATIONS}?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result: ConversationListResponse = await response.json();

    if (!response.ok) {
      throw parseApiError({ ...result, statusCode: response.status });
    }

    const limit = params?.limit || 20;
    return {
      conversations: result.data,
      count: result.count,
      hasMore: result.data.length === limit,
    };
  } catch (error) {
    throw parseApiError(error);
  }
};

/**
 * Get all prescriptions
 * 
 * Returns all prescriptions in the system (view-only).
 * Admin only.
 * 
 * @param params Pagination parameters (limit, cursor)
 * @returns Promise resolving to list of prescriptions with pagination info
 */
export const getAllPrescriptions = async (
  params?: PrescriptionListParams
): Promise<{ prescriptions: AdminPrescription[]; count: number; cursor?: string; hasMore: boolean }> => {
  const token = getAccessToken();

  if (!token) {
    throw new Error('No access token available');
  }

  try {
    const queryParams = new URLSearchParams();

    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    } else {
      queryParams.append('limit', '20'); // Default limit
    }

    if (params?.cursor) {
      queryParams.append('cursor', params.cursor);
    }

    const response = await fetch(
      `${API_BASE_URL}${API_ROUTES.ADMIN.PRESCRIPTIONS}?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result: PrescriptionListResponse = await response.json();

    if (!response.ok) {
      throw parseApiError({ ...result, statusCode: response.status });
    }

    const limit = params?.limit || 20;
    return {
      prescriptions: result.data,
      count: result.count,
      hasMore: result.data.length === limit,
    };
  } catch (error) {
    throw parseApiError(error);
  }
};

/**
 * Get all broadcasts
 * 
 * Returns all broadcasts in the system (view-only).
 * Admin only.
 * 
 * @param params Pagination parameters (limit, cursor)
 * @returns Promise resolving to list of broadcasts with pagination info
 */
export const getAllBroadcasts = async (
  params?: BroadcastListParams
): Promise<{ broadcasts: AdminBroadcast[]; count: number; cursor?: string; hasMore: boolean }> => {
  const token = getAccessToken();

  if (!token) {
    throw new Error('No access token available');
  }

  try {
    const queryParams = new URLSearchParams();

    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    } else {
      queryParams.append('limit', '20'); // Default limit
    }

    if (params?.cursor) {
      queryParams.append('cursor', params.cursor);
    }

    const response = await fetch(
      `${API_BASE_URL}${API_ROUTES.ADMIN.BROADCASTS}?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result: AdminBroadcastListResponse = await response.json();

    if (!response.ok) {
      throw parseApiError({ ...result, statusCode: response.status });
    }

    const limit = params?.limit || 20;
    return {
      broadcasts: result.data,
      count: result.count,
      hasMore: result.data.length === limit,
    };
  } catch (error) {
    throw parseApiError(error);
  }
};

