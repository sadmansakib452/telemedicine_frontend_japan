"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import { useConversations } from "@/hooks/useConversations";
import { useMessages } from "@/hooks/useMessages";
import { useAuth } from "@/hooks/useAuth";
import { useConversation } from "@/hooks/useConversation";
import { usePrescription } from "@/hooks/usePrescription";
import PrescriptionModal from "@/components/prescriptions/PrescriptionModal";
import { usePresence } from "@/context/PresenceContext";
import type { ConversationListItem } from "@/types/conversation.types";
import type { UserType } from "@/config/constants";
import type { PrescriptionFormData } from "@/types/prescription.types";

/**
 * Convert ConversationListItem to display format for ConversationList
 */
const mapConversationListItem = (
  item: ConversationListItem,
  currentUserId: string,
  isOnlineFn: (userId: string | undefined) => boolean
): {
  id: string;
  name: string;
  role: string;
  status: string;
  preview: string;
  timeAgo: string;
  avatar: string;
  online?: boolean;
} => {
  // Determine the other person in the conversation
  const otherPerson =
    item.creator_id === currentUserId ? item.participant : item.creator;

  const partnerOnline = isOnlineFn(otherPerson.id);

  // Get role label based on user type
  const getRoleLabel = (userType: string): string => {
    switch (userType) {
      case "patient":
        return "Patient";
      case "doctor":
        return "Doctor";
      case "shop_keeper":
        return "Shop Owner";
      default:
        return "User";
    }
  };

  // Format time ago
  const timeAgo = item.last_message
    ? formatDistanceToNow(new Date(item.last_message.created_at), {
        addSuffix: true,
      })
    : formatDistanceToNow(new Date(item.created_at), { addSuffix: true });

  // Get preview from last message
  const preview = item.last_message?.message || "No messages yet";

  return {
    id: item.id,
    name: otherPerson.name,
    role: getRoleLabel(otherPerson.type),
    status: partnerOnline ? "Online" : "Offline",
    preview: preview.length > 50 ? `${preview.substring(0, 50)}...` : preview,
    timeAgo,
    avatar: otherPerson.avatar_url || otherPerson.avatar || "/images/user/user-01.jpg",
    online: partnerOnline,
  };
};

