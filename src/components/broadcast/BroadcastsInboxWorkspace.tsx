"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useBroadcasts } from "@/hooks/useBroadcasts";
import { useConversations } from "@/hooks/useConversations";
import { useAuth } from "@/hooks/useAuth";
import { PROTECTED_ROUTES } from "@/config/routes";
import type { BroadcastListItem } from "@/types/broadcast.types";
import type { UserType } from "@/config/constants";
import Button from "@/components/ui/button/Button";

export default function BroadcastsInboxWorkspace() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [respondingBroadcastId, setRespondingBroadcastId] = useState<string | null>(null);

  // Fetch broadcasts inbox (doctors only)
  const {
    broadcasts,
    isLoading: isBroadcastsLoading,
    error: broadcastsError,
  } = useBroadcasts(user?.type as UserType | undefined, user?.id, "inbox");

  // Use conversations hook for responding to broadcasts
  const { respondToBroadcast } = useConversations(user?.type as UserType | undefined, user?.id);

  // Handle responding to a broadcast
  const handleRespondToBroadcast = async (broadcast: BroadcastListItem) => {
    if (!user || user.type !== "doctor") {
      return;
    }

    setRespondingBroadcastId(broadcast.id);

    try {
      // Respond to broadcast (creates a conversation)
      const conversation = await respondToBroadcast(broadcast.id, {
        broadcast_id: broadcast.id,
        participant_id: broadcast.patient.id,
      });

      // Redirect to the new conversation
      router.push(PROTECTED_ROUTES.CONVERSATION_DETAIL(conversation.id));
    } catch (error) {
      console.error("Failed to respond to broadcast:", error);
      // Error will be shown by the component
    } finally {
      setRespondingBroadcastId(null);
    }
  };

  // Show loading state while checking authentication
  // Don't redirect until we're sure about the user's status
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

  // Redirect if not a doctor (check after user is loaded)
  if (user.type !== "doctor") {
    router.push(PROTECTED_ROUTES.CONVERSATIONS);
    return null;
  }

  // Loading state for broadcasts
  if (isBroadcastsLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 transition-colors dark:bg-gray-900">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading broadcasts...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (broadcastsError) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 transition-colors dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-error-500">
            Error: {broadcastsError.message}
          </p>
          <Button
            onClick={() => window.location.reload()}
            size="sm"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full justify-center bg-gray-50 px-4 py-6 transition-colors dark:bg-gray-900 sm:px-6 lg:px-10 lg:py-8">
      <div className="w-full max-w-[1200px]">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white/90">
            Broadcast Inbox
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Respond to patient broadcasts and start conversations.
          </p>
        </header>

        {/* Broadcast List */}
        <div className="space-y-4">
          {broadcasts.map((broadcast) => (
            <div
              key={broadcast.id}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm transition hover:border-brand-200 hover:shadow-theme-md dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-start gap-4">
                {/* Patient Avatar */}
                <div className="relative inline-flex h-12 w-12 overflow-hidden rounded-full">
                  <Image
                    src={
                      broadcast.patient.avatar_url ||
                      broadcast.patient.avatar ||
                      "/images/user/user-01.jpg"
                    }
                    alt={broadcast.patient.name}
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Broadcast Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white/90">
                        {broadcast.patient.name}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {new Date(broadcast.created_at).toLocaleDateString()} •{" "}
                        {new Date(broadcast.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Broadcast Message */}
                  {broadcast.message && (
                    <p className="mt-3 text-sm leading-6 text-gray-700 dark:text-gray-300">
                      {broadcast.message}
                    </p>
                  )}

                  {/* Respond Button */}
                  {broadcast.status === "open" && (
                    <div className="mt-4">
                      <Button
                        onClick={() => handleRespondToBroadcast(broadcast)}
                        disabled={respondingBroadcastId === broadcast.id}
                        size="sm"
                      >
                        {respondingBroadcastId === broadcast.id
                          ? "Responding..."
                          : "Respond to Broadcast"}
                      </Button>
                    </div>
                  )}

                  {/* Assisted Status */}
                  {broadcast.status === "assisted" && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        This broadcast has been assisted by another doctor.
                      </p>
                      {broadcast.conversation_id && (
                        <Button
                          onClick={() =>
                            router.push(
                              PROTECTED_ROUTES.CONVERSATION_DETAIL(
                                broadcast.conversation_id!
                              )
                            )
                          }
                          variant="outline"
                          size="sm"
                          className="mt-2"
                        >
                          View Conversation
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {broadcasts.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 py-12 text-center dark:border-gray-700 dark:bg-gray-800/30">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                No open broadcasts found. New broadcasts from patients will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

