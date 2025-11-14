/**
 * Shop Owner Service
 * 
 * Service layer for shop owner-specific API operations.
 * Handles fetching shop owner conversations and prescriptions.
 */

import { API_BASE_URL } from '@/config/env';
import { API_ROUTES } from '@/config/routes';
import { getAccessToken } from '@/utils/token';
import { parseApiError } from '@/utils/error-handler';
import type {
  ConversationListItem,
  ConversationListResponse,
} from '@/types/conversation.types';
import type {
  PrescriptionListItem,
  PrescriptionListResponse,
  PrescriptionPaginationParams,
  PrescriptionResponse,
} from '@/types/prescription.types';

/**
 * Get shop owner conversations
 * 
 * Returns all conversations where the shop owner is the participant.
 * All conversations are type: "doctor_shop_owner".
 * 
 * @returns Promise resolving to list of conversations
 */
export const getShopOwnerConversations = async (): Promise<ConversationListItem[]> => {
  const token = getAccessToken();

  if (!token) {
    throw new Error('No access token available');
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ROUTES.SHOP_OWNER.CONVERSATIONS}`,
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

    return result.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

/**
 * Get shop owner prescriptions
 * 
 * Returns all prescriptions that have been distributed to the shop owner.
 * 
 * @param params Pagination parameters (limit, cursor)
 * @returns Promise resolving to list of prescriptions
 */
export const getShopOwnerPrescriptions = async (
  params?: PrescriptionPaginationParams
): Promise<{ prescriptions: PrescriptionListItem[]; cursor?: string; hasMore: boolean }> => {
  const token = getAccessToken();

  if (!token) {
    throw new Error('No access token available');
  }

  try {
    const queryParams = new URLSearchParams();

    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }

    if (params?.cursor) {
      queryParams.append('cursor', params.cursor);
    }

    const url = `${API_BASE_URL}${API_ROUTES.SHOP_OWNER.PRESCRIPTIONS}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result: PrescriptionListResponse = await response.json();

    if (!response.ok) {
      throw parseApiError({ ...result, statusCode: response.status });
    }

    // Calculate hasMore: if count equals limit, there might be more pages
    const limit = params?.limit || 20;
    const hasMore = (result.count || result.data.length) === limit;

    return {
      prescriptions: result.data,
      cursor: result.cursor,
      hasMore,
    };
  } catch (error) {
    throw parseApiError(error);
  }
};

/**
 * Get a single prescription by ID (shop owner)
 * 
 * @param id Prescription ID (message ID)
 * @returns Promise resolving to prescription
 */
export const getShopOwnerPrescriptionById = async (id: string): Promise<PrescriptionListItem> => {
  const token = getAccessToken();

  if (!token) {
    throw new Error('No access token available');
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ROUTES.SHOP_OWNER.PRESCRIPTION_DETAIL(id)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result: PrescriptionResponse = await response.json();

    if (!response.ok) {
      throw parseApiError({ ...result, statusCode: response.status });
    }

    // Convert Prescription to PrescriptionListItem
    const prescription: PrescriptionListItem = {
      id: result.data.id,
      message: result.data.message,
      message_type: result.data.message_type as 'prescription',
      medicine_details: result.data.medicine_details || '',
      patient_name: result.data.patient_name || '',
      sender_id: result.data.sender_id,
      receiver_id: result.data.receiver_id,
      conversation_id: result.data.conversation_id,
      status: result.data.status,
      created_at: result.data.created_at,
      updated_at: result.data.updated_at,
      sender: result.data.sender,
      receiver: result.data.receiver,
      conversation: result.data.conversation,
    };

    return prescription;
  } catch (error) {
    throw parseApiError(error);
  }
};

