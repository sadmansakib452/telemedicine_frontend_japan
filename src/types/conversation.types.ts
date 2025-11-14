/**
 * Conversation Types
 * 
 * Type definitions for conversation-related data structures.
 */

import { ConversationType, ConversationStatus } from '@/config/constants';
import { User } from './user.types';
import { Message } from './message.types';

/**
 * Conversation
 */
export interface Conversation {
  id: string;
  creator_id: string;
  participant_id: string;
  broadcast_id: string | null;
  type: ConversationType;
  status: ConversationStatus;
  assisted_by: string | null;
  created_at: string;
  updated_at: string;
  creator: User;
  participant: User;
  messages?: Message[];
}

/**
 * Conversation List Item
 */
export interface ConversationListItem {
  id: string;
  creator_id: string;
  participant_id: string;
  broadcast_id: string | null;
  type: ConversationType;
  status: ConversationStatus;
  assisted_by: string | null;
  created_at: string;
  updated_at: string;
  creator: User;
  participant: User;
  last_message?: {
    id: string;
    message: string | null;
    message_type: 'text' | 'prescription';
    created_at: string;
  };
}

/**
 * Create Conversation Request
 */
export interface CreateConversationRequest {
  creator_id?: string; // Optional, extracted from JWT if not provided
  participant_id: string;
  broadcast_id?: string; // Required when responding to broadcast
  type?: ConversationType; // Defaults to 'patient_doctor'
}

/**
 * Respond to Broadcast Request
 * Used with POST /api/chat/conversation/broadcast/:broadcastId/respond
 */
export interface RespondToBroadcastRequest {
  broadcast_id: string;
  participant_id: string;
  // doctor_id is extracted from JWT token
}

/**
 * Conversation Response
 */
export interface ConversationResponse {
  success: boolean;
  data: Conversation;
  message?: string;
}

/**
 * Conversation List Response
 * 
 * Note: Backend returns Conversation[] (not ConversationListItem[])
 * Frontend must convert messages[] array to last_message object
 */
export interface ConversationListResponse {
  success: boolean;
  data: Conversation[]; // Backend returns Conversation[] with messages[] array
  count?: number;
}

