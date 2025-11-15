/**
 * WebSocket Service
 * 
 * Service layer for WebSocket operations including room management,
 * event emission, and event listening.
 */

import type { Socket } from 'socket.io-client';
import { WS_EVENTS } from '@/config/constants';
import type {
  JoinRoomEvent,
  LeaveRoomEvent,
  UpdateMessageStatusEvent,
} from '@/types/socket.types';

/**
 * Join a room (conversation)
 * 
 * @param socket Socket.IO instance
 * @param roomId Room ID (conversation ID)
 * @returns Promise that resolves when joined
 */
export const joinRoom = (socket: Socket, roomId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!socket || !socket.connected) {
      reject(new Error('Socket not connected'));
      return;
    }

    // Emit join room event
    socket.emit(WS_EVENTS.JOIN_ROOM, { room_id: roomId } as JoinRoomEvent);

    // Listen for joined room confirmation
    const onJoined = (data: { room_id: string }) => {
      if (data.room_id === roomId) {
        socket.off(WS_EVENTS.JOINED_ROOM, onJoined);
        socket.off('error', onError);
        resolve();
      }
    };

    const onError = (error: Error) => {
      socket.off(WS_EVENTS.JOINED_ROOM, onJoined);
      socket.off('error', onError);
      reject(error);
    };

    socket.on(WS_EVENTS.JOINED_ROOM, onJoined);
    socket.on('error', onError);

    // Timeout after 5 seconds
    setTimeout(() => {
      socket.off(WS_EVENTS.JOINED_ROOM, onJoined);
      socket.off('error', onError);
      reject(new Error('Join room timeout'));
    }, 5000);
  });
};

/**
 * Leave a room (conversation)
 * 
 * @param socket Socket.IO instance
 * @param roomId Room ID (conversation ID)
 */
export const leaveRoom = (socket: Socket, roomId: string): void => {
  if (!socket || !socket.connected) {
    return;
  }

  // Emit leave room event
  socket.emit(WS_EVENTS.LEAVE_ROOM, { room_id: roomId } as LeaveRoomEvent);
};

/**
 * Update message status
 * 
 * @param socket Socket.IO instance
 * @param messageId Message ID
 * @param status New status (PENDING, SENT, DELIVERED, READ)
 */
export const updateMessageStatus = (
  socket: Socket,
  messageId: string,
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'READ'
): void => {
  if (!socket || !socket.connected) {
    return;
  }

  // Emit message status update event
  socket.emit(WS_EVENTS.MESSAGE_STATUS_UPDATED, {
    message_id: messageId,
    status,
  } as UpdateMessageStatusEvent);
};

/**
 * Check if socket is connected
 * 
 * @param socket Socket.IO instance
 * @returns True if connected, false otherwise
 */
export const isSocketConnected = (socket: Socket | null): boolean => {
  return socket !== null && socket.connected;
};

