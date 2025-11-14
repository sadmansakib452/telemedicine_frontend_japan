/**
 * Messages Hook (List of Messages)
 * 
 * React hook for managing a list of messages in a conversation.
 * Includes WebSocket integration for real-time updates and cursor-based pagination.
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getMessages,
  sendMessage,
  sendPrescription,
} from '@/services/message.service';
import { useSocket } from '@/hooks/useSocket';
import type {
  MessageListItem,
  SendMessageRequest,
  SendPrescriptionRequest,
  MessagePaginationParams,
} from '@/types/message.types';
import type { MessageEvent, MessageStatusUpdatedEvent } from '@/types/socket.types';
import type { UserType } from '@/config/constants';

/**
 * Use Messages Return Type
 */
interface UseMessagesReturn {
  messages: MessageListItem[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: Error | null;
  hasMore: boolean;
  cursor?: string;
  sendMessage: (data: SendMessageRequest) => Promise<MessageListItem>;
  sendPrescription: (data: SendPrescriptionRequest) => Promise<MessageListItem>;
  loadMore: () => Promise<void>;
  refetch: () => Promise<void>;
}

/**
 * Messages Hook
 * 
 * Manages a list of messages for a conversation.
 * 
 * @param conversationId Conversation ID
 * @param userType Current user type (for WebSocket event filtering)
 * @param userId Current user ID (for WebSocket personal room joining)
 * @param limit Number of messages per page (default: 20)
 * @returns Message list and operations
 */
export const useMessages = (
  conversationId: string | null,
  userType: UserType | undefined,
  userId?: string,
  limit: number = 20
): UseMessagesReturn => {
  const [messages, setMessages] = useState<MessageListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);
  const messagesRef = useRef<MessageListItem[]>([]);
  const messageIdsRef = useRef<Set<string>>(new Set()); // Track message IDs immediately

  // Update refs when messages change
  useEffect(() => {
    messagesRef.current = messages;
    // Update IDs set immediately
    messageIdsRef.current = new Set(messages.map((m) => m.id));
  }, [messages]);

  /**
   * Handle new message WebSocket event (all users)
   */
  const handleMessage = useCallback(
    (event: MessageEvent) => {
      // Guard against malformed events
      if (!event?.data) {
        console.error('Received malformed message event:', event);
        return;
      }

      const incomingMessage = event.data;

      if (!incomingMessage?.conversation_id) {
        console.error('Message event missing conversation_id:', event);
        return;
      }

      // Skip if we already have this message (handles room + socket delivery + optimistic updates)
      if (messageIdsRef.current.has(incomingMessage.id)) {
        return;
      }

      // Only add if it's for the current conversation
      if (incomingMessage.conversation_id === conversationId) {
        // Mark as seen immediately to prevent duplicates
        messageIdsRef.current.add(incomingMessage.id);
        
        setMessages((prev) => {
          // Double-check in state (defensive)
          const exists = prev.some((m) => m.id === incomingMessage.id);
          if (exists) {
            return prev;
          }
          // Add new message to the end (most recent at bottom)
          return [...prev, incomingMessage];
        });
      }
    },
    [conversationId]
  );

  /**
   * Handle message status updated WebSocket event (all users)
   */
  const handleMessageStatusUpdated = useCallback(
    (event: MessageStatusUpdatedEvent) => {
      // Update message status in the list
      setMessages((prev) =>
        prev.map((m) =>
          m.id === event.message_id
            ? { ...m, status: event.status }
            : m
        )
      );
    },
    []
  );

  /**
   * Setup WebSocket listeners for messages
   */
  const { joinRoom, leaveRoom, isConnected } = useSocket(userType, userId, {
    onMessage: handleMessage,
    onMessageStatusUpdated: handleMessageStatusUpdated,
  });

  /**
   * Join conversation room for real-time updates
   */
  useEffect(() => {
    if (!conversationId || !isConnected) {
      return;
    }

    let isCancelled = false;

    const joinConversationRoom = async () => {
      try {
        await joinRoom(conversationId);
      } catch (err) {
        if (!isCancelled) {
          console.error(`Failed to join conversation room ${conversationId}:`, err);
        }
      }
    };

    joinConversationRoom();

    return () => {
      isCancelled = true;
      leaveRoom(conversationId);
    };
  }, [conversationId, isConnected, joinRoom, leaveRoom]);

