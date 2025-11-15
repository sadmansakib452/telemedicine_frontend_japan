/**
 * Admin Statistics Hook
 * 
 * React hook for managing admin statistics.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { getStatistics } from '@/services/admin.service';
import type { Statistics } from '@/types/admin.types';

/**
 * Use Admin Statistics Return Type
 */
interface UseAdminStatisticsReturn {
  statistics: Statistics | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Admin Statistics Hook
 * 
 * Manages system statistics for admin users.
 * 
 * @returns Statistics data and operations
 */
export const useAdminStatistics = (): UseAdminStatisticsReturn => {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch statistics
   */
  const fetchStatistics = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getStatistics();
      setStatistics(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch statistics'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Fetch statistics on mount
   */
  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  return {
    statistics,
    isLoading,
    error,
    refetch: fetchStatistics,
  };
};

