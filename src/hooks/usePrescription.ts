/**
 * Prescription Hook
 * 
 * React hook for managing prescription modal state and operations.
 * Used for viewing prescriptions and managing prescription modal.
 * 
 * Now uses unified endpoint GET /api/chat/message/:id for all user types.
 */

'use client';

import { useState, useCallback } from 'react';
import { getMessageById } from '@/services/message.service';
import { getShopOwnerPrescriptionById } from '@/services/api/shop-owner.service';
import type { Prescription } from '@/types/prescription.types';
import type { Message } from '@/types/message.types';
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
 * Convert Message to Prescription
 * 
 * Converts a Message object to Prescription format.
 * Validates that the message is a prescription type.
 * 
 * @param message Message object from API
 * @returns Prescription object
 */
const convertMessageToPrescription = (message: Message): Prescription => {
  // Validate that message is a prescription
  if (message.message_type !== 'prescription') {
    throw new Error('Message is not a prescription');
  }

  // Validate required prescription fields
  if (!message.medicine_details || !message.patient_name) {
    throw new Error('Invalid prescription: missing medicine_details or patient_name');
  }

  // Convert Message to Prescription
  return {
    ...message,
    message_type: 'prescription' as const,
    medicine_details: message.medicine_details,
    patient_name: message.patient_name,
  };
};

/**
 * Prescription Hook
 * 
 * Manages prescription modal state and operations.
 * Uses unified endpoint GET /api/chat/message/:id for all user types.
 * Falls back to shop owner endpoint for backward compatibility (optional).
 * 
 * @param userType - Optional user type (kept for backward compatibility, but not used anymore)
 * @returns Prescription modal state and operations
 */
export const usePrescription = (userType?: UserType | string): UsePrescriptionReturn => {
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Open prescription modal and fetch prescription details
   * Uses unified endpoint GET /api/chat/message/:id for all user types.
   * Falls back to shop owner endpoint if unified endpoint fails (backward compatibility).
   */
  const openModal = useCallback(async (prescriptionId: string) => {
    setIsLoading(true);
    setError(null);
    setIsModalOpen(true);

    try {
      // Try unified endpoint first (works for all user types)
      try {
        const message = await getMessageById(prescriptionId);
        const prescriptionData = convertMessageToPrescription(message);
        setPrescription(prescriptionData);
      } catch (unifiedError) {
        // Fallback to shop owner endpoint for backward compatibility
        // This is only needed if the unified endpoint fails for shop owners
        // In most cases, this should not be needed, but kept for safety
        const isShopOwner = userType === 'shop_keeper' || (userType as string) === 'shop_owner';
        
        if (isShopOwner) {
          try {
            // Use shop owner specific endpoint as fallback
            const shopOwnerPrescription = await getShopOwnerPrescriptionById(prescriptionId);
            // Convert PrescriptionListItem to Prescription format
            const prescriptionData: Prescription = {
              id: shopOwnerPrescription.id,
              message: shopOwnerPrescription.message,
              message_type: 'prescription' as const,
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
            setPrescription(prescriptionData);
          } catch (shopOwnerError) {
            // If both endpoints fail, throw the original error
            throw unifiedError;
          }
        } else {
          // If not a shop owner, throw the original error
          throw unifiedError;
        }
      }
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

