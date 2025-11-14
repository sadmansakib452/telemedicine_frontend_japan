/**
 * Message Input Component
 * 
 * Input field for sending messages in a conversation.
 * Supports text messages with send button and prescription creation (doctors only).
 */

'use client';

import { useState, FormEvent, KeyboardEvent } from 'react';
import { PaperPlaneIcon } from '@/icons';
import Button from '@/components/ui/button/Button';
import TextArea from '@/components/form/input/TextArea';
import PrescriptionButton from '@/components/prescriptions/PrescriptionButton';
import PrescriptionModal from '@/components/prescriptions/PrescriptionModal';
import PrescriptionForm from '@/components/prescriptions/PrescriptionForm';
import { usePrescription } from '@/hooks/usePrescription';
import type { PrescriptionFormData } from '@/types/prescription.types';
import type { ConversationType, UserType } from '@/config/constants';

type MessageInputProps = {
  onSend: (message: string) => Promise<void>;
  onSendPrescription?: (data: PrescriptionFormData) => Promise<void>;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  // Prescription props (for doctors in patient_doctor conversations)
  conversationType?: ConversationType;
  currentUserType?: UserType;
  patientName?: string;
  receiverId?: string;
  conversationId?: string;
};

export default function MessageInput({
  onSend,
  onSendPrescription,
  isLoading = false,
  disabled = false,
  placeholder = 'Type a message',
  conversationType,
  currentUserType,
  patientName,
  receiverId,
  conversationId,
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const { prescription, isModalOpen: isViewModalOpen, openModal, closeModal } = usePrescription();

  // Check if prescription button should be shown
  // Only for doctors in patient_doctor conversations
  const showPrescriptionButton =
    currentUserType === 'doctor' &&
    conversationType === 'patient_doctor' &&
    onSendPrescription &&
    patientName &&
    receiverId &&
    conversationId;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isSending || isLoading || disabled) {
      return;
    }

    setIsSending(true);
    try {
      await onSend(trimmedMessage);
      setMessage('');
    } catch (error) {
      // Error handling is done by parent component
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter (but allow Shift+Enter for new line)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.closest('form');
      if (form) {
        form.requestSubmit();
      }
    }
  };

  const handlePrescriptionSubmit = async (data: PrescriptionFormData) => {
    if (!onSendPrescription || !receiverId || !conversationId) {
      return;
    }

    setIsSending(true);
    try {
      await onSendPrescription(data);
      setIsPrescriptionModalOpen(false);
    } catch (error) {
      // Error handling is done by parent component
      console.error('Failed to send prescription:', error);
      throw error;
    } finally {
      setIsSending(false);
    }
  };

  const isDisabled = disabled || isLoading || isSending || !message.trim();

  return (
    <>
      <form onSubmit={handleSubmit} className="border-t border-gray-200 px-8 py-6 dark:border-gray-800">
        {/* Prescription Button (doctors only) */}
        {showPrescriptionButton && (
          <div className="mb-3">
            <PrescriptionButton
              onClick={() => setIsPrescriptionModalOpen(true)}
              disabled={disabled || isLoading || isSending}
            />
          </div>
        )}

        <div className="flex items-end gap-3 rounded-full border border-gray-200 bg-white px-4 py-3 shadow-theme-xs focus-within:border-brand-300 focus-within:ring-2 focus-within:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900">
          <TextArea
            placeholder={placeholder}
            value={message}
            onChange={setMessage}
            disabled={disabled || isLoading || isSending}
            rows={1}
            className="max-h-32 resize-none"
            onKeyDown={handleKeyDown}
          />
          <Button
            type="submit"
            disabled={isDisabled}
            size="sm"
            className="h-10 w-10 shrink-0 rounded-full bg-brand-500 p-0 shadow-theme-xs transition hover:bg-brand-600 disabled:opacity-50"
          >
            <PaperPlaneIcon className="h-4 w-4 text-white" />
          </Button>
        </div>
      </form>

      {/* Prescription Form Modal */}
      {showPrescriptionButton && isPrescriptionModalOpen && (
        <PrescriptionModal
          isOpen={isPrescriptionModalOpen}
          onClose={() => setIsPrescriptionModalOpen(false)}
          prescription={null}
          isLoading={false}
          error={null}
        >
          <div className="p-6">
            <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white/90">
              Create Prescription
            </h2>
            <PrescriptionForm
              patientName={patientName || ''}
              onSubmit={handlePrescriptionSubmit}
              isLoading={isSending}
              error={null}
              onCancel={() => setIsPrescriptionModalOpen(false)}
            />
          </div>
        </PrescriptionModal>
      )}

      {/* Prescription View Modal */}
      {isViewModalOpen && (
        <PrescriptionModal
          isOpen={isViewModalOpen}
          onClose={closeModal}
          prescription={prescription}
          isLoading={false}
          error={null}
        />
      )}
    </>
  );
}

