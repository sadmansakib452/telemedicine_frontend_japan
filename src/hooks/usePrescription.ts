/**
 * Prescription Hook
 * 
 * React hook for managing prescription modal state and operations.
 * Used for viewing prescriptions and managing prescription modal.
 */

'use client';

import { useState, useCallback } from 'react';
import { getPrescriptionById } from '@/services/api/prescription.service';
import type { Prescription } from '@/types/prescription.types';

/**
 * Use Prescription Return Type
 */
interface UsePrescriptionReturn {
  prescription: Prescription | null;
  isModalOpen: boolean;
  isLoading: boolean;
  error: Error | null;
  openModal: (prescriptionId: string) => Promise<void>;
  closeModal: () => void;
}

/**
 * Prescription Hook
 * 
 * Manages prescription modal state and operations.
 * 
 * @returns Prescription modal state and operations
 */
export const usePrescription = (): UsePrescriptionReturn => {
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Open prescription modal and fetch prescription details
   */
  const openModal = useCallback(async (prescriptionId: string) => {
    setIsLoading(true);
    setError(null);
    setIsModalOpen(true);

    try {
      const data = await getPrescriptionById(prescriptionId);
      setPrescription(data);
    } catch (err) {
      setError(err as Error);
      setPrescription(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Close prescription modal
   */
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setPrescription(null);
    setError(null);
  }, []);

  return {
    prescription,
    isModalOpen,
    isLoading,
    error,
    openModal,
    closeModal,
  };
};