export default function ConversationsWorkspace() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const { isOnline } = usePresence();
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

  // Fetch conversations list
  const {
    conversations,
    isLoading: isConversationsLoading,
    error: conversationsError,
  } = useConversations(user?.type as UserType | undefined);

  // Fetch active conversation details
  const {
    conversation: activeConversation,
    isLoading: isConversationLoading,
  } = useConversation(activeConversationId);

  // Fetch messages for active conversation
  const {
    messages,
    isLoading: isMessagesLoading,
    isLoadingMore: isMessagesLoadingMore,
    hasMore: hasMoreMessages,
    sendMessage: handleSendMessage,
    sendPrescription: handleSendPrescription,
    loadMore: loadMoreMessages,
  } = useMessages(activeConversationId, user?.type as UserType | undefined);

  // Prescription viewing hook
  const {
    prescription,
    isModalOpen: isPrescriptionModalOpen,
    openModal: openPrescriptionModal,
    closeModal: closePrescriptionModal,
  } = usePrescription();

  // Map conversations to display format
  const mappedConversations = useMemo(() => {
    if (!user || !conversations) return [];
    return conversations.map((item) =>
      mapConversationListItem(item, user.id, isOnline)
    );
  }, [conversations, user, isOnline]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/signin");
    }
  }, [user, isAuthLoading, router]);

  const handleSelectConversation = (conversationId: string) => {
    setActiveConversationId(conversationId);
    setIsMobileChatOpen(true);
  };

  const handleBackToList = () => {
    setIsMobileChatOpen(false);
  };

  // Get receiver ID from active conversation
  const receiverId =
    activeConversation?.creator_id === user?.id
      ? activeConversation?.participant_id
      : activeConversation?.creator_id;

  // Send text message handler
  const handleSendTextMessage = async (message: string) => {
    if (!activeConversationId || !receiverId) {
      throw new Error("Conversation or receiver ID is missing.");
    }

    await handleSendMessage({
      conversation_id: activeConversationId,
      receiver_id: receiverId,
      message,
      message_type: "text",
    });
  };

  // Send prescription handler (for doctors)
  const handleSendPrescriptionMessage = async (data: PrescriptionFormData) => {
    if (!activeConversationId || !receiverId) {
      throw new Error("Conversation or receiver ID is missing.");
    }

    await handleSendPrescription({
      conversation_id: activeConversationId,
      receiver_id: receiverId,
      message: data.message || "Prescription",
      medicine_details: data.medicine_details,
      patient_name: data.patient_name,
    });
  };

  // View prescription handler
  const handleViewPrescription = async (prescriptionId: string) => {
    // Open prescription modal by ID (usePrescription will fetch the prescription)
    await openPrescriptionModal(prescriptionId);
  };

  // Show loading state only during initial auth/loading
  // Once loaded, always show the two-panel layout
  const isInitialLoading = isAuthLoading || (isConversationsLoading && !user);

  // Auto-select first conversation when conversations load
  useEffect(() => {
    if (
      !activeConversationId &&
      mappedConversations.length > 0 &&
      !isConversationsLoading &&
      user
    ) {
      setActiveConversationId(mappedConversations[0].id);
    }
  }, [mappedConversations, activeConversationId, isConversationsLoading, user]);

  // Get active conversation display info
  const activeConversationDisplay =
    mappedConversations.find((c) => c.id === activeConversationId) || null;

  // Initial loading state (before user/auth is loaded)
  if (isInitialLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 transition-colors dark:bg-gray-900">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading conversations...
          </p>
        </div>
      </div>
    );
  }

  // Always render the two-panel layout (even on error or empty state)
  // Error and empty states are handled inside ConversationList component
  return (
    <div className="flex min-h-screen w-full justify-center bg-gray-50 px-4 py-6 transition-colors dark:bg-gray-900 sm:px-6 lg:px-10 lg:py-8">
      <div className="grid w-full max-w-[1400px] grid-cols-1 gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        {/* Conversation List (Left Panel) */}
        <div
          className={`h-[calc(100vh-5rem)] ${
            isMobileChatOpen ? "hidden" : "flex"
          } lg:flex`}
        >
          <ConversationList
            conversations={mappedConversations}
            activeConversationId={activeConversationId || ""}
            onSelectConversation={handleSelectConversation}
            isLoading={isConversationsLoading}
            error={conversationsError}
          />
        </div>

        {/* Chat Window (Right Panel) */}
        <div
          className={`h-[calc(100vh-5rem)] ${
            isMobileChatOpen ? "flex" : "hidden"
          } lg:flex`}
        >
          {activeConversationDisplay && activeConversation && user ? (
            <ChatWindow
              conversation={activeConversationDisplay}
              conversationData={activeConversation}
              currentUser={user}
              messages={messages}
              isLoading={isMessagesLoading}
              isLoadingMore={isMessagesLoadingMore}
              hasMore={hasMoreMessages}
              onBack={handleBackToList}
              onSendMessage={handleSendTextMessage}
              onSendPrescription={handleSendPrescriptionMessage}
              onLoadMoreMessages={loadMoreMessages}
              onViewPrescription={handleViewPrescription}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-[32px] border border-gray-200 bg-white shadow-theme-xl dark:border-gray-800 dark:bg-gray-900">
              {isConversationLoading ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Loading conversation...
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Select a conversation to start chatting.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Prescription View Modal */}
      {prescription && (
        <PrescriptionModal
          isOpen={isPrescriptionModalOpen}
          onClose={closePrescriptionModal}
          prescription={prescription}
          isLoading={false}
          error={null}
        />
      )}
    </div>
  );
}

