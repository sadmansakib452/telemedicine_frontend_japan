/**
 * Admin Conversations Hook
 * 
 * React hook for managing admin conversation list.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAllConversations } from '@/services/admin.service';
import type {
  AdminConversation,
  ConversationListParams,
} from '@/types/admin.types';

/**
 * Use Admin Conversations Return Type
 */
interface UseAdminConversationsReturn {
  conversations: AdminConversation[];
  isLoading: boolean;
  error: Error | null;
  count: number;
  cursor: string | undefined;
  hasMore: boolean;
  refetch: () => Promise<void>;
  fetchMore: () => Promise<void>;
}

/**
 * Admin Conversations Hook
 * 
 * Manages conversation list for admin users.
 * 
 * @param params Conversation list parameters (limit, cursor)
 * @returns Conversation list and operations
 */
export const useAdminConversations = (
  params?: ConversationListParams
): UseAdminConversationsReturn => {
  const [conversations, setConversations] = useState<AdminConversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [count, setCount] = useState(0);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(false);

  /**
   * Fetch conversations
   */
  const fetchConversations = useCallback(async (reset: boolean = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getAllConversations(reset ? params : { ...params, cursor });
      if (reset) {
        setConversations(result.conversations);
      } else {
        setConversations((prev) => [...prev, ...result.conversations]);
      }
      setCount(result.count);
      setCursor(result.cursor);
      setHasMore(result.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch conversations'));
    } finally {
      setIsLoading(false);
    }
  }, [params, cursor]);

  /**
   * Fetch conversations on mount
   */
  useEffect(() => {
    fetchConversations(true);
  }, []);

  /**
   * Fetch more conversations
   */
  const fetchMore = useCallback(async () => {
    if (hasMore && !isLoading) {
      await fetchConversations(false);
    }
  }, [hasMore, isLoading, fetchConversations]);

  return {
    conversations,
    isLoading,
    error,
    count,
    cursor,
    hasMore,
    refetch: () => fetchConversations(true),
    fetchMore,
  };
};

