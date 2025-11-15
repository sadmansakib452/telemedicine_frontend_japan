"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { getUserTypeLabel } from "@/utils/user.utils";
import { PROTECTED_ROUTES } from "@/config/routes";
import type { AdminConversation } from "@/types/admin.types";
import { ChatIcon } from "@/icons/index";

interface ConversationListProps {
  conversations: AdminConversation[];
  isLoading?: boolean;
  count?: number;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  isLoading = false,
  count,
}) => {
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Unknown";
    }
  };

  const getPreviewText = (conversation: AdminConversation) => {
    if (!conversation.last_message) {
      return "No messages yet";
    }

    const lastMessage = conversation.last_message;
    if (lastMessage.message_type === "prescription") {
      return "Prescription";
    }

    if (!lastMessage.message || lastMessage.message.trim() === "") {
      return "No messages yet";
    }

    return lastMessage.message.length > 50
      ? `${lastMessage.message.substring(0, 50)}...`
      : lastMessage.message;
  };

  if (isLoading && conversations.length === 0) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <ChatIcon className="h-6 w-6 text-gray-400" />
        </div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          No conversations found
        </p>
        {count !== undefined && count > 0 && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
            Showing {conversations.length} of {count} conversations
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {conversations.map((conversation) => {
        const creator = conversation.creator;
        const participant = conversation.participant;
        const previewText = getPreviewText(conversation);

        return (
          <Link
            key={conversation.id}
            href={PROTECTED_ROUTES.CONVERSATION_DETAIL(conversation.id)}
            className="block rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-brand-300 hover:shadow-theme-xs dark:border-gray-800 dark:bg-gray-900 dark:hover:border-brand-500/40"
          >
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
                <Image
                  src={
                    creator.avatar_url ||
                    creator.avatar ||
                    "/images/user/owner.jpg"
                  }
                  alt={creator.name}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Conversation Info */}
              <div className="flex flex-1 items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                      {creator.name} & {participant.name}
                    </h4>
                    <span className="flex-shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                      {getUserTypeLabel(creator.type)} - {getUserTypeLabel(participant.type)}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <span className="truncate">{previewText}</span>
                    <span className="text-gray-400 dark:text-gray-600">•</span>
                    <span>{formatDate(conversation.updated_at)}</span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex-shrink-0">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      conversation.status === "open"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {conversation.status}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ConversationList;

