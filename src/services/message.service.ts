/**
 * Message Service
 * 
 * Service layer for message-related API operations.
 * Handles sending messages, fetching messages, and updating message status.
 */

import { API_BASE_URL } from '@/config/env';
import { API_ROUTES } from '@/config/routes';
import { getAccessToken } from '@/utils/token';
import { parseApiError } from '@/utils/error-handler';
import type {
  Message,
  MessageListItem,
  SendMessageRequest,
  SendPrescriptionRequest,
  UpdateMessageStatusRequest,
  MessageResponse,
  MessageListResponse,
  MessagePaginationParams,
} from '@/types/message.types';

/**
 * Get a single message by ID
 * 
 * Returns a message (text or prescription) by ID.
 * Works for all user types (doctors, patients, shop owners, admins).
 * 
 * Authorization: User must be sender, receiver, or conversation participant.
 * 
 * @param id Message ID (prescription ID)
 * @returns Promise resolving to message
 */
export const getMessageById = async (id: string): Promise<Message> => {
  const token = getAccessToken();

  if (!token) {
    throw new Error('No access token available');
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ROUTES.MESSAGE.DETAIL(id)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result: MessageResponse = await response.json();

    if (!response.ok) {
      throw parseApiError({ ...result, statusCode: response.status });
    }

    return result.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

/**
 * Get messages for a conversation
 * 
 * Returns messages for a specific conversation with cursor-based pagination.
 * 
 * @param params Pagination parameters (conversation_id, limit, cursor)
 * @returns Promise resolving to list of messages
 */
export const getMessages = async (
  params: MessagePaginationParams
): Promise<{ messages: MessageListItem[]; cursor?: string; hasMore: boolean }> => {
  const token = getAccessToken();

  if (!token) {
    throw new Error('No access token available');
  }

  try {
    const queryParams = new URLSearchParams({
      conversation_id: params.conversation_id,
    });

    if (params.limit) {
      queryParams.append('limit', params.limit.toString());
    }

    if (params.cursor) {
      queryParams.append('cursor', params.cursor);
    }

    const response = await fetch(
      `${API_BASE_URL}${API_ROUTES.MESSAGE.LIST}?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result: MessageListResponse = await response.json();

    if (!response.ok) {
      throw parseApiError({ ...result, statusCode: response.status });
    }

    return {
      messages: result.data,
      cursor: result.cursor,
      hasMore: result.data.length === (params.limit || 20),
    };
  } catch (error) {
    throw parseApiError(error);
  }
};

/**
 * Send a message
 * 
 * @param data Message data
 * @returns Promise resolving to sent message
 */
export const sendMessage = async (
  data: SendMessageRequest
): Promise<Message> => {
  const token = getAccessToken();

  if (!token) {
    throw new Error('No access token available');
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ROUTES.MESSAGE.SEND}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    const result: MessageResponse = await response.json();

    if (!response.ok) {
      throw parseApiError({ ...result, statusCode: response.status });
    }

    return result.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

/**
 * Send a prescription
 * 
 * Helper function for sending prescription messages.
 * Automatically sets message_type to 'prescription'.
 * 
 * @param data Prescription data
 * @returns Promise resolving to sent prescription message
 */
export const sendPrescription = async (
  data: SendPrescriptionRequest
): Promise<Message> => {
  const token = getAccessToken();

  if (!token) {
    throw new Error('No access token available');
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ROUTES.MESSAGE.SEND}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data,
          message_type: 'prescription',
          message: data.message || 'Prescription',
        }),
      }
    );

    const result: MessageResponse = await response.json();

    if (!response.ok) {
      throw parseApiError({ ...result, statusCode: response.status });
    }

    return result.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

/**
 * Update message status
 * 
 * @param messageId Message ID
 * @param status New status (PENDING, SENT, DELIVERED, READ)
 * @returns Promise resolving to success status
 */
export const updateMessageStatus = async (
  messageId: string,
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'READ'
): Promise<void> => {
  const token = getAccessToken();

  if (!token) {
    throw new Error('No access token available');
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ROUTES.MESSAGE.UPDATE_STATUS(messageId)}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status } as UpdateMessageStatusRequest),
      }
    );

    if (!response.ok) {
      const result: MessageResponse = await response.json();
      throw parseApiError({ ...result, statusCode: response.status });
    }
  } catch (error) {
    throw parseApiError(error);
  }
};

