/**
 * API Response Types
 * 
 * Type definitions for API response structures and error formats.
 */

import { HTTP_STATUS } from '@/config/constants';

/**
 * Standard API Response
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  statusCode?: number;
  error?: string;
  errors?: Record<string, string[]>;
  count?: number;
}

/**
 * Error Response (Current Format)
 * Supports both current and standardized formats
 */
export interface ErrorResponse {
  success: false;
  message: string | string[] | ErrorMessageObject;
  statusCode?: number;
  error?: string;
  errors?: Record<string, string[]>;
  data?: any; // For 409 Conflict with existing resource
}

/**
 * Error Message Object (Current Format - NestJS ValidationPipe)
 */
export interface ErrorMessageObject {
  statusCode: number;
  message: string[];
  error: string;
}

/**
 * Standardized Error Response (Planned Format)
 */
export interface StandardizedErrorResponse {
  success: false;
  message: string;
  statusCode: number;
  error: string;
  errors?: Record<string, string[]>;
}

/**
 * Validation Error Response
 */
export interface ValidationErrorResponse {
  success: false;
  message: string | string[];
  statusCode: 400;
  error?: string;
  errors?: Record<string, string[]>;
}

/**
 * Pagination Response
 */
export interface PaginationResponse<T> {
  success: boolean;
  data: T[];
  count?: number;
  cursor?: string;
  limit?: number;
}

/**
 * Pagination Parameters
 */
export interface PaginationParams {
  limit?: number;
  cursor?: string;
}

/**
 * HTTP Status Codes
 */
export type HttpStatusCode = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];

