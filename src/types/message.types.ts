/**
 * Message Types
 * 
 * Type definitions for message-related data structures.
 */

import { MessageType, MessageStatus } from '@/config/constants';
import { User } from './user.types';

/**
 * Message
 */
export interface Message {
  id: string;
  message: string | null;
  message_type: MessageType;
  medicine_details: string | null; // Required if message_type === 'prescription'
  patient_name: string | null; // Required if message_type === 'prescription'
  sender_id: string;
  receiver_id: string;
  conversation_id: string;
  status: MessageStatus;
  attachment: string | null;
  attachment_url: string | null;
  created_at: string;
  updated_at: string;
  sender: User;
  receiver: User;
}

/**
 * Message List Item
 */
export interface MessageListItem {
  id: string;
  message: string | null;
  message_type: MessageType;
  medicine_details: string | null;
  patient_name: string | null;
  sender_id: string;
  receiver_id: string;
  conversation_id: string;
  status: MessageStatus;
  attachment: string | null;
  attachment_url: string | null;
  created_at: string;
  updated_at: string;
  sender: User;
  receiver: User;
}

/**
 * Send Message Request
 */
export interface SendMessageRequest {
  conversation_id: string;
  receiver_id: string;
  message?: string; // Optional, defaults to 'Prescription' for prescription messages
  message_type?: MessageType; // Optional, defaults to 'text'
  medicine_details?: string; // Required if message_type === 'prescription'
  patient_name?: string; // Required if message_type === 'prescription'
}

/**
 * Send Prescription Request
 */
export interface SendPrescriptionRequest {
  conversation_id: string;
  receiver_id: string;
  medicine_details: string;
  patient_name: string;
  message?: string; // Optional, defaults to 'Prescription'
}

/**
 * Update Message Status Request
 */
export interface UpdateMessageStatusRequest {
  message_id: string;
  status: MessageStatus;
}

/**
 * Message Response
 */
export interface MessageResponse {
  success: boolean;
  data: Message;
  message?: string;
}

/**
 * Message List Response
 */
export interface MessageListResponse {
  success: boolean;
  data: MessageListItem[];
  count?: number;
  cursor?: string;
  limit?: number;
}

/**
 * Message Pagination Parameters
 */
export interface MessagePaginationParams {
  conversation_id: string;
  limit?: number; // Default: 20, Max: 100
  cursor?: string; // Message ID
}

