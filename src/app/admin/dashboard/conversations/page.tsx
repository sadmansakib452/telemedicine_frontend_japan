"use client";

import React from "react";
import { useAdminConversations } from "@/hooks/useAdminConversations";
import ConversationList from "@/components/admin/ConversationList";

export default function AdminConversationsPage() {
  const {
    conversations,
    isLoading,
    error,
    count,
    refetch,
    fetchMore,
    hasMore,
  } = useAdminConversations({ limit: 20 });

  if (error) {
    return (
      <div className="flex h-full flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            All Conversations
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            View all system conversations
          </p>
        </div>

        <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-red-300 bg-red-50 p-6 dark:border-red-700 dark:bg-red-900/30">
          <div className="text-center">
            <p className="text-sm font-medium text-red-600 dark:text-red-400">
              Error loading conversations: {error.message}
            </p>
            <button
              onClick={() => refetch()}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          All Conversations
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          View all system conversations ({count} total)
        </p>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        <ConversationList
          conversations={conversations}
          isLoading={isLoading}
          count={count}
        />
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={() => fetchMore()}
            disabled={isLoading}
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}

