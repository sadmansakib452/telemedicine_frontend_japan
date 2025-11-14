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
 * @returns Conversation list and operations
 */
export const useConversations = (
  userType: UserType | undefined
): UseConversationsReturn => {
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Convert Conversation to ConversationListItem
   */
  const convertToListItem = useCallback((conversation: Conversation): ConversationListItem => {
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
      last_message: conversation.messages && conversation.messages.length > 0
        ? {
            id: conversation.messages[conversation.messages.length - 1].id,
            message: conversation.messages[conversation.messages.length - 1].message || '',
            created_at: conversation.messages[conversation.messages.length - 1].created_at,
          }
        : undefined,
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
   */
  const handleMessage = useCallback(
    (event: MessageEvent) => {
      if (!event?.data?.conversation_id) {
        return;
      }

      const message = event.data;
      const conversationId = message.conversation_id;

      // Update conversation's last message and move to top
      setConversations((prev) => {
        const existingIndex = prev.findIndex((c) => c.id === conversationId);
        
        if (existingIndex >= 0) {
          const updated = [...prev];
          const conversation = updated[existingIndex];
          
          // Update last message info
          const updatedConversation: ConversationListItem = {
            ...conversation,
            updated_at: message.created_at, // Use message timestamp as updated_at
            last_message: {
              id: message.id,
              message: message.message || '',
              created_at: message.created_at,
            },
          };
          
          // Remove from current position and add to top
          updated.splice(existingIndex, 1);
          return [updatedConversation, ...updated];
        }
        
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
  useSocket(userType, {
    onConversation: handleConversation,
    onMessage: handleMessage, // Listen to messages to update conversation list
  });

  /**
   * Fetch conversations
   */
  const fetchConversations = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getConversations();
      setConversations(data);
    } catch (err) {
      setError(err as Error);
      setConversations([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

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

