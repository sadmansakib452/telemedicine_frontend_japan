/**
 * Error Handler Utility
 * 
 * Utilities for handling API errors (supports both current and standardized formats).
 * Based on backend clarification: supports both formats during transition period.
 */

import { HTTP_STATUS, ERROR_MESSAGES } from '@/config/constants';
import type {
  ErrorResponse,
  StandardizedErrorResponse,
  ValidationErrorResponse,
  ErrorMessageObject,
} from '@/types/api.types';

/**
 * API Error
 */
export class ApiError extends Error {
  statusCode: number;
  error?: string;
  errors?: Record<string, string[]>;
  data?: any; // For 409 Conflict with existing resource

  constructor(
    message: string,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    error?: string,
    errors?: Record<string, string[]>,
    data?: any
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.error = error;
    this.errors = errors;
    this.data = data;
  }
}

/**
 * Parse API error response
 * Supports both current and standardized formats
 * 
 * @param error Error response from API
 * @returns Parsed error object
 */
export const parseApiError = (error: any): ApiError => {
  // Check if it's already an ApiError
  if (error instanceof ApiError) {
    return error;
  }
  
  // Check if it's a standardized format (has statusCode and error fields at root)
  if (error.statusCode && error.error) {
    // Standardized format
    return new ApiError(
      error.message || ERROR_MESSAGES.SERVER_ERROR,
      error.statusCode,
      error.error,
      error.errors || undefined,
      error.data
    );
  }
  
  // Check if it's an ErrorMessageObject (NestJS ValidationPipe format)
  // Handles nested structure: { success: false, message: { message: "..." | [...], error: "...", statusCode: 401 } }
  if (error.message && typeof error.message === 'object' && !Array.isArray(error.message)) {
    const errorObj = error.message as ErrorMessageObject;
    
    // Check if it has nested message structure with statusCode
    if (errorObj.statusCode) {
      // Handle different message formats:
      // 1. String: { message: { message: "Error text", ... } }
      // 2. Array: { message: { message: ["Error 1", "Error 2"], ... } }
      let errorMessages: string[] = [];
      let mainMessage: string = ERROR_MESSAGES.VALIDATION_ERROR;
      
      if (Array.isArray(errorObj.message)) {
        // Array of error messages
        errorMessages = errorObj.message;
        mainMessage = errorMessages.length > 0 ? errorMessages[0] : ERROR_MESSAGES.VALIDATION_ERROR;
      } else if (typeof errorObj.message === 'string') {
        // Single string message
        errorMessages = [errorObj.message];
        mainMessage = errorObj.message;
      }
      
      const errors = parseValidationErrors(errorMessages);
      
      return new ApiError(
        mainMessage,
        errorObj.statusCode || HTTP_STATUS.BAD_REQUEST,
        errorObj.error || 'Bad Request',
        errors,
        error.data
      );
    }
  }
  
  // Check if it's a current format (string or array)
  if (typeof error.message === 'string') {
    // Current format: string message
    return new ApiError(
      error.message,
      error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error.error || 'Error',
      undefined,
      error.data
    );
  }
  
  // Check if it's a current format (array of validation errors)
  if (Array.isArray(error.message)) {
    // Current format: array of validation errors
    const errors = parseValidationErrors(error.message);
    return new ApiError(
      ERROR_MESSAGES.VALIDATION_ERROR,
      HTTP_STATUS.BAD_REQUEST,
      'Bad Request',
      errors,
      error.data
    );
  }
  
  // Fallback: try to extract any meaningful message
  // Check for common error response structures
  if (error.success === false && error.message) {
    // If message is a string, use it
    if (typeof error.message === 'string') {
      return new ApiError(
        error.message,
        error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR,
        error.error || 'Error',
        undefined,
        error.data
      );
    }
  }
  
  // Final fallback: unknown error format
  return new ApiError(
    error.message || ERROR_MESSAGES.SERVER_ERROR,
    error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR,
    error.error || 'Error',
    undefined,
    error.data
  );
};

/**
 * Parse validation errors from array format
 * Converts array of strings to field-level errors
 * 
 * @param errors Array of error messages
 * @returns Field-level errors object
 */
