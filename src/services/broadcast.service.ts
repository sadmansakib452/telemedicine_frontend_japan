/**
 * Broadcast Service
 * 
 * Service layer for broadcast-related API operations.
 * Handles creating broadcasts, fetching broadcasts, and managing broadcast state.
 */

import { API_BASE_URL } from '@/config/env';
import { API_ROUTES } from '@/config/routes';
import { getAccessToken } from '@/utils/token';
import { parseApiError } from '@/utils/error-handler';
import type {
  Broadcast,
  BroadcastListItem,
  CreateBroadcastRequest,
  BroadcastResponse,
  BroadcastListResponse,
  BroadcastInboxResponse,
} from '@/types/broadcast.types';
import type { ApiResponse } from '@/types/api.types';

/**
 * Create a new broadcast
 * 
 * @param data Broadcast data (message)
 * @returns Promise resolving to created broadcast
 */
export const createBroadcast = async (
  data: CreateBroadcastRequest
): Promise<Broadcast> => {
  const token = getAccessToken();

  if (!token) {
    throw new Error('No access token available');
  }

  try {
    const response = await fetch(`${API_BASE_URL}${API_ROUTES.BROADCAST.CREATE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result: BroadcastResponse = await response.json();

    if (!response.ok) {
      throw parseApiError({ ...result, statusCode: response.status });
    }

    return result.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

/**
 * Get all open broadcasts (doctors only)
 * 
 * Returns only broadcasts with status 'open' that doctors can respond to.
 * 
 * @returns Promise resolving to list of open broadcasts
 */
export const getBroadcastInbox = async (): Promise<BroadcastListItem[]> => {
  const token = getAccessToken();

  if (!token) {
    throw new Error('No access token available');
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ROUTES.BROADCAST.INBOX}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result: BroadcastInboxResponse = await response.json();

    if (!response.ok) {
      throw parseApiError({ ...result, statusCode: response.status });
    }

    return result.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

/**
 * Get patient's own broadcasts
 * 
 * Returns all broadcasts created by the current patient.
 * 
 * @returns Promise resolving to list of patient's broadcasts
 */
export const getPatientBroadcasts = async (): Promise<BroadcastListItem[]> => {
  const token = getAccessToken();

  if (!token) {
    throw new Error('No access token available');
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ROUTES.BROADCAST.PATIENT}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result: BroadcastListResponse = await response.json();

    if (!response.ok) {
      throw parseApiError({ ...result, statusCode: response.status });
    }

    return result.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

/**
 * Get a single broadcast by ID
 * 
 * @param id Broadcast ID
 * @returns Promise resolving to broadcast
 */
export const getBroadcastById = async (id: string): Promise<Broadcast> => {
  const token = getAccessToken();

  if (!token) {
    throw new Error('No access token available');
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ROUTES.BROADCAST.DETAIL(id)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result: BroadcastResponse = await response.json();

    if (!response.ok) {
      throw parseApiError({ ...result, statusCode: response.status });
    }

    return result.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

/**
 * Delete a broadcast
 * 
 * Only the patient who created the broadcast can delete it.
 * 
 * @param id Broadcast ID
 * @returns Promise resolving to success status
 */
export const deleteBroadcast = async (id: string): Promise<void> => {
  const token = getAccessToken();

  if (!token) {
    throw new Error('No access token available');
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ROUTES.BROADCAST.DELETE(id)}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const result: ApiResponse = await response.json();
      throw parseApiError({ ...result, statusCode: response.status });
    }
  } catch (error) {
    throw parseApiError(error);
  }
};

