/**
 * Prescription Service
 * 
 * Service layer for prescription-related API operations.
 * Handles fetching prescriptions for viewing.
 */

import { API_BASE_URL } from '@/config/env';
import { API_ROUTES } from '@/config/routes';
import { getAccessToken } from '@/utils/token';
import { parseApiError } from '@/utils/error-handler';
import type {
  Prescription,
  PrescriptionListItem,
  PrescriptionResponse,
  PrescriptionListResponse,
  PrescriptionPaginationParams,
} from '@/types/prescription.types';

/**
 * Get all prescriptions (for shop owners)
 * 
 * Returns all prescriptions that have been distributed to shop owners.
 * 
 * @param params Pagination parameters (limit, cursor)
 * @returns Promise resolving to list of prescriptions
 */
export const getPrescriptions = async (
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

    const url = `${API_BASE_URL}${API_ROUTES.PRESCRIPTION.LIST}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

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

    return {
      prescriptions: result.data,
      cursor: result.cursor,
      hasMore: result.data.length === (params?.limit || 20),
    };
  } catch (error) {
    throw parseApiError(error);
  }
};

/**
 * Get a single prescription by ID
 * 
 * @param id Prescription ID (message ID)
 * @returns Promise resolving to prescription
 */
export const getPrescriptionById = async (id: string): Promise<Prescription> => {
  const token = getAccessToken();

  if (!token) {
    throw new Error('No access token available');
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ROUTES.PRESCRIPTION.DETAIL(id)}`,
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

    return result.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

