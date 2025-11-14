/**
 * Conversations Hook (List of Conversations)
 * 
 * React hook for managing a list of conversations.
 * Includes WebSocket integration for real-time updates.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getConversations,
  createConversation,
  respondToBroadcast,
} from '@/services/conversation.service';
import { useSocket } from '@/hooks/useSocket';
import type { ConversationListItem, CreateConversationRequest, RespondToBroadcastRequest, Conversation } from '@/types/conversation.types';
import type { ConversationEvent, MessageEvent } from '@/types/socket.types';
import type { UserType } from '@/config/constants';

/**
 * Use Conversations Return Type
 */
interface UseConversationsReturn {
  conversations: ConversationListItem[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  create: (data: CreateConversationRequest) => Promise<ConversationListItem>;
  respondToBroadcast: (broadcastId: string, data: RespondToBroadcastRequest) => Promise<ConversationListItem>;
}

/**
 * Conversations Hook
 * 
 * Manages a list of conversations for the current user.
 * 
 * @param userType Current user type (for WebSocket event filtering)
 * @param userId Current user ID (for WebSocket personal room joining)
 * @returns Conversation list and operations
 */
export const useConversations = (
  userType: UserType | undefined,
  userId?: string
): UseConversationsReturn => {
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Convert Conversation to ConversationListItem
   * 
   * Backend returns Conversation[] with messages[] array (0 or 1 item)
   * Frontend expects ConversationListItem[] with last_message object
   * This function converts messages[0] to last_message object
   */
  const convertToListItem = useCallback((conversation: Conversation): ConversationListItem => {
    // Get last message (messages[0] or null)
    // Backend returns messages ordered by created_at DESC, so [0] is the latest
    const lastMessage = conversation.messages?.[0] || null;

    // Create last_message object
    const last_message = lastMessage
      ? {
          id: lastMessage.id,
          message: lastMessage.message, // Can be null for prescription messages
          message_type: lastMessage.message_type, // 'text' | 'prescription'
          created_at: lastMessage.created_at,
        }
      : undefined;

    return {
      id: conversation.id,
      creator_id: conversation.creator_id,
      participant_id: conversation.participant_id,
      broadcast_id: conversation.broadcast_id,
      type: conversation.type,
      status: conversation.status,
      assisted_by: conversation.assisted_by,
      created_at: conversation.created_at,
      updated_at: conversation.updated_at,
      creator: conversation.creator,
      participant: conversation.participant,
      last_message,
    };
  }, []);

  /**
   * Handle conversation WebSocket event (all users)
   */
  const handleConversation = useCallback(
    (event: ConversationEvent) => {
      // Convert Conversation to ConversationListItem
      const listItem = convertToListItem(event.data);
      
      // Add or update conversation in the list
      setConversations((prev) => {
        // Check if conversation already exists
        const existingIndex = prev.findIndex((c) => c.id === listItem.id);
        
        if (existingIndex >= 0) {
          // Update existing conversation
          const updated = [...prev];
          updated[existingIndex] = listItem;
          // Move to top (most recent first)
          const [updatedItem] = updated.splice(existingIndex, 1);
          return [updatedItem, ...updated];
        } else {
          // Add new conversation to the beginning (most recent first)
          return [listItem, ...prev];
        }
      });
    },
    [convertToListItem]
  );

  /**
   * Handle new message WebSocket event to update conversation list
   * 
   * Updates last_message in conversation list when new message is received
   * Includes message_type for proper preview text generation
   */
  const handleMessage = useCallback(
    (event: MessageEvent) => {
      // Debug logging
      console.log('[useConversations] WebSocket message event received:', event);
      
      if (!event?.data?.conversation_id) {
        console.warn('[useConversations] Message event missing conversation_id:', event);
        return;
      }

      const message = event.data;
      const conversationId = message.conversation_id;

      console.log('[useConversations] Updating conversation:', conversationId, 'with message:', message.id);

      // Update conversation's last message and move to top
      setConversations((prev) => {
        const existingIndex = prev.findIndex((c) => c.id === conversationId);
        
        if (existingIndex >= 0) {
          const updated = [...prev];
          const conversation = updated[existingIndex];
          
          console.log('[useConversations] Found conversation at index:', existingIndex);
          
          // Update last message info with message_type
          const updatedConversation: ConversationListItem = {
            ...conversation,
            updated_at: message.created_at, // Use message timestamp as updated_at
            last_message: {
              id: message.id,
              message: message.message, // Can be null for prescription messages
              message_type: message.message_type, // 'text' | 'prescription'
              created_at: message.created_at,
            },
          };
          
          // Remove from current position and add to top (most recent first)
          updated.splice(existingIndex, 1);
          const newList = [updatedConversation, ...updated];
          
          console.log('[useConversations] Updated conversation list, new count:', newList.length);
          
          return newList;
        }
        
        console.warn('[useConversations] Conversation not found in list:', conversationId);
        console.log('[useConversations] Current conversations:', prev.map(c => c.id));
        
        // If conversation not found, it might be a new one - refetch
        // But don't refetch here to avoid infinite loops, just return unchanged
        return prev;
      });
    },
    []
  );

  /**
   * Setup WebSocket listeners for conversations and messages
   */
  useSocket(userType, userId, {
    onConversation: handleConversation,
    onMessage: handleMessage, // Listen to messages to update conversation list
  });

  /**
   * Fetch conversations
   * 
   * Backend returns Conversation[] with messages[] array
   * Must convert to ConversationListItem[] with last_message object
   */
  const fetchConversations = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Backend returns Conversation[] (not ConversationListItem[])
      const data = await getConversations();
      
      // Convert each conversation from API format to frontend format
      // Backend returns Conversation[] with messages[] array
      // Frontend expects ConversationListItem[] with last_message object
      const converted = data.map((conv) => convertToListItem(conv));
      
      setConversations(converted);
    } catch (err) {
      setError(err as Error);
      setConversations([]);
    } finally {
      setIsLoading(false);
    }
  }, [convertToListItem]);

  /**
   * Create a new conversation
   */
  const create = useCallback(
    async (data: CreateConversationRequest): Promise<ConversationListItem> => {
      setIsLoading(true);
      setError(null);

      try {
        const conversation = await createConversation(data);
        // Convert Conversation to ConversationListItem
        const listItem = convertToListItem(conversation);
        // Add to list (will be updated by WebSocket event)
        setConversations((prev) => [listItem, ...prev]);
        return listItem;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [convertToListItem]
  );

  /**
   * Respond to a broadcast (creates a conversation)
   */
  const handleRespondToBroadcast = useCallback(
    async (
      broadcastId: string,
      data: RespondToBroadcastRequest
    ): Promise<ConversationListItem> => {
      setIsLoading(true);
      setError(null);

      try {
        const conversation = await respondToBroadcast(broadcastId, data);
        // Convert Conversation to ConversationListItem
        const listItem = convertToListItem(conversation);
        // Add to list (will be updated by WebSocket event)
        setConversations((prev) => [listItem, ...prev]);
        return listItem;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [convertToListItem]
  );

  /**
   * Refetch conversations
   */
  const refetch = useCallback(async () => {
    await fetchConversations();
  }, [fetchConversations]);

  /**
   * Fetch conversations on mount
   */
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    isLoading,
    error,
    refetch,
    create,
    respondToBroadcast: handleRespondToBroadcast,
  };
};