  /**
   * Fetch messages
   */
  const fetchMessages = useCallback(
    async (params: MessagePaginationParams, append: boolean = false) => {
      if (!conversationId) {
        setMessages([]);
        return;
      }

      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        const result = await getMessages(params);
        
        if (append) {
          // Prepend older messages (cursor-based pagination loads older messages)
          setMessages((prev) => {
            const newMessages = result.messages.filter(
              (m) => !messageIdsRef.current.has(m.id)
            );
            // Update IDs set
            newMessages.forEach((m) => messageIdsRef.current.add(m.id));
            return [...newMessages, ...prev];
          });
        } else {
          // Replace messages (initial load or refresh)
          // Update IDs set
          messageIdsRef.current = new Set(result.messages.map((m) => m.id));
          setMessages(result.messages);
        }

        setCursor(result.cursor);
        setHasMore(result.hasMore);
      } catch (err) {
        setError(err as Error);
        if (!append) {
          setMessages([]);
        }
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [conversationId]
  );

  /**
   * Load more messages (older messages)
   */
  const loadMore = useCallback(async () => {
    if (!conversationId || !hasMore || isLoadingMore) {
      return;
    }

    await fetchMessages(
      {
        conversation_id: conversationId,
        limit,
        cursor,
      },
      true // Append to existing messages
    );
  }, [conversationId, hasMore, isLoadingMore, cursor, limit, fetchMessages]);

  /**
   * Refetch messages (reload from beginning)
   */
  const refetch = useCallback(async () => {
    if (!conversationId) {
      return;
    }

    setCursor(undefined);
    setHasMore(true);
    await fetchMessages(
      {
        conversation_id: conversationId,
        limit,
      },
      false // Replace messages
    );
  }, [conversationId, limit, fetchMessages]);

  /**
   * Send a message
   */
  const handleSendMessage = useCallback(
    async (data: SendMessageRequest): Promise<MessageListItem> => {
      setError(null);

      try {
        const message = await sendMessage(data);
        
        // Mark as seen immediately to prevent duplicate from WebSocket echo
        messageIdsRef.current.add(message.id);
        
        // Optimistically add message to list (will be updated by WebSocket if different)
        const listItem: MessageListItem = {
          ...message,
        };
        
        setMessages((prev) => {
          // Check if already exists (defensive)
          const exists = prev.some((m) => m.id === message.id);
          if (exists) {
            return prev;
          }
          return [...prev, listItem];
        });
        
        return listItem;
      } catch (err) {
        setError(err as Error);
        throw err;
      }
    },
    []
  );

  /**
   * Send a prescription
   */
  const handleSendPrescription = useCallback(
    async (data: SendPrescriptionRequest): Promise<MessageListItem> => {
      setError(null);

      try {
        const message = await sendPrescription(data);
        
        // Mark as seen immediately to prevent duplicate from WebSocket echo
        messageIdsRef.current.add(message.id);
        
        // Optimistically add message to list (will be updated by WebSocket if different)
        const listItem: MessageListItem = {
          ...message,
        };
        
        setMessages((prev) => {
          // Check if already exists (defensive)
          const exists = prev.some((m) => m.id === message.id);
          if (exists) {
            return prev;
          }
          return [...prev, listItem];
        });
        
        return listItem;
      } catch (err) {
        setError(err as Error);
        throw err;
      }
    },
    []
  );

  /**
   * Fetch messages on mount and when conversationId changes
   */
  useEffect(() => {
    if (conversationId) {
      refetch();
    } else {
      setMessages([]);
      setCursor(undefined);
      setHasMore(true);
    }
  }, [conversationId, refetch]);

  return {
    messages,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    cursor,
    sendMessage: handleSendMessage,
    sendPrescription: handleSendPrescription,
    loadMore,
    refetch,
  };
};

