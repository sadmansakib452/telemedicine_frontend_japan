"use client";

import { useRouter } from "next/navigation";
import { usePrescriptions } from "@/hooks/usePrescriptions";
import { useAuth } from "@/hooks/useAuth";
import { PROTECTED_ROUTES } from "@/config/routes";
import type { UserType } from "@/config/constants";
import Button from "@/components/ui/button/Button";
import PrescriptionListItem from "./PrescriptionListItem";

export default function PrescriptionsInboxWorkspace() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();

  // Fetch prescriptions (shop owners only)
  const {
    prescriptions,
    isLoading: isPrescriptionsLoading,
    isLoadingMore,
    error: prescriptionsError,
    hasMore,
    loadMore,
    refetch,
  } = usePrescriptions(
    user?.type as UserType | undefined,
    user?.id,
    20 // limit
  );

  // Show loading state while checking authentication
  if (isAuthLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 transition-colors dark:bg-gray-900">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    router.push("/signin");
    return null;
  }

  // Redirect if not a shop owner (check after user is loaded)
  const isShopOwner = user.type === "shop_keeper" || (user.type as string) === "shop_owner";
  if (!isShopOwner) {
    router.push(PROTECTED_ROUTES.CONVERSATIONS);
    return null;
  }

  // Loading state for prescriptions
  if (isPrescriptionsLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 transition-colors dark:bg-gray-900">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading prescriptions...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (prescriptionsError) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 transition-colors dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-error-500">
            Error: {prescriptionsError.message}
          </p>
          <Button
            onClick={() => refetch()}
            size="sm"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Handle prescription click - navigate to conversation
  const handlePrescriptionClick = (prescription: typeof prescriptions[0]) => {
    if (prescription.conversation_id) {
      router.push(PROTECTED_ROUTES.CONVERSATION_DETAIL(prescription.conversation_id));
    }
  };

  return (
    <div className="flex min-h-screen w-full justify-center bg-gray-50 px-4 py-6 transition-colors dark:bg-gray-900 sm:px-6 lg:px-10 lg:py-8">
      <div className="w-full max-w-[1200px]">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white/90">
            Prescriptions Inbox
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            View all incoming prescriptions from doctors. Click on a prescription to chat with the doctor.
          </p>
        </header>

        {/* Prescriptions List */}
        <div className="space-y-4">
          {prescriptions.map((prescription) => (
            <PrescriptionListItem
              key={prescription.id}
              prescription={prescription}
              onClick={() => handlePrescriptionClick(prescription)}
            />
          ))}

          {/* Empty State */}
          {prescriptions.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 py-12 text-center dark:border-gray-700 dark:bg-gray-800/30">
              <div className="mb-4 rounded-full bg-gray-100 p-4 dark:bg-gray-800">
                <svg
                  className="h-8 w-8 text-gray-400 dark:text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white/90">
                No prescriptions yet
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                New prescriptions from doctors will appear here in real-time.
              </p>
            </div>
          )}

          {/* Load More Button */}
          {hasMore && prescriptions.length > 0 && (
            <div className="flex justify-center pt-4">
              <Button
                onClick={loadMore}
                disabled={isLoadingMore}
                variant="outline"
                size="sm"
              >
                {isLoadingMore ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

