/**
 * WebSocket Event Types
 * 
 * Type definitions for all WebSocket events and their payloads.
 */

import { Broadcast } from './broadcast.types';
import { Conversation } from './conversation.types';
import { Message } from './message.types';
import { UserStatus } from '@/config/constants';

/**
 * Base WebSocket Event
 */
export interface BaseSocketEvent {
  from?: string; // User ID who triggered event
}

/**
 * New Broadcast Event
 * Emitted to: All verified doctors
 * Trigger: Patient creates broadcast
 */
export interface NewBroadcastEvent extends BaseSocketEvent {
  broadcast: Broadcast;
}

/**
 * Broadcast Assisted Event
 * Emitted to: All doctors
 * Trigger: Doctor responds to broadcast
 */
export interface BroadcastAssistedEvent extends BaseSocketEvent {
  broadcast_id: string;
  // Note: Does not include assisted_by or conversation_id
  // Frontend should update local state or refetch
}

/**
 * Conversation Event
 * Emitted to: Creator and participant
 * Trigger: New conversation created
 */
export interface ConversationEvent extends BaseSocketEvent {
  from: string; // User ID who triggered event
  data: Conversation;
}

/**
 * Message Event
 * Emitted to: Conversation room and receiver's personal room
 * Trigger: New message created
 */
export interface MessageEvent extends BaseSocketEvent {
  from: string; // Sender ID
  data: Message;
}

/**
 * New Prescription Event
 * Emitted to: Shop owner
 * Trigger: Doctor sends prescription (distributed to shop owner)
 */
export interface NewPrescriptionEvent extends BaseSocketEvent {
  prescription: {
    id: string;
    message: string | null;
    message_type: 'prescription';
    medicine_details: string;
    patient_name: string;
    sender_id: string;
    receiver_id: string;
    conversation_id: string;
    status: string;
    created_at: string;
    sender: {
      id: string;
      name: string;
      avatar?: string | null;
      avatar_url?: string;
    };
    receiver?: {
      id: string;
      name: string;
      avatar?: string | null;
      avatar_url?: string;
    };
  };
  doctor: {
    id: string;
    name: string;
  };
}

/**
 * Message Status Updated Event
 * Emitted to: All clients
 * Trigger: Message status updated (via WebSocket updateMessageStatus)
 */
export interface MessageStatusUpdatedEvent extends BaseSocketEvent {
  message_id: string;
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'READ';
}

/**
 * User Status Change Event
 * Emitted to: All clients
 * Trigger: User connects/disconnects
 */
export interface UserStatusChangeEvent extends BaseSocketEvent {
  user_id: string;
  status: UserStatus;
}

/**
 * Join Room Event
 * Client -> Server
 */
export interface JoinRoomEvent {
  room_id: string;
}

/**
 * Leave Room Event
 * Client -> Server
 */
export interface LeaveRoomEvent {
  room_id: string;
}

/**
 * Joined Room Event
 * Server -> Client
 */
export interface JoinedRoomEvent {
  room_id: string;
}

/**
 * Left Room Event
 * Server -> Client
 */
export interface LeftRoomEvent {
  room_id: string;
}

/**
 * Update Message Status Event
 * Client -> Server
 */
export interface UpdateMessageStatusEvent {
  message_id: string;
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'READ';
}

/**
 * Socket Event Types Union
 */
export type SocketEvent =
  | NewBroadcastEvent
  | BroadcastAssistedEvent
  | ConversationEvent
  | MessageEvent
  | NewPrescriptionEvent
  | MessageStatusUpdatedEvent
  | UserStatusChangeEvent;

/**
 * Socket Event Handlers
 */
export interface SocketEventHandlers {
  onNewBroadcast?: (event: NewBroadcastEvent) => void;
  onBroadcastAssisted?: (event: BroadcastAssistedEvent) => void;
  onConversation?: (event: ConversationEvent) => void;
  onMessage?: (event: MessageEvent) => void;
  onNewPrescription?: (event: NewPrescriptionEvent) => void;
  onMessageStatusUpdated?: (event: MessageStatusUpdatedEvent) => void;
  onUserStatusChange?: (event: UserStatusChangeEvent) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Socket Connection Options
 */
export interface SocketConnectionOptions {
  token: string; // JWT access token
  transports?: ('websocket' | 'polling')[];
  reconnection?: boolean;
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
}

