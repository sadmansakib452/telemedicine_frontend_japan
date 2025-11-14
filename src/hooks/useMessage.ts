/**
 * Message Hook (Single Message)
 * 
 * React hook for managing a single message.
 * Used for viewing message details and updating message status.
 */

'use client';

import { useState, useCallback } from 'react';
import { updateMessageStatus } from '@/services/message.service';
import type { MessageStatus } from '@/config/constants';

/**
 * Use Message Return Type
 */
interface UseMessageReturn {
  updateStatus: (
    messageId: string,
    status: 'PENDING' | 'SENT' | 'DELIVERED' | 'READ'
  ) => Promise<void>;
  isUpdating: boolean;
  error: Error | null;
}

/**
 * Message Hook
 * 
 * Manages operations for a single message.
 * 
 * @returns Message operations
 */
export const useMessage = (): UseMessageReturn => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Update message status
   */
  const updateStatus = useCallback(
    async (
      messageId: string,
      status: 'PENDING' | 'SENT' | 'DELIVERED' | 'READ'
    ): Promise<void> => {
      setIsUpdating(true);
      setError(null);

      try {
        await updateMessageStatus(messageId, status);
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setIsUpdating(false);
      }
    },
    []
  );

  return {
    updateStatus,
    isUpdating,
    error,
  };
};

