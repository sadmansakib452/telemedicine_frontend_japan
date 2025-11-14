/**
 * Prescription Hook
 * 
 * React hook for managing prescription modal state and operations.
 * Used for viewing prescriptions and managing prescription modal.
 */

'use client';

import { useState, useCallback } from 'react';
import { getPrescriptionById } from '@/services/api/prescription.service';
import { getShopOwnerPrescriptionById } from '@/services/api/shop-owner.service';
import type { Prescription } from '@/types/prescription.types';
import type { UserType } from '@/config/constants';

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
 * Automatically uses the correct API endpoint based on user type.
 * 
 * @param userType - Optional user type to determine which API endpoint to use
 * @returns Prescription modal state and operations
 */
export const usePrescription = (userType?: UserType | string): UsePrescriptionReturn => {
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Open prescription modal and fetch prescription details
   * Uses shop owner endpoint if user is a shop owner, otherwise uses generic endpoint
   */
  const openModal = useCallback(async (prescriptionId: string) => {
    setIsLoading(true);
    setError(null);
    setIsModalOpen(true);

    try {
      // Check if user is a shop owner
      const isShopOwner = userType === 'shop_keeper' || (userType as string) === 'shop_owner';
      
      let data: Prescription;
      if (isShopOwner) {
        // Use shop owner specific endpoint
        const shopOwnerPrescription = await getShopOwnerPrescriptionById(prescriptionId);
        // Convert PrescriptionListItem to Prescription format
        // Prescription extends Message, so we need all Message fields
        data = {
          id: shopOwnerPrescription.id,
          message: shopOwnerPrescription.message,
          message_type: shopOwnerPrescription.message_type,
          medicine_details: shopOwnerPrescription.medicine_details,
          patient_name: shopOwnerPrescription.patient_name,
          sender_id: shopOwnerPrescription.sender_id,
          receiver_id: shopOwnerPrescription.receiver_id,
          conversation_id: shopOwnerPrescription.conversation_id,
          status: shopOwnerPrescription.status as any, // MessageStatus type
          attachment: null,
          attachment_url: null,
          created_at: shopOwnerPrescription.created_at,
          updated_at: shopOwnerPrescription.updated_at || shopOwnerPrescription.created_at,
          sender: shopOwnerPrescription.sender,
          receiver: shopOwnerPrescription.receiver || shopOwnerPrescription.sender, // Fallback to sender if receiver not available
        };
      } else {
        // Use generic prescription endpoint for doctors/patients
        data = await getPrescriptionById(prescriptionId);
      }
      
      setPrescription(data);
    } catch (err) {
      setError(err as Error);
      setPrescription(null);
    } finally {
      setIsLoading(false);
    }
  }, [userType]);

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

