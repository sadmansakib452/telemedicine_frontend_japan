/**
 * useUpdateProfile Hook
 * 
 * React hook for updating user profile information.
 * Handles loading states, error handling, and API calls.
 */

import { useState } from 'react';
import { updateUserProfile } from '@/services/api/auth.service';

export interface UpdateProfileData {
  name?: string;
  first_name?: string;
  last_name?: string;
}

export interface UseUpdateProfileReturn {
  updateProfile: (data: UpdateProfileData) => Promise<{ success: boolean; message: string }>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

/**
 * Hook for updating user profile
 */
export const useUpdateProfile = (): UseUpdateProfileReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => {
    setError(null);
  };

  const updateProfile = async (data: UpdateProfileData) => {
    try {
      setLoading(true);
      setError(null);

      const result = await updateUserProfile(data);

      if (result.success) {
        return result;
      } else {
        throw new Error(result.message || 'Failed to update profile');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateProfile,
    loading,
    error,
    clearError,
  };
};

