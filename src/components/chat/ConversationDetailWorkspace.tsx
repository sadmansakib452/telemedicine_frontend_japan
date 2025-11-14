"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import ChatWindow from "./ChatWindow";
import { useMessages } from "@/hooks/useMessages";
import { useAuth } from "@/hooks/useAuth";
import { useConversation } from "@/hooks/useConversation";
import { usePrescription } from "@/hooks/usePrescription";
import PrescriptionModal from "@/components/prescriptions/PrescriptionModal";
import type { ConversationType, UserType } from "@/config/constants";
import type { PrescriptionFormData } from "@/types/prescription.types";

type ConversationDetailWorkspaceProps = {
  conversationId: string;
};

export default function ConversationDetailWorkspace({
  conversationId,
}: ConversationDetailWorkspaceProps) {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();

  // Fetch conversation details
  const {
    conversation: activeConversation,
    isLoading: isConversationLoading,
    error: conversationError,
  } = useConversation(conversationId);

  // Fetch messages for conversation
  const {
    messages,
    isLoading: isMessagesLoading,
    isLoadingMore: isMessagesLoadingMore,
    hasMore: hasMoreMessages,
    sendMessage: handleSendMessage,
    sendPrescription: handleSendPrescription,
    loadMore: loadMoreMessages,
  } = useMessages(conversationId, user?.type as UserType | undefined);

  // Prescription viewing hook
  const {
    prescription,
    isModalOpen: isPrescriptionModalOpen,
    openModal: openPrescriptionModal,
    closeModal: closePrescriptionModal,
  } = usePrescription();

  // Map conversation to display format
  const conversationDisplay = useMemo(() => {
    if (!user || !activeConversation) return null;

    // Determine the other person in the conversation
    const otherPerson =
      activeConversation.creator_id === user.id
        ? activeConversation.participant
        : activeConversation.creator;

    // Get role label based on user type
    const getRoleLabel = (userType: string): string => {
      switch (userType) {
        case "patient":
          return "Patient";
        case "doctor":
          return "Doctor";
        case "shop_keeper":
        case "shop_owner": // Handle both backend values
          return "Shop Owner";
        default:
          return "User";
      }
    };

    // Format time ago from last message or created_at
    const timeAgo = activeConversation.messages && activeConversation.messages.length > 0
      ? formatDistanceToNow(
          new Date(
            activeConversation.messages[activeConversation.messages.length - 1].created_at
          ),
          { addSuffix: true }
        )
      : formatDistanceToNow(new Date(activeConversation.created_at), {
          addSuffix: true,
        });

    // Get preview from last message
    const lastMessage = activeConversation.messages && activeConversation.messages.length > 0
      ? activeConversation.messages[activeConversation.messages.length - 1]
      : null;
    const preview = lastMessage?.message || "No messages yet";

    return {
      id: activeConversation.id,
      name: otherPerson.name,
      role: getRoleLabel(otherPerson.type),
      status: "Active now", // TODO: Get from WebSocket or user status API
      preview: preview.length > 50 ? `${preview.substring(0, 50)}...` : preview,
      timeAgo,
      avatar: otherPerson.avatar_url || otherPerson.avatar || "/images/user/user-01.jpg",
      online: false, // TODO: Get from WebSocket or user status API
    };
  }, [activeConversation, user]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/signin");
    }
  }, [user, isAuthLoading, router]);

  // Navigate back to conversations list
  const handleBack = () => {
    router.push("/conversations");
  };

  // Get receiver ID from active conversation
  const receiverId =
    activeConversation?.creator_id === user?.id
      ? activeConversation?.participant_id
      : activeConversation?.creator_id;

  // Send text message handler
  const handleSendTextMessage = async (message: string) => {
    if (!conversationId || !receiverId) {
      throw new Error("Conversation or receiver ID is missing.");
    }

    await handleSendMessage({
      conversation_id: conversationId,
      receiver_id: receiverId,
      message,
      message_type: "text",
    });
  };

  // Send prescription handler (for doctors)
  const handleSendPrescriptionMessage = async (data: PrescriptionFormData) => {
    if (!conversationId || !receiverId) {
      throw new Error("Conversation or receiver ID is missing.");
    }

    await handleSendPrescription({
      conversation_id: conversationId,
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

  // Loading state
  if (isAuthLoading || isConversationLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 transition-colors dark:bg-gray-900">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading conversation...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (conversationError) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 transition-colors dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-error-500">
            Error: {conversationError.message}
          </p>
          <button
            onClick={() => router.push("/conversations")}
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm text-white transition hover:bg-brand-600"
          >
            Back to Conversations
          </button>
        </div>
      </div>
    );
  }

  // No conversation found
  if (!activeConversation || !conversationDisplay || !user) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 transition-colors dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Conversation not found.
          </p>
          <button
            onClick={() => router.push("/conversations")}
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm text-white transition hover:bg-brand-600"
          >
            Back to Conversations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full justify-center bg-gray-50 px-4 py-6 transition-colors dark:bg-gray-900 sm:px-6 lg:px-10 lg:py-8">
      <div className="w-full max-w-[1400px]">
        <div className="h-[calc(100vh-5rem)]">
          <ChatWindow
            conversation={conversationDisplay}
            conversationData={activeConversation}
            currentUser={user}
            messages={messages}
            isLoading={isMessagesLoading}
            isLoadingMore={isMessagesLoadingMore}
            hasMore={hasMoreMessages}
            onBack={handleBack}
            onSendMessage={handleSendTextMessage}
            onSendPrescription={handleSendPrescriptionMessage}
            onLoadMoreMessages={loadMoreMessages}
            onViewPrescription={handleViewPrescription}
          />
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

