"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import BroadcastForm from "@/components/broadcast/BroadcastForm";
import { createBroadcast } from "@/services/broadcast.service";
import { PUBLIC_ROUTES, PROTECTED_ROUTES } from "@/config/routes";
import { RouteHelpers } from "@/config/routes";
import { USER_TYPES } from "@/config/constants";
import type { CreateBroadcastRequest } from "@/types/broadcast.types";

const feature_pills = [
  "Chat-first experience",
  "Verified medical network",
  "Prescription distribution",
];

export default function HeroSection() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user is authenticated and is a patient
  const isPatient = user?.type === USER_TYPES.PATIENT;
  const canSendBroadcast = isAuthenticated && isPatient;

  // Handle broadcast form submit
  const handleBroadcastSubmit = async (data: CreateBroadcastRequest) => {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      // Check if user is authenticated
      if (!isAuthenticated || !user) {
        // Redirect to sign-in with redirect parameter
        const redirectUrl = `${PUBLIC_ROUTES.LOGIN}?redirect=${encodeURIComponent('/')}`;
        router.push(redirectUrl);
        return;
      }

      // Check if user is a patient
      if (user.type !== USER_TYPES.PATIENT) {
        setSubmitError('Only patients can send broadcasts. Please sign in as a patient to send a message.');
        setIsSubmitting(false);
        return;
      }

      // Create broadcast using service directly (user is authenticated and is a patient)
      await createBroadcast(data);
      
      // Redirect to conversations page after successful broadcast
      router.push(PROTECTED_ROUTES.CONVERSATIONS);
    } catch (error) {
      // Error handling
      console.error('Failed to create broadcast:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to create broadcast. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Get inbox route based on user type
  const getInboxRoute = () => {
    if (!user) return PROTECTED_ROUTES.CONVERSATIONS;
    return RouteHelpers.getRedirectRoute(user.type);
  };

  return (
    <section
      id="home"
      className="relative overflow-hidden gradient-mesh"
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 via-purple-500/5 to-pink-500/5 dark:from-brand-500/10 dark:via-purple-500/10 dark:to-pink-500/10" />
      
      <div className="relative mx-auto flex max-w-(--breakpoint-2xl) flex-col gap-10 px-4 pb-24 pt-36 sm:px-6 lg:flex-row lg:items-center lg:gap-20 lg:px-8 lg:pb-32">
        <div className="flex flex-1 flex-col gap-6">
          <span className="inline-flex max-w-max items-center gap-2 rounded-full bg-gradient-to-r from-brand-500/10 via-purple-500/10 to-pink-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-600 dark:from-brand-500/20 dark:via-purple-500/20 dark:to-pink-500/20 dark:text-brand-400 border border-brand-500/20 dark:border-brand-500/30">
            Telemedicine, Simplified
          </span>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white md:text-5xl md:leading-[1.1]">
            Connect patients, doctors, and pharmacies in one secure inbox.
          </h1>
          <p className="max-w-xl text-base text-gray-600 dark:text-gray-300 md:text-lg leading-relaxed">
            QuickMed Connect keeps every broadcast, consultation, and
            prescription inside a single conversation loop so care teams can
            respond faster.
          </p>

          {/* Broadcast Form for Patients Only */}
          {canSendBroadcast || !isAuthenticated ? (
            <div className="gradient-card rounded-2xl p-6 shadow-lg">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Send a Broadcast
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {canSendBroadcast
                    ? "Describe your symptoms or medical concerns. Your message will be broadcast to all verified doctors."
                    : "Sign in as a patient to send a broadcast to verified doctors."}
                </p>
              </div>

              {/* Show error if user is not patient */}
              {submitError && (
                <div className="mb-4 rounded-lg border border-red-300 bg-red-50/80 backdrop-blur-sm p-3 text-sm text-red-600 dark:bg-red-900/30 dark:border-red-700 dark:text-red-400">
                  {submitError}
                </div>
              )}

              {/* Broadcast Form */}
              <BroadcastForm
                onSubmit={handleBroadcastSubmit}
                isLoading={isSubmitting}
                error={submitError ? new Error(submitError) : null}
              />

              {/* Show sign-in prompt if not authenticated */}
              {!isAuthenticated && !isAuthLoading && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Need an account?{" "}
                    <Link
                      href={PUBLIC_ROUTES.REGISTER}
                      className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 transition-colors"
                    >
                      Create one now
                    </Link>
                  </p>
                </div>
              )}
            </div>
          ) : null}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {isAuthenticated && !isAuthLoading ? (
              <Link
                href={getInboxRoute()}
                className="gradient-button inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold text-white"
              >
                Go to Inbox
              </Link>
            ) : (
              <>
                <Link
                  href={PUBLIC_ROUTES.LOGIN}
                  className="gradient-button inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold text-white"
                >
                  Sign In
                </Link>
                <Link
                  href={PUBLIC_ROUTES.REGISTER}
                  className="inline-flex items-center justify-center rounded-lg border-2 border-brand-500/30 bg-white/80 backdrop-blur-sm px-6 py-3 text-sm font-semibold text-brand-600 transition-all hover:border-brand-500/50 hover:bg-white dark:bg-gray-800/80 dark:border-brand-500/40 dark:text-brand-400 dark:hover:border-brand-500/60"
                >
                  Create an Account
                </Link>
              </>
            )}
          </div>

          <ul className="grid gap-3 pt-2 text-sm text-gray-700 dark:text-gray-300 sm:grid-cols-3 sm:gap-4">
            {feature_pills.map((pill) => (
              <li
                key={pill}
                className="gradient-pill flex items-center gap-2 rounded-lg px-4 py-3"
              >
                <span className="gradient-dot"></span>
                <span className="font-medium">{pill}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex flex-1 justify-center">
          <div className="gradient-card relative isolate overflow-hidden rounded-3xl shadow-2xl">
            <div className="flex max-w-xl flex-col gap-4 px-6 py-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-purple-500 text-white shadow-lg">
                  DM
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Dr. Mason replied
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Neurology • 5 min ago
                  </p>
                </div>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-gray-50 to-white p-5 text-sm text-gray-700 dark:from-gray-800/50 dark:to-gray-800/30 dark:text-gray-300 border border-gray-200/50 dark:border-gray-700/50">
                <p>
                  &ldquo;Thanks Sarah, reviewing your broadcast now. Please keep
                  your vitals handy, and I&apos;ll send the prescription to your
                  preferred pharmacy.&rdquo;
                </p>
              </div>
              <div className="flex items-center justify-between rounded-2xl border-2 border-dashed border-brand-500/30 bg-gradient-to-r from-brand-50/50 to-purple-50/50 p-4 text-sm text-gray-700 dark:border-brand-500/20 dark:from-brand-500/10 dark:to-purple-500/10 dark:text-gray-300">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Prescription ready
                  </p>
                  <p>Auto-shared with verified retailers.</p>
                </div>
                <span className="rounded-full bg-gradient-to-r from-brand-500 to-purple-500 px-3 py-1 text-xs font-semibold text-white shadow-md">
                  3 recipients
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

