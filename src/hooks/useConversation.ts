/**
 * Conversation Hook (Single Conversation)
 * 
 * React hook for managing a single conversation.
 * Used for viewing conversation details and managing conversation state.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getConversationById,
} from '@/services/conversation.service';
import type { Conversation } from '@/types/conversation.types';

/**
 * Use Conversation Return Type
 */
interface UseConversationReturn {
  conversation: Conversation | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Conversation Hook
 * 
 * Manages a single conversation by ID.
 * 
 * @param id Conversation ID
 * @returns Conversation data and operations
 */
export const useConversation = (id: string | null): UseConversationReturn => {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch conversation by ID
   */
  const fetchConversation = useCallback(async () => {
    if (!id) {
      setConversation(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getConversationById(id);
      setConversation(data);
    } catch (err) {
      setError(err as Error);
      setConversation(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  /**
   * Refetch conversation
   */
  const refetch = useCallback(async () => {
    await fetchConversation();
  }, [fetchConversation]);

  /**
   * Fetch conversation on mount and when ID changes
   */
  useEffect(() => {
    fetchConversation();
  }, [fetchConversation]);

  return {
    conversation,
    isLoading,
    error,
    refetch,
  };
};

