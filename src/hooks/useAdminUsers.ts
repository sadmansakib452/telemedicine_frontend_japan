/**
 * Admin Users Hook
 * 
 * React hook for managing admin user list.
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getAllUsers,
  getPendingVerifications,
  approveUser,
  rejectUser,
} from '@/services/admin.service';
import type {
  AdminUser,
  UserListParams,
  PendingVerification,
} from '@/types/admin.types';

/**
 * Use Admin Users Return Type
 */
interface UseAdminUsersReturn {
  users: AdminUser[];
  pendingVerifications: PendingVerification[];
  isLoading: boolean;
  isLoadingPending: boolean;
  error: Error | null;
  count: number;
  cursor: string | undefined;
  hasMore: boolean;
  refetch: () => Promise<void>;
  refetchPending: () => Promise<void>;
  fetchMore: () => Promise<void>;
  approve: (id: string) => Promise<void>;
  reject: (id: string) => Promise<void>;
}

/**
 * Admin Users Hook
 * 
 * Manages user list for admin users.
 * 
 * @param params User list parameters (q, type, approved, limit, cursor)
 * @returns User list and operations
 */
export const useAdminUsers = (
  params?: UserListParams
): UseAdminUsersReturn => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [pendingVerifications, setPendingVerifications] = useState<PendingVerification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPending, setIsLoadingPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [count, setCount] = useState(0);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(false);

  // Store params and cursor in refs to avoid dependency issues
  const paramsRef = useRef(params);
  const cursorRef = useRef(cursor);
  paramsRef.current = params;
  cursorRef.current = cursor;

  /**
   * Fetch users
   */
  const fetchUsers = useCallback(async (reset: boolean = false) => {
    setIsLoading(true);
    setError(null);

    try {
      // Use current params and cursor from refs
      const currentParams = paramsRef.current || {};
      const currentCursor = reset ? undefined : cursorRef.current;
      const result = await getAllUsers({ ...currentParams, cursor: currentCursor });
      if (reset) {
        setUsers(result.users);
        setCursor(result.cursor);
        cursorRef.current = result.cursor;
      } else {
        setUsers((prev) => [...prev, ...result.users]);
        setCursor(result.cursor);
        cursorRef.current = result.cursor;
      }
      setCount(result.count);
      setHasMore(result.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch users'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Fetch pending verifications
   */
  const fetchPendingVerifications = useCallback(async () => {
    setIsLoadingPending(true);
    setError(null);

    try {
      const data = await getPendingVerifications();
      setPendingVerifications(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch pending verifications'));
    } finally {
      setIsLoadingPending(false);
    }
  }, []);

  /**
   * Approve user
   */
  const handleApprove = useCallback(async (id: string) => {
    try {
      await approveUser(id);
      // Remove from pending verifications
      setPendingVerifications((prev) => prev.filter((user) => user.id !== id));
      // Refresh users list
      await fetchUsers(true);
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to approve user');
    }
  }, [fetchUsers]);

  /**
   * Reject user
   */
  const handleReject = useCallback(async (id: string) => {
    try {
      await rejectUser(id);
      // Remove from pending verifications
      setPendingVerifications((prev) => prev.filter((user) => user.id !== id));
      // Refresh users list
      await fetchUsers(true);
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to reject user');
    }
  }, [fetchUsers]);

  /**
   * Fetch users on mount and when params change
   */
  useEffect(() => {
    // Reset cursor when params change
    cursorRef.current = undefined;
    setCursor(undefined);
    // Fetch with reset
    fetchUsers(true);
  }, [params?.q, params?.type, params?.approved, params?.limit, fetchUsers]);

  /**
   * Fetch pending verifications on mount
   */
  useEffect(() => {
    fetchPendingVerifications();
  }, [fetchPendingVerifications]);

  /**
   * Fetch more users
   */
  const fetchMore = useCallback(async () => {
    if (hasMore && !isLoading) {
      await fetchUsers(false);
    }
  }, [hasMore, isLoading, fetchUsers]);

  return {
    users,
    pendingVerifications,
    isLoading,
    isLoadingPending,
    error,
    count,
    cursor,
    hasMore,
    refetch: () => fetchUsers(true),
    refetchPending: fetchPendingVerifications,
    fetchMore,
    approve: handleApprove,
    reject: handleReject,
  };
};

