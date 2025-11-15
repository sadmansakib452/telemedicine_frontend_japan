/**
 * Admin Prescriptions Hook
 * 
 * React hook for managing admin prescription list.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAllPrescriptions } from '@/services/admin.service';
import type {
  AdminPrescription,
  PrescriptionListParams,
} from '@/types/admin.types';

/**
 * Use Admin Prescriptions Return Type
 */
interface UseAdminPrescriptionsReturn {
  prescriptions: AdminPrescription[];
  isLoading: boolean;
  error: Error | null;
  count: number;
  cursor: string | undefined;
  hasMore: boolean;
  refetch: () => Promise<void>;
  fetchMore: () => Promise<void>;
}

/**
 * Admin Prescriptions Hook
 * 
 * Manages prescription list for admin users.
 * 
 * @param params Prescription list parameters (limit, cursor)
 * @returns Prescription list and operations
 */
export const useAdminPrescriptions = (
  params?: PrescriptionListParams
): UseAdminPrescriptionsReturn => {
  const [prescriptions, setPrescriptions] = useState<AdminPrescription[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [count, setCount] = useState(0);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(false);

  /**
   * Fetch prescriptions
   */
  const fetchPrescriptions = useCallback(async (reset: boolean = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getAllPrescriptions(reset ? params : { ...params, cursor });
      if (reset) {
        setPrescriptions(result.prescriptions);
      } else {
        setPrescriptions((prev) => [...prev, ...result.prescriptions]);
      }
      setCount(result.count);
      setCursor(result.cursor);
      setHasMore(result.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch prescriptions'));
    } finally {
      setIsLoading(false);
    }
  }, [params, cursor]);

  /**
   * Fetch prescriptions on mount
   */
  useEffect(() => {
    fetchPrescriptions(true);
  }, []);

  /**
   * Fetch more prescriptions
   */
  const fetchMore = useCallback(async () => {
    if (hasMore && !isLoading) {
      await fetchPrescriptions(false);
    }
  }, [hasMore, isLoading, fetchPrescriptions]);

  return {
    prescriptions,
    isLoading,
    error,
    count,
    cursor,
    hasMore,
    refetch: () => fetchPrescriptions(true),
    fetchMore,
  };
};

