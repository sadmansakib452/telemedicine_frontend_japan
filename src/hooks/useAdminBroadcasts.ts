/**
 * Admin Broadcasts Hook
 * 
 * React hook for managing admin broadcast list.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAllBroadcasts } from '@/services/admin.service';
import type {
  AdminBroadcast,
  BroadcastListParams,
} from '@/types/admin.types';

/**
 * Use Admin Broadcasts Return Type
 */
interface UseAdminBroadcastsReturn {
  broadcasts: AdminBroadcast[];
  isLoading: boolean;
  error: Error | null;
  count: number;
  cursor: string | undefined;
  hasMore: boolean;
  refetch: () => Promise<void>;
  fetchMore: () => Promise<void>;
}

/**
 * Admin Broadcasts Hook
 * 
 * Manages broadcast list for admin users.
 * 
 * @param params Broadcast list parameters (limit, cursor)
 * @returns Broadcast list and operations
 */
export const useAdminBroadcasts = (
  params?: BroadcastListParams
): UseAdminBroadcastsReturn => {
  const [broadcasts, setBroadcasts] = useState<AdminBroadcast[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [count, setCount] = useState(0);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(false);

  /**
   * Fetch broadcasts
   */
  const fetchBroadcasts = useCallback(async (reset: boolean = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getAllBroadcasts(reset ? params : { ...params, cursor });
      if (reset) {
        setBroadcasts(result.broadcasts);
      } else {
        setBroadcasts((prev) => [...prev, ...result.broadcasts]);
      }
      setCount(result.count);
      setCursor(result.cursor);
      setHasMore(result.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch broadcasts'));
    } finally {
      setIsLoading(false);
    }
  }, [params, cursor]);

  /**
   * Fetch broadcasts on mount
   */
  useEffect(() => {
    fetchBroadcasts(true);
  }, []);

  /**
   * Fetch more broadcasts
   */
  const fetchMore = useCallback(async () => {
    if (hasMore && !isLoading) {
      await fetchBroadcasts(false);
    }
  }, [hasMore, isLoading, fetchBroadcasts]);

  return {
    broadcasts,
    isLoading,
    error,
    count,
    cursor,
    hasMore,
    refetch: () => fetchBroadcasts(true),
    fetchMore,
  };
};

