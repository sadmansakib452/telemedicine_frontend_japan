/**
 * Prescription Message Component
 * 
 * Component for displaying prescription messages in the chat.
 * Shows prescription badge, patient name, medicine details preview, and "View Prescription" button.
 */

'use client';

import Badge from '@/components/ui/badge/Badge';
import Button from '@/components/ui/button/Button';
import type { MessageListItem } from '@/types/message.types';

type PrescriptionMessageProps = {
  message: MessageListItem;
  isOwn: boolean;
  onViewPrescription?: (prescriptionId: string) => void;
};

export default function PrescriptionMessage({
  message,
  isOwn,
  onViewPrescription,
}: PrescriptionMessageProps) {
  const { id, medicine_details, patient_name, message: text } = message;

  // Preview of medicine details (first 100 characters)
  const medicinePreview = medicine_details
    ? medicine_details.length > 100
      ? `${medicine_details.substring(0, 100)}...`
      : medicine_details
    : '';

  return (
    <div
      className={`inline-flex flex-col rounded-2xl px-4 py-2.5 text-sm leading-5 shadow-theme-sm ${
        isOwn
          ? 'bg-brand-500 text-white'
          : 'bg-white text-gray-700 dark:bg-gray-900 dark:text-gray-200'
      }`}
    >
      {/* Prescription Badge */}
      <div className="mb-1.5">
        <Badge
          color="primary"
          variant={isOwn ? 'solid' : 'light'}
        >
          📋 Prescription
        </Badge>
      </div>

      {/* Patient Name */}
      <div className="mb-1.5 font-semibold">
        Patient: {patient_name || 'Unknown'}
      </div>

      {/* Medicine Details Preview */}
      {medicine_details && (
        <div className="mb-2 whitespace-pre-wrap text-sm leading-relaxed opacity-90">
          {medicinePreview}
        </div>
      )}

      {/* Optional Message */}
      {text && text !== 'Prescription' && (
        <div className="mb-2 border-t border-white/20 pt-2 text-sm opacity-90">
          {text}
        </div>
      )}

      {/* View Prescription Button */}
      {onViewPrescription && (
        <div className="mt-1.5">
          <Button
            onClick={() => onViewPrescription(id)}
            size="sm"
            className={`${
              isOwn
                ? 'bg-white/20 text-white hover:bg-white/30'
                : 'bg-brand-500 text-white hover:bg-brand-600'
            }`}
          >
            View Prescription
          </Button>
        </div>
      )}
    </div>
  );
}

