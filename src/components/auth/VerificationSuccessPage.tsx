/**
 * Verification Success Page Component
 * 
 * Displays success message after email verification.
 * Shows different messages for patients (auto-approved) vs doctors/shop owners (pending approval).
 */

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";
import { PUBLIC_ROUTES } from "@/config/routes";
import Link from "next/link";
import { ChevronLeftIcon } from "@/icons";

export default function VerificationSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const status = searchParams.get('status'); // 'approved' or 'pending'
  const verification = searchParams.get('verification'); // 'success'

  // Only show if verification=success query param is present
  if (verification !== 'success') {
    return null;
  }

  const isPending = status === 'pending';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900">
      <div className="w-full max-w-md">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href={PUBLIC_ROUTES.HOME}
            className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ChevronLeftIcon />
            Back to Home
          </Link>
        </div>

        {/* Success Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-theme-xl dark:border-gray-800 dark:bg-gray-900">
          <div className="flex flex-col items-center text-center">
            {/* Success Icon */}
            <div className={`mb-6 flex h-20 w-20 items-center justify-center rounded-full ${
              isPending 
                ? 'bg-yellow-100 dark:bg-yellow-500/20' 
                : 'bg-success-100 dark:bg-success-500/20'
            }`}>
              {isPending ? (
                <svg
                  className="h-10 w-10 text-yellow-600 dark:text-yellow-400"
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
              ) : (
                <svg
                  className="h-10 w-10 text-success-600 dark:text-success-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </div>

            {/* Title */}
            <h1 className="mb-3 text-2xl font-semibold text-gray-900 dark:text-white/90">
              Email Verified Successfully
            </h1>

            {/* Message */}
            {isPending ? (
              <div className="mb-6 space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your email has been verified. However, your account is pending admin approval.
                </p>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-left dark:border-gray-800 dark:bg-gray-800/50">
                  <p className="mb-2 text-sm font-medium text-gray-900 dark:text-white/90">
                    What happens next?
                  </p>
                  <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                    <li>• Your account is being reviewed by an administrator</li>
                    <li>• You will receive an email notification once your account is approved</li>
                    <li>• You will be able to log in once your account is approved</li>
                  </ul>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Please wait for admin approval before logging in.
                </p>
              </div>
            ) : (
              <div className="mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your account has been verified and approved. You can now log in to access your inbox.
                </p>
              </div>
            )}

            {/* Action Button */}
            <div className="w-full">
              <Button
                onClick={() => router.push(PUBLIC_ROUTES.LOGIN)}
                className="w-full"
                size="sm"
              >
                {isPending ? 'Go to Login (Pending Approval)' : 'Go to Login'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

