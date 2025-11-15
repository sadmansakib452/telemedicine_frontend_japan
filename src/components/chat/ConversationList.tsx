"use client";

import Image from "next/image";
import { MoreDotIcon } from "@/icons";

/**
 * Conversation Display Format
 * Simplified format for conversation list display (without messages)
 */
export type ConversationDisplay = {
  id: string;
  name: string;
  role: string;
  status: string;
  preview: string;
  timeAgo: string;
  avatar: string;
  online?: boolean;
  isUnread?: boolean;
};

type ConversationListProps = {
  conversations: ConversationDisplay[];
  activeConversationId: string;
  onSelectConversation: (conversationId: string) => void;
  isLoading?: boolean;
  error?: Error | null;
};

export default function ConversationList({
  conversations,
  activeConversationId,
  onSelectConversation,
  isLoading = false,
  error = null,
}: ConversationListProps) {
  return (
    <aside className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-xl dark:border-gray-800 dark:bg-gray-900">
      {/* Header - Fixed height */}
      <header className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white/90">
            Chats
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Reach out to your patients and partners.
          </p>
        </div>
        <button className="inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition hover:text-gray-600 dark:hover:text-gray-200">
          <MoreDotIcon className="h-4 w-4" />
        </button>
      </header>

      {/* Search - Fixed height */}
      <label className="flex flex-shrink-0 items-center gap-2 border-b border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-500 focus-within:border-brand-300 focus-within:bg-white dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-400 dark:focus-within:border-brand-500/40">
        <svg
          className="h-4 w-4"
          viewBox="0 0 17 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.16663 12.6666C10.1081 12.6666 12.5 10.2747 12.5 7.33329C12.5 4.39187 10.1081 1.99996 7.16663 1.99996C4.22521 1.99996 1.83329 4.39187 1.83329 7.33329C1.83329 10.2747 4.22521 12.6666 7.16663 12.6666Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14.5 14.6666L11.1666 11.3333"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <input
          type="search"
          placeholder="Search..."
          className="flex-1 bg-transparent text-sm text-gray-600 outline-none dark:text-gray-200"
          disabled={isLoading}
        />
      </label>

      {/* Content Area - Flexible, scrollable */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {/* Loading State */}
        {isLoading && conversations.length === 0 && (
          <div className="flex flex-1 items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Loading conversations...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && conversations.length === 0 && (
          <div className="flex flex-1 items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="text-xs text-red-500 dark:text-red-400">
                {error.message}
              </p>
            </div>
          </div>
        )}

        {/* Conversations List */}
        {!isLoading && !error && (
          <>
            {conversations.length === 0 ? (
              // Empty State
              <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
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
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white/90">
                  No conversations yet
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Start a conversation to get started!
                </p>
              </div>
            ) : (
              // Conversations List - Scrollable
              <ul className="flex-1 space-y-2 overflow-y-auto px-3 py-3 pr-1 sm:px-4 sm:py-3 custom-scrollbar">
                {conversations.map((conversation) => {
                  const isActive = conversation.id === activeConversationId;
                  return (
                    <li key={conversation.id}>
                      <button
                        type="button"
                        onClick={() => onSelectConversation(conversation.id)}
                        className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition ${
                          isActive
                            ? "border-brand-200 bg-brand-50 shadow-theme-xs dark:border-brand-500/40 dark:bg-brand-500/15"
                            : "border-transparent bg-gray-50 hover:border-brand-200 hover:bg-brand-50/40 dark:bg-gray-900/40 dark:hover:border-brand-500/30 dark:hover:bg-white/5"
                        }`}
                      >
                        <span className="relative inline-flex h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
                          <Image
                            src={conversation.avatar}
                            alt={conversation.name}
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                          />
                          {conversation.online ? (
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-success-500 dark:border-gray-900"></span>
                          ) : null}
                        </span>

                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm ${
                              conversation.isUnread 
                                ? "font-bold text-gray-900 dark:text-white" 
                                : "font-semibold text-gray-900 dark:text-white/90"
                            }`}>
                              {conversation.name}
                            </p>
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                              {conversation.timeAgo}
                            </span>
                          </div>
                          <p className="text-xs text-brand-500 dark:text-brand-300">
                            {conversation.role}
                          </p>
                          <p className={`mt-1 line-clamp-1 text-sm ${
                            conversation.isUnread 
                              ? "font-semibold text-gray-900 dark:text-white" 
                              : "text-gray-500 dark:text-gray-300"
                          }`}>
                            {conversation.preview}
                          </p>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        )}
      </div>

      {/* Footer - Fixed height */}
      <div className="flex flex-shrink-0 items-center justify-between border-t border-gray-200 p-3 dark:border-gray-800 lg:flex">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          N
        </span>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          You are online
        </span>
      </div>
    </aside>
  );
}

