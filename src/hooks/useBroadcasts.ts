/**
 * Broadcasts Hook (List of Broadcasts)
 * 
 * React hook for managing a list of broadcasts.
 * Supports fetching inbox broadcasts (doctors) and patient broadcasts.
 * Includes WebSocket integration for real-time updates.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getBroadcastInbox,
  getPatientBroadcasts,
  createBroadcast,
} from '@/services/broadcast.service';
import { useSocket } from '@/hooks/useSocket';
import { WS_EVENTS } from '@/config/constants';
import type { BroadcastListItem, CreateBroadcastRequest } from '@/types/broadcast.types';
import type { NewBroadcastEvent, BroadcastAssistedEvent } from '@/types/socket.types';
import type { UserType } from '@/config/constants';

/**
 * Broadcast List Type
 */
export type BroadcastListType = 'inbox' | 'patient';

/**
 * Use Broadcasts Return Type
 */
interface UseBroadcastsReturn {
  broadcasts: BroadcastListItem[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  create: (data: CreateBroadcastRequest) => Promise<void>;
}

/**
 * Broadcasts Hook
 * 
 * Manages a list of broadcasts based on user type and list type.
 * 
 * @param userType Current user type
 * @param userId Current user ID (for WebSocket personal room joining)
 * @param listType Type of broadcast list ('inbox' for doctors, 'patient' for patients)
 * @returns Broadcast list and operations
 */
export const useBroadcasts = (
  userType: UserType | undefined,
  userId?: string,
  listType: BroadcastListType = 'inbox'
): UseBroadcastsReturn => {
  const [broadcasts, setBroadcasts] = useState<BroadcastListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Handle new broadcast WebSocket event (doctors only)
   */
  const handleNewBroadcast = useCallback(
    (event: NewBroadcastEvent) => {
      // Only add to inbox if list type is 'inbox'
      if (listType === 'inbox' && event.broadcast.status === 'open') {
        setBroadcasts((prev) => {
          // Check if broadcast already exists
          const exists = prev.some((b) => b.id === event.broadcast.id);
          if (exists) {
            return prev;
          }
          // Add new broadcast to the beginning (most recent first)
          return [event.broadcast, ...prev];
        });
      }
    },
    [listType]
  );

  /**
   * Handle broadcast assisted WebSocket event (doctors only)
   */
  const handleBroadcastAssisted = useCallback(
    (event: BroadcastAssistedEvent) => {
      // Remove from inbox if list type is 'inbox' (broadcast is no longer open)
      if (listType === 'inbox') {
        setBroadcasts((prev) => prev.filter((b) => b.id !== event.broadcast_id));
      } else {
        // Update broadcast status in patient list
        setBroadcasts((prev) =>
          prev.map((b) =>
            b.id === event.broadcast_id
              ? { ...b, status: 'assisted', assisted_by: event.assisted_by }
              : b
          )
        );
      }
    },
    [listType]
  );

  /**
   * Setup WebSocket listeners for broadcasts
   */
  const { socket, isConnected } = useSocket(userType, userId, {
    onNewBroadcast: handleNewBroadcast,
    onBroadcastAssisted: handleBroadcastAssisted,
  });

  /**
   * Fetch broadcasts based on list type
   */
  const fetchBroadcasts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let data: BroadcastListItem[];

      if (listType === 'inbox') {
        // Doctors only - fetch open broadcasts
        data = await getBroadcastInbox();
      } else {
        // Patients only - fetch patient's own broadcasts
        data = await getPatientBroadcasts();
      }

      setBroadcasts(data);
    } catch (err) {
      setError(err as Error);
      setBroadcasts([]);
    } finally {
      setIsLoading(false);
    }
  }, [listType]);

  /**
   * Create a new broadcast
   */
  const create = useCallback(
    async (data: CreateBroadcastRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        await createBroadcast(data);
        // Refetch broadcasts after creating
        await fetchBroadcasts();
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchBroadcasts]
  );

  /**
   * Refetch broadcasts
   */
  const refetch = useCallback(async () => {
    await fetchBroadcasts();
  }, [fetchBroadcasts]);

  /**
   * Fetch broadcasts on mount and when dependencies change
   * Only fetch if userType is provided (user is authenticated)
   */
  useEffect(() => {
    if (userType) {
      fetchBroadcasts();
    }
  }, [fetchBroadcasts, userType]);

  return {
    broadcasts,
    isLoading,
    error,
    refetch,
    create,
  };
};

