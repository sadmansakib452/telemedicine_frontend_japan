/**
 * Message List Component
 * 
 * Displays a list of messages in a conversation.
 * Supports infinite scroll for loading older messages.
 */

'use client';

import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import type { MessageListItem } from '@/types/message.types';

type MessageListProps = {
  messages: MessageListItem[];
  currentUserId: string;
  isLoading?: boolean;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onViewPrescription?: (prescriptionId: string) => void;
};

export default function MessageList({
  messages,
  currentUserId,
  isLoading = false,
  isLoadingMore = false,
  hasMore = false,
  onLoadMore,
  onViewPrescription,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = useRef<number>(0);

  /**
   * Scroll to bottom on new messages
   */
  useEffect(() => {
    if (messages.length > prevMessagesLengthRef.current) {
      // New message added, scroll to bottom
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages.length]);

  /**
   * Handle scroll for infinite scroll
   */
  const handleScroll = () => {
    if (!messagesContainerRef.current || !onLoadMore || isLoadingMore || !hasMore) {
      return;
    }

    const container = messagesContainerRef.current;
    const scrollTop = container.scrollTop;

    // Load more when scrolled to top (older messages)
    if (scrollTop === 0) {
      onLoadMore();
    }
  };

  if (isLoading && messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No messages yet. Start the conversation!
        </p>
      </div>
    );
  }

  return (
    <div
      ref={messagesContainerRef}
      onScroll={handleScroll}
      className="flex h-full w-full flex-col overflow-y-auto bg-gray-50 px-3 py-3 dark:bg-gray-900/40 sm:px-6 sm:py-4"
    >
      {/* Load More Indicator */}
      {isLoadingMore && hasMore && (
        <div className="flex items-center justify-center py-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
        </div>
      )}

      {/* Messages */}
      <div className="flex flex-col space-y-4">
        {messages.map((message) => {
          const senderId = message.sender_id ?? message.sender?.id ?? null;
          const isOwnMessage = senderId === currentUserId;

          return (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={isOwnMessage}
              currentUserId={currentUserId}
              onViewPrescription={onViewPrescription}
            />
          );
        })}

        {/* Scroll Anchor */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

