/**
 * API Client Utilities
 * 
 * Base API client utilities for making HTTP requests.
 * This file provides the base API client setup with interceptors.
 * The actual API client implementation will be in services/api-client.ts
 */

import { API_BASE_URL, API_TIMEOUT } from '@/config/env';
import { getAccessToken, createAuthHeader } from './token';
import { handleApiError, ApiError } from './error-handler';
import { HTTP_STATUS } from '@/config/constants';

/**
 * API Request Options
 */
export interface ApiRequestOptions extends RequestInit {
  timeout?: number;
  skipAuth?: boolean;
  skipErrorHandling?: boolean;
}

/**
 * API Response
 */
export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

/**
 * Create API request URL
 * 
 * @param endpoint API endpoint
 * @returns Full API URL
 */
export const createApiUrl = (endpoint: string): string => {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  // Remove /api prefix if present (already in API_BASE_URL)
  const finalEndpoint = cleanEndpoint.startsWith('api/')
    ? cleanEndpoint.slice(4)
    : cleanEndpoint;
  
  // Combine base URL with endpoint
  return `${API_BASE_URL}/${finalEndpoint}`;
};

/**
 * Create API request headers
 * 
 * @param options Request options
 * @returns Request headers
 */
export const createApiHeaders = async (
  options: ApiRequestOptions = {}
): Promise<Record<string, string>> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  // Merge existing headers
  if (options.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => {
        headers[key] = value;
      });
    } else if (Array.isArray(options.headers)) {
      options.headers.forEach(([key, value]) => {
        headers[key] = value;
      });
    } else {
      Object.assign(headers, options.headers);
    }
  }
  
  // Add authorization header if not skipped
  if (!options.skipAuth) {
    const token = getAccessToken();
    if (token) {
      headers['Authorization'] = createAuthHeader(token);
    }
  }
  
  return headers;
};

/**
 * Create timeout promise
 * 
 * @param timeout Timeout in milliseconds
 * @returns Promise that rejects after timeout
 */
const createTimeoutPromise = (timeout: number): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new ApiError('Request timeout', HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }, timeout);
  });
};

/**
 * Make API request
 * 
 * @param endpoint API endpoint
 * @param options Request options
 * @returns API response
 */
export const apiRequest = async <T = unknown>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> => {
  try {
    // Create API URL
    const url = createApiUrl(endpoint);
    
    // Create headers
    const headers = await createApiHeaders(options);
    
    // Create request timeout
    const timeout = options.timeout || API_TIMEOUT;
    const timeoutPromise = createTimeoutPromise(timeout);
    
    // Create fetch request
    const fetchPromise = fetch(url, {
      ...options,
      headers,
    });
    
    // Race between fetch and timeout
    const response = await Promise.race([fetchPromise, timeoutPromise]);
    
    // Check if response is ok
    if (!response.ok) {
      // Parse error response
      const errorData = await response.json().catch(() => ({}));
      throw handleApiError({
        response: {
          data: errorData,
          status: response.status,
          statusText: response.statusText,
        },
      });
    }
    
    // Parse response
    const data = (await response.json().catch(() => ({}))) as T;
    
    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    };
  } catch (error) {
    // Handle error
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw handleApiError(error as Error);
  }
};

/**
 * Make GET request
 * 
 * @param endpoint API endpoint
 * @param options Request options
 * @returns API response
 */
export const apiGet = <T = unknown>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, {
    ...options,
    method: 'GET',
  });
};

/**
 * Make POST request
 * 
 * @param endpoint API endpoint
 * @param data Request data
 * @param options Request options
 * @returns API response
 */
export const apiPost = <T = unknown>(
  endpoint: string,
  data?: unknown,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
};

/**
 * Make PUT request
 * 
 * @param endpoint API endpoint
 * @param data Request data
 * @param options Request options
 * @returns API response
 */
export const apiPut = <T = unknown>(
  endpoint: string,
  data?: unknown,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
};

/**
 * Make PATCH request
 * 
 * @param endpoint API endpoint
 * @param data Request data
 * @param options Request options
 * @returns API response
 */
export const apiPatch = <T = unknown>(
  endpoint: string,
  data?: unknown,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, {
    ...options,
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  });
};

/**
 * Make DELETE request
 * 
 * @param endpoint API endpoint
 * @param options Request options
 * @returns API response
 */
export const apiDelete = <T = unknown>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, {
    ...options,
    method: 'DELETE',
  });
};

/**
 * Make multipart/form-data request (for file uploads)
 * 
 * @param endpoint API endpoint
 * @param formData FormData object
 * @param options Request options
 * @returns API response
 */
export const apiUpload = <T = unknown>(
  endpoint: string,
  formData: FormData,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> => {
  // Create headers without Content-Type (browser will set it with boundary)
  const headers: Record<string, string> = {};
  
  // Add authorization header if not skipped
  if (!options.skipAuth) {
    const token = getAccessToken();
    if (token) {
      headers['Authorization'] = createAuthHeader(token);
    }
  }
  
  return apiRequest<T>(endpoint, {
    ...options,
    method: 'POST',
    headers,
    body: formData,
  });
};

