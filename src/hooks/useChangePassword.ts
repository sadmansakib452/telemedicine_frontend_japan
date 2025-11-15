/**
 * useChangePassword Hook
 * 
 * React hook for changing user password.
 * Handles loading states, error handling, validation, and API calls.
 */

import { useState } from 'react';
import { changePassword } from '@/services/api/auth.service';

export interface UseChangePasswordReturn {
  changeUserPassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

/**
 * Hook for changing user password
 */
export const useChangePassword = (): UseChangePasswordReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => {
    setError(null);
  };

  const changeUserPassword = async (oldPassword: string, newPassword: string) => {
    try {
      setLoading(true);
      setError(null);

      // Validate password length
      if (newPassword.length < 8) {
        throw new Error('New password must be at least 8 characters');
      }

      const result = await changePassword(oldPassword, newPassword);

      if (result.success) {
        return result;
      } else {
        throw new Error(result.message || 'Failed to change password');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to change password';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    changeUserPassword,
    loading,
    error,
    clearError,
  };
};

