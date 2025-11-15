"use client";

import Image from "next/image";
import MessageList from "@/components/message/MessageList";
import MessageInput from "@/components/message/MessageInput";
import type { Conversation } from "@/types/conversation.types";
import type { MessageListItem } from "@/types/message.types";
import type { User } from "@/types/user.types";
import type { ConversationType } from "@/config/constants";
import type { PrescriptionFormData } from "@/types/prescription.types";

/**
 * Display format for conversation (from InboxWorkspace)
 */
type ConversationDisplay = {
  id: string;
  name: string;
  role: string;
  status: string;
  preview: string;
  timeAgo: string;
  avatar: string;
  online?: boolean;
};

type ChatWindowProps = {
  conversation: ConversationDisplay;
  conversationData: Conversation;
  currentUser: User;
  messages: MessageListItem[];
  isLoading?: boolean;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  onBack: () => void;
  onSendMessage: (message: string) => Promise<void>;
  onSendPrescription?: (data: PrescriptionFormData) => Promise<void>;
  onLoadMoreMessages?: () => void;
  onViewPrescription?: (prescriptionId: string) => void;
};

export default function ChatWindow({
  conversation,
  conversationData,
  currentUser,
  messages,
  isLoading = false,
  isLoadingMore = false,
  hasMore = false,
  onBack,
  onSendMessage,
  onSendPrescription,
  onLoadMoreMessages,
  onViewPrescription,
}: ChatWindowProps) {
  const { name, role, status, avatar, online } = conversation;

  // Get receiver ID and other person info
  const receiverId =
    conversationData.creator_id === currentUser.id
      ? conversationData.participant_id
      : conversationData.creator_id;

  const otherPerson =
    conversationData.creator_id === currentUser.id
      ? conversationData.participant
      : conversationData.creator;

  // Get patient/receiver name for prescription (doctors can create prescriptions)
  // For doctors, the other person in the conversation is the patient/receiver
  // Always provide a fallback name for doctors - this should NEVER be undefined for doctors
  let patientName: string | undefined;
  if (currentUser.type === "doctor") {
    const nameFromOtherPerson = otherPerson?.name?.trim();
    const nameFromConversation = conversation?.name?.trim();
    patientName = nameFromOtherPerson || nameFromConversation || "Patient";
  }

  return (
    <section className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-xl dark:border-gray-800 dark:bg-gray-900">
      {/* Header - Fixed height */}
      <header className="flex flex-shrink-0 items-center gap-3 border-b border-gray-200 px-4 py-3 dark:border-gray-800 sm:px-6 sm:py-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-brand-200 hover:text-brand-500 dark:border-gray-800 dark:text-gray-400 dark:hover:border-brand-500/30 dark:hover:text-brand-300 lg:hidden"
          aria-label="Back to conversation list"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.25 3.75L6.75 8.25L11.25 12.75"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <span className="relative inline-flex h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
          <Image
            src={avatar}
            alt={name}
            width={40}
            height={40}
            className="h-full w-full object-cover"
          />
          {online && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-success-500 dark:border-gray-900" />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white/90 truncate">
            {name}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {role} • {status}
          </p>
        </div>
      </header>

      {/* Messages List - Flexible, scrollable */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <MessageList
          messages={messages}
          currentUserId={currentUser.id}
          isLoading={isLoading}
          isLoadingMore={isLoadingMore}
          hasMore={hasMore}
          onLoadMore={onLoadMoreMessages}
          onViewPrescription={onViewPrescription}
        />
      </div>

      {/* Message Input - Fixed height */}
      <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-800">
        <MessageInput
          onSend={onSendMessage}
          onSendPrescription={onSendPrescription}
          isLoading={isLoading}
          disabled={isLoading}
          placeholder="Type a message"
          conversationType={conversationData.type as ConversationType}
          currentUserType={currentUser.type}
          patientName={patientName}
          receiverId={receiverId}
          conversationId={conversationData.id}
        />
      </div>
    </section>
  );
}

