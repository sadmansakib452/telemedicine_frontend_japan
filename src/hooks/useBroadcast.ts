/**
 * Broadcast Hook (Single Broadcast)
 * 
 * React hook for managing a single broadcast.
 * Used for viewing broadcast details and deleting broadcasts.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getBroadcastById,
  deleteBroadcast,
} from '@/services/broadcast.service';
import type { Broadcast } from '@/types/broadcast.types';

/**
 * Use Broadcast Return Type
 */
interface UseBroadcastReturn {
  broadcast: Broadcast | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  remove: () => Promise<void>;
}

/**
 * Broadcast Hook
 * 
 * Manages a single broadcast by ID.
 * 
 * @param id Broadcast ID
 * @returns Broadcast data and operations
 */
export const useBroadcast = (id: string | null): UseBroadcastReturn => {
  const [broadcast, setBroadcast] = useState<Broadcast | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch broadcast by ID
   */
  const fetchBroadcast = useCallback(async () => {
    if (!id) {
      setBroadcast(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getBroadcastById(id);
      setBroadcast(data);
    } catch (err) {
      setError(err as Error);
      setBroadcast(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  /**
   * Delete broadcast
   */
  const remove = useCallback(async () => {
    if (!id) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await deleteBroadcast(id);
      setBroadcast(null);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  /**
   * Refetch broadcast
   */
  const refetch = useCallback(async () => {
    await fetchBroadcast();
  }, [fetchBroadcast]);

  /**
   * Fetch broadcast on mount and when ID changes
   */
  useEffect(() => {
    fetchBroadcast();
  }, [fetchBroadcast]);

  return {
    broadcast,
    isLoading,
    error,
    refetch,
    remove,
  };
};

