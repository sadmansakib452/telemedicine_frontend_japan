/**
 * Approval Helpers
 * 
 * Utility functions for detecting and handling approval-related errors and states.
 */

import { getErrorMessage } from './error-handler';

/**
 * Check if error is related to pending approval
 * 
 * @param error Error object or message string
 * @returns True if error is about pending approval
 */
export const isApprovalPendingError = (error: unknown): boolean => {
  const message = getErrorMessage(error);
  if (!message) return false;
  
  const lowerMessage = message.toLowerCase();
  return (
    lowerMessage.includes('pending admin approval') ||
    lowerMessage.includes('awaiting admin approval') ||
    lowerMessage.includes('account is pending') ||
    lowerMessage.includes('pending approval')
  );
};

/**
 * Check if verification success message indicates pending approval
 * 
 * @param message Success message from email verification
 * @returns True if message indicates pending approval
 */
export const isPendingApprovalMessage = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  return lowerMessage.includes('pending admin approval') ||
         lowerMessage.includes('awaiting admin approval');
};

/**
 * Extract user type from error message (if available)
 * 
 * @param error Error object
 * @returns User type if mentioned in error, null otherwise
 */
export const extractUserTypeFromError = (error: unknown): 'doctor' | 'shop_owner' | null => {
  const message = getErrorMessage(error);
  if (!message) return null;
  
  const lowerMessage = message.toLowerCase();
  if (lowerMessage.includes('doctor')) return 'doctor';
  if (lowerMessage.includes('shop owner') || lowerMessage.includes('shop_owner')) return 'shop_owner';
  
  return null;
};

