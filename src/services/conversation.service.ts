/**
 * Conversation Service
 * 
 * Service layer for conversation-related API operations.
 * Handles creating conversations, fetching conversations, and responding to broadcasts.
 */

import { API_BASE_URL } from '@/config/env';
import { API_ROUTES } from '@/config/routes';
import { getAccessToken } from '@/utils/token';
import { parseApiError } from '@/utils/error-handler';
import type {
  Conversation,
  CreateConversationRequest,
  RespondToBroadcastRequest,
  ConversationResponse,
  ConversationListResponse,
} from '@/types/conversation.types';

/**
 * Get all conversations for the current user
 * 
 * Returns all conversations where the user is either creator or participant.
 * 
 * Note: Backend returns Conversation[] with messages[] array (not ConversationListItem[])
 * Frontend must convert using convertToListItem() in useConversations hook
 * 
 * @returns Promise resolving to list of conversations (Conversation[] from backend)
 */
export const getConversations = async (): Promise<Conversation[]> => {
  const token = getAccessToken();

  if (!token) {
    throw new Error('No access token available');
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ROUTES.CONVERSATION.LIST}`,
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
 * Get a single conversation by ID
 * 
 * @param id Conversation ID
 * @returns Promise resolving to conversation
 */
export const getConversationById = async (id: string): Promise<Conversation> => {
  const token = getAccessToken();

  if (!token) {
    throw new Error('No access token available');
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ROUTES.CONVERSATION.DETAIL(id)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result: ConversationResponse = await response.json();

    if (!response.ok) {
      throw parseApiError({ ...result, statusCode: response.status });
    }

    return result.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

/**
 * Create a new conversation
 * 
 * @param data Conversation data
 * @returns Promise resolving to created conversation
 */
export const createConversation = async (
  data: CreateConversationRequest
): Promise<Conversation> => {
  const token = getAccessToken();

  if (!token) {
    throw new Error('No access token available');
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ROUTES.CONVERSATION.CREATE}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    const result: ConversationResponse = await response.json();

    if (!response.ok) {
      throw parseApiError({ ...result, statusCode: response.status });
    }

    return result.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

/**
 * Respond to a broadcast (creates a conversation)
 * 
 * This endpoint is used by doctors to respond to a patient's broadcast.
 * It creates a conversation between the doctor and the patient.
 * 
 * @param broadcastId Broadcast ID
 * @param data Response data (participant_id)
 * @returns Promise resolving to created conversation
 */
export const respondToBroadcast = async (
  broadcastId: string,
  data: RespondToBroadcastRequest
): Promise<Conversation> => {
  const token = getAccessToken();

  if (!token) {
    throw new Error('No access token available');
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ROUTES.CONVERSATION.RESPOND_TO_BROADCAST(broadcastId)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    const result: ConversationResponse = await response.json();

    if (!response.ok) {
      throw parseApiError({ ...result, statusCode: response.status });
    }

    return result.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

