/**
 * Message Input Component
 * 
 * Input field for sending messages in a conversation.
 * Supports text messages with send button and prescription creation (doctors only).
 */

'use client';

import { useState, FormEvent, KeyboardEvent, useRef, useEffect } from 'react';
import { PaperPlaneIcon, PlusIcon } from '@/icons';
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { prescription, isModalOpen: isViewModalOpen, openModal, closeModal } = usePrescription(currentUserType);

  // Check if prescription button should be shown
  // Show for all doctors when they have an active conversation
  // For doctors, patientName should always be available (with fallback to "Patient")
  // Note: If patientName is not provided, we'll use "Patient" as a fallback
  const finalPatientName = patientName || (currentUserType === 'doctor' ? 'Patient' : undefined);
  
  // Show prescription button for doctors with active conversation
  const showPrescriptionButton =
    currentUserType === 'doctor' &&
    !!onSendPrescription &&
    !!receiverId &&
    !!conversationId &&
    !!finalPatientName;

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 112; // max-h-28 = 7rem = 112px
      textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  }, [message]);

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
      // Reset textarea height after sending
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
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

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
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
      <form onSubmit={handleSubmit} className="w-full px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-end gap-2 rounded-full border border-gray-200/50 bg-transparent px-3 py-2 transition-colors focus-within:border-brand-300 focus-within:ring-1 focus-within:ring-brand-500/10 dark:border-gray-700/50 dark:bg-transparent dark:focus-within:border-brand-500/50">
          {/* Textarea - Custom implementation for transparent styling */}
          <textarea
            ref={textareaRef}
            placeholder={placeholder}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={disabled || isLoading || isSending}
            rows={1}
            className="flex-1 resize-none border-0 bg-transparent px-2 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 dark:text-gray-100 dark:placeholder:text-gray-500"
            style={{ maxHeight: '112px', overflowY: 'auto' }}
          />
          
          {/* Prescription Button (doctors only) - Small + icon next to send */}
          {showPrescriptionButton && (
            <button
              type="button"
              onClick={() => setIsPrescriptionModalOpen(true)}
              disabled={disabled || isLoading || isSending}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              aria-label="Add prescription"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          )}
          
          {/* Send Button */}
          <button
            type="submit"
            disabled={isDisabled}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-500 p-0 transition hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-brand-500"
            aria-label="Send message"
          >
            <PaperPlaneIcon className="h-4 w-4 text-white" />
          </button>
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
              patientName={finalPatientName || 'Patient'}
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