export const parseValidationErrors = (
  errors: string[]
): Record<string, string[]> => {
  const fieldErrors: Record<string, string[]> = {};
  
  for (const error of errors) {
    // Check for "Type must be..." pattern (for type field)
    if (error.toLowerCase().includes('type must be') || error.toLowerCase().includes('type')) {
      if (!fieldErrors['type']) {
        fieldErrors['type'] = [];
      }
      fieldErrors['type'].push(error);
      continue;
    }
    
    // Parse error message (format: "field_name error message")
    const match = error.match(/^(\w+)\s+(.+)$/i);
    if (match) {
      const field = match[1].toLowerCase();
      const message = match[2];
      
      if (!fieldErrors[field]) {
        fieldErrors[field] = [];
      }
      
      fieldErrors[field].push(message);
    } else {
      // If no field name, use generic key
      if (!fieldErrors['_general']) {
        fieldErrors['_general'] = [];
      }
      
      fieldErrors['_general'].push(error);
    }
  }
  
  return fieldErrors;
};

/**
 * Get error message for display
 * 
 * @param error Error object
 * @returns Error message string
 */
export const getErrorMessage = (error: any): string => {
  if (error instanceof ApiError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return ERROR_MESSAGES.SERVER_ERROR;
};

/**
 * Get field-level errors for display
 * 
 * @param error Error object
 * @returns Field-level errors object
 */
export const getFieldErrors = (
  error: any
): Record<string, string[]> | undefined => {
  if (error instanceof ApiError) {
    return error.errors;
  }
  
  if (error.errors && typeof error.errors === 'object') {
    return error.errors;
  }
  
  return undefined;
};

/**
 * Check if error is a specific status code
 * 
 * @param error Error object
 * @param statusCode HTTP status code
 * @returns True if error has specified status code
 */
export const isErrorStatus = (error: any, statusCode: number): boolean => {
  if (error instanceof ApiError) {
    return error.statusCode === statusCode;
  }
  
  if (error.statusCode) {
    return error.statusCode === statusCode;
  }
  
  return false;
};

/**
 * Check if error is a validation error
 * 
 * @param error Error object
 * @returns True if error is a validation error
 */
export const isValidationError = (error: any): boolean => {
  return isErrorStatus(error, HTTP_STATUS.BAD_REQUEST);
};

/**
 * Check if error is an unauthorized error
 * 
 * @param error Error object
 * @returns True if error is an unauthorized error
 */
export const isUnauthorizedError = (error: any): boolean => {
  return isErrorStatus(error, HTTP_STATUS.UNAUTHORIZED);
};

/**
 * Check if error is a forbidden error
 * 
 * @param error Error object
 * @returns True if error is a forbidden error
 */
export const isForbiddenError = (error: any): boolean => {
  return isErrorStatus(error, HTTP_STATUS.FORBIDDEN);
};

/**
 * Check if error is a not found error
 * 
 * @param error Error object
 * @returns True if error is a not found error
 */
export const isNotFoundError = (error: any): boolean => {
  return isErrorStatus(error, HTTP_STATUS.NOT_FOUND);
};

/**
 * Check if error is a conflict error
 * 
 * @param error Error object
 * @returns True if error is a conflict error
 */
export const isConflictError = (error: any): boolean => {
  return isErrorStatus(error, HTTP_STATUS.CONFLICT);
};

/**
 * Handle API error response
 * Converts error to ApiError and handles different error formats
 * 
 * @param error Error response from API
 * @returns ApiError instance
 */
export const handleApiError = (error: any): ApiError => {
  // Check if it's a network error (no response object)
  // This happens when fetch fails (network issue, CORS, etc.)
  if (!error.response) {
    // Check if it's already an ApiError
    if (error instanceof ApiError) {
      return error;
    }
    
    // Check if it's a fetch error (network failure)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return new ApiError(
        ERROR_MESSAGES.NETWORK_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        'Network Error'
      );
    }
    
    // Check if error has a message (might be a thrown Error)
    if (error.message) {
      return new ApiError(
        error.message,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        'Error'
      );
    }
    
    // True network error (no response, no message)
    return new ApiError(
      ERROR_MESSAGES.NETWORK_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      'Network Error'
    );
  }
  
  // Parse API error response
  // error.response.data contains the actual error response from the server
  const errorData = error.response.data || error.response;
  
  // If errorData is empty or invalid, use response status
  if (!errorData || (typeof errorData === 'object' && Object.keys(errorData).length === 0)) {
    return new ApiError(
      error.response.statusText || ERROR_MESSAGES.SERVER_ERROR,
      error.response.status || HTTP_STATUS.INTERNAL_SERVER_ERROR,
      'Error'
    );
  }
  
  return parseApiError(errorData);
};

