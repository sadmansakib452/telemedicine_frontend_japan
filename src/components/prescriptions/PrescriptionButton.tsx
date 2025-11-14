/**
 * Prescription Button Component
 * 
 * Button for opening prescription modal.
 * Only visible for doctors in patient_doctor conversations.
 */

'use client';

import Button from '@/components/ui/button/Button';

type PrescriptionButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

export default function PrescriptionButton({
  onClick,
  disabled = false,
}: PrescriptionButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      size="sm"
      className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-700 shadow-theme-xs transition hover:bg-green-100 dark:bg-green-500/10 dark:text-green-400 disabled:opacity-50"
    >
      <svg
        className="h-4 w-4"
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
      <span>Prescription</span>
    </Button>
  );
}

