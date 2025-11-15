/**
 * Prescription Modal Component
 * 
 * Modal for viewing prescription details.
 * Displays medicine details, patient name, and doctor information.
 */

'use client';

import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { Modal } from '@/components/ui/modal';
import Button from '@/components/ui/button/Button';
import Badge from '@/components/ui/badge/Badge';
import type { Prescription } from '@/types/prescription.types';

type PrescriptionModalProps = {
  prescription: Prescription | null;
  isLoading?: boolean;
  error?: Error | null;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode; // For prescription form
};

export default function PrescriptionModal({
  prescription,
  isLoading = false,
  error = null,
  isOpen,
  onClose,
  children,
}: PrescriptionModalProps) {
  if (!isOpen) {
    return null;
  }

  // If children provided, show form modal
  if (children) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl">
        {children}
      </Modal>
    );
  }

  if (isLoading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl">
        <div className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Loading prescription...</p>
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  if (error || !prescription) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl">
        <div className="p-6">
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-sm text-red-600 dark:text-red-400">
              {error?.message || 'Failed to load prescription'}
            </p>
            <Button onClick={onClose} size="sm" className="mt-4">
              Close
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  const { medicine_details, patient_name, message, sender, created_at } = prescription;
  const timeAgo = formatDistanceToNow(new Date(created_at), { addSuffix: true });

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white/90">
                Prescription
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{timeAgo}</p>
            </div>
          </div>
          <Badge color="primary" variant="light">
            📋 Prescription
          </Badge>
        </div>

        {/* Patient Information */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/30">
          <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Patient Information
          </h3>
          <p className="text-base font-semibold text-gray-900 dark:text-white/90">
            {patient_name}
          </p>
        </div>

        {/* Medicine Details */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
            Medicine Details
          </h3>
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-900 dark:text-white/90">
            {medicine_details}
          </div>
        </div>

        {/* Optional Message */}
        {message && message !== 'Prescription' && (
          <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/30">
            <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Doctor&apos;s Note
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">{message}</p>
          </div>
        )}

        {/* Doctor Information */}
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/30">
          <div className="relative inline-flex h-10 w-10 overflow-hidden rounded-full">
            <Image
              src={sender.avatar_url || sender.avatar || '/images/user/user-01.jpg'}
              alt={sender.name}
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white/90">
              Dr. {sender.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{sender.email}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end">
          <Button onClick={onClose} size="sm">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}

