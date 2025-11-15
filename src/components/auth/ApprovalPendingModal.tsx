/**
 * Approval Pending Modal Component
 * 
 * Modal displayed when user tries to login but account is pending admin approval.
 */

"use client";

import { useEffect } from "react";
import Button from "@/components/ui/button/Button";
import { PUBLIC_ROUTES } from "@/config/routes";
import Link from "next/link";

type ApprovalPendingModalProps = {
  isOpen: boolean;
  message: string;
  onClose: () => void;
};

export default function ApprovalPendingModal({
  isOpen,
  message,
  onClose,
}: ApprovalPendingModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xl dark:border-gray-800 dark:bg-gray-900">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          aria-label="Close modal"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-500/20">
            <svg
              className="h-8 w-8 text-yellow-600 dark:text-yellow-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          {/* Title */}
          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white/90">
            Account Pending Approval
          </h2>

          {/* Message */}
          <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
            {message || "Your account is pending admin approval. Please wait for approval before logging in."}
          </p>

          {/* Additional Information */}
          <div className="mb-6 w-full rounded-lg border border-gray-200 bg-gray-50 p-4 text-left dark:border-gray-800 dark:bg-gray-800/50">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>What happens next?</strong>
            </p>
            <ul className="mt-2 space-y-1 text-xs text-gray-600 dark:text-gray-400">
              <li>• Your account is being reviewed by an administrator</li>
              <li>• You will receive an email notification once your account is approved</li>
              <li>• You will be able to log in once your account is approved</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex w-full flex-col gap-3">
            <Button
              onClick={onClose}
              className="w-full"
              size="sm"
            >
              Back to Login
            </Button>
            <Link
              href={PUBLIC_ROUTES.HOME}
              className="text-center text-sm text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

