/**
 * Prescriptions Hook (List of Prescriptions)
 * 
 * React hook for managing a list of prescriptions for shop owners.
 * Includes WebSocket integration for real-time updates.
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getShopOwnerPrescriptions } from '@/services/api/shop-owner.service';
import { useSocket } from '@/hooks/useSocket';
import { WS_EVENTS } from '@/config/constants';
import type { PrescriptionListItem, PrescriptionPaginationParams } from '@/types/prescription.types';
import type { NewPrescriptionEvent } from '@/types/socket.types';
import type { UserType } from '@/config/constants';

/**
 * Use Prescriptions Return Type
 */
interface UsePrescriptionsReturn {
  prescriptions: PrescriptionListItem[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: Error | null;
  hasMore: boolean;
  cursor?: string;
  loadMore: () => Promise<void>;
  refetch: () => Promise<void>;
}

/**
 * Prescriptions Hook
 * 
 * Manages a list of prescriptions for shop owners.
 * 
 * @param userType Current user type (for WebSocket event filtering)
 * @param userId Current user ID (for WebSocket personal room joining)
 * @param limit Number of prescriptions per page (default: 20)
 * @returns Prescription list and operations
 */
export const usePrescriptions = (
  userType: UserType | undefined,
  userId: string | undefined,
  limit: number = 20
): UsePrescriptionsReturn => {
  const [prescriptions, setPrescriptions] = useState<PrescriptionListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);
  const prescriptionsRef = useRef<PrescriptionListItem[]>([]);
  const prescriptionIdsRef = useRef<Set<string>>(new Set());

  // Update refs when prescriptions change
  useEffect(() => {
    prescriptionsRef.current = prescriptions;
    prescriptionIdsRef.current = new Set(prescriptions.map((p) => p.id));
  }, [prescriptions]);

  /**
   * Handle new prescription WebSocket event (shop owners only)
   */
  const handleNewPrescription = useCallback(
    (event: NewPrescriptionEvent) => {
      // Guard against malformed events
      if (!event?.prescription) {
        console.error('Received malformed new_prescription event:', event);
        return;
      }

      const incomingPrescription = event.prescription;

      // Skip if we already have this prescription
      if (prescriptionIdsRef.current.has(incomingPrescription.id)) {
        return;
      }

      // Mark as seen immediately
      prescriptionIdsRef.current.add(incomingPrescription.id);

      // Map event prescription to PrescriptionListItem format
      // Note: WebSocket event may have simplified sender/receiver, but we'll use what's available
      const prescriptionListItem: PrescriptionListItem = {
        id: incomingPrescription.id,
        message: incomingPrescription.message,
        message_type: 'prescription',
        medicine_details: incomingPrescription.medicine_details,
        patient_name: incomingPrescription.patient_name,
        sender_id: incomingPrescription.sender_id,
        receiver_id: incomingPrescription.receiver_id,
        conversation_id: incomingPrescription.conversation_id,
        status: incomingPrescription.status,
        created_at: incomingPrescription.created_at,
        // Map sender (doctor) - WebSocket event has simplified sender
        sender: {
          id: incomingPrescription.sender.id,
          name: incomingPrescription.sender.name,
          email: '', // Not in WebSocket event, will be filled when refetching
          avatar: incomingPrescription.sender.avatar || null,
          avatar_url: incomingPrescription.sender.avatar_url || null,
          type: 'doctor' as const,
          created_at: incomingPrescription.created_at, // Use prescription created_at as fallback
          updated_at: incomingPrescription.created_at,
        },
        // Map receiver if available
        receiver: incomingPrescription.receiver ? {
          id: incomingPrescription.receiver.id,
          name: incomingPrescription.receiver.name,
          email: '', // Not in WebSocket event
          avatar: incomingPrescription.receiver.avatar || null,
          avatar_url: incomingPrescription.receiver.avatar_url || null,
          type: 'shop_owner' as const,
          created_at: incomingPrescription.created_at,
          updated_at: incomingPrescription.created_at,
        } : undefined,
      };

      // Add new prescription to the beginning (most recent first)
      setPrescriptions((prev) => {
        // Double-check in state (defensive)
        const exists = prev.some((p) => p.id === prescriptionListItem.id);
        if (exists) {
          return prev;
        }
        return [prescriptionListItem, ...prev];
      });
    },
    []
  );

  /**
   * Setup WebSocket listeners for prescriptions
   */
  const { socket, isConnected } = useSocket(userType, userId, {
    onNewPrescription: handleNewPrescription,
  });

  /**
   * Fetch prescriptions
   */
  const fetchPrescriptions = useCallback(
    async (params: PrescriptionPaginationParams, append: boolean = false) => {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        const result = await getShopOwnerPrescriptions(params);

        if (append) {
          // Append older prescriptions (cursor-based pagination loads older prescriptions)
          setPrescriptions((prev) => {
            const newPrescriptions = result.prescriptions.filter(
              (p) => !prescriptionIdsRef.current.has(p.id)
            );
            // Update IDs set
            newPrescriptions.forEach((p) => prescriptionIdsRef.current.add(p.id));
            return [...prev, ...newPrescriptions];
          });
        } else {
          // Replace prescriptions (initial load or refresh)
          // Update IDs set
          prescriptionIdsRef.current = new Set(result.prescriptions.map((p) => p.id));
          setPrescriptions(result.prescriptions);
        }

        setCursor(result.cursor);
        setHasMore(result.hasMore);
      } catch (err) {
        setError(err as Error);
        if (!append) {
          setPrescriptions([]);
        }
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    []
  );

  /**
   * Load more prescriptions (older prescriptions)
   */
  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore) {
      return;
    }

    await fetchPrescriptions(
      {
        limit,
        cursor,
      },
      true // Append to existing prescriptions
    );
  }, [hasMore, isLoadingMore, cursor, limit, fetchPrescriptions]);

  /**
   * Refetch prescriptions (reload from beginning)
   */
  const refetch = useCallback(async () => {
    setCursor(undefined);
    setHasMore(true);
    await fetchPrescriptions(
      {
        limit,
      },
      false // Replace prescriptions
    );
  }, [limit, fetchPrescriptions]);

  /**
   * Fetch prescriptions on mount and when dependencies change
   * Only fetch if userType is provided (user is authenticated)
   */
  useEffect(() => {
    if (userType) {
      refetch();
    }
  }, [refetch, userType]);

  return {
    prescriptions,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    cursor,
    loadMore,
    refetch,
  };
};

