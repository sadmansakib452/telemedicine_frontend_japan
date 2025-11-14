/**
 * WebSocket Hook
 * 
 * React hook for managing WebSocket connection and event listeners.
 * Provides role-based event listeners and reconnection handling.
 */

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { createSocketConnection, disconnectSocket, reconnectSocket } from '@/lib/socket';
import {
  joinRoom,
  leaveRoom,
  updateMessageStatus,
} from '@/services/socket.service';
import { getAccessToken } from '@/utils/token';
import { WS_EVENTS } from '@/config/constants';
import type { SocketEventHandlers } from '@/types/socket.types';
import type { UserType } from '@/config/constants';

/**
 * WebSocket Hook Return Type
 */
interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;
  joinRoom: (roomId: string) => Promise<void>;
  leaveRoom: (roomId: string) => void;
  updateMessageStatus: (messageId: string, status: 'PENDING' | 'SENT' | 'DELIVERED' | 'READ') => void;
  reconnect: () => void;
  disconnect: () => void;
}

/**
 * WebSocket Hook
 * 
 * Manages WebSocket connection and event listeners based on user type.
 * 
 * @param userType Current user type (for role-based event listeners)
 * @param handlers Event handlers for WebSocket events
 * @returns WebSocket connection and operations
 */
export const useSocket = (
  userType?: UserType,
  handlers?: SocketEventHandlers
): UseSocketReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const handlersRef = useRef<SocketEventHandlers | undefined>(handlers);
  const userTypeRef = useRef<UserType | undefined>(userType);
  const activeRoomsRef = useRef<Set<string>>(new Set());

  const cleanupEventListeners = useCallback((socketInstance: Socket) => {
    socketInstance.off(WS_EVENTS.CONNECT);
    socketInstance.off(WS_EVENTS.DISCONNECT);
    socketInstance.off(WS_EVENTS.CONNECT_ERROR);
    socketInstance.off(WS_EVENTS.NEW_BROADCAST);
    socketInstance.off(WS_EVENTS.BROADCAST_ASSISTED);
    socketInstance.off(WS_EVENTS.CONVERSATION);
    socketInstance.off(WS_EVENTS.MESSAGE);
    socketInstance.off(WS_EVENTS.NEW_PRESCRIPTION);
    socketInstance.off(WS_EVENTS.MESSAGE_STATUS_UPDATED);
    socketInstance.off(WS_EVENTS.USER_STATUS_CHANGE);
    socketInstance.off(WS_EVENTS.JOINED_ROOM);
  }, []);

  const setupEventListeners = useCallback((socketInstance: Socket) => {
    cleanupEventListeners(socketInstance);

    const currentUserType = userTypeRef.current;
    const currentHandlers = handlersRef.current;

    if (!currentHandlers) {
      return;
    }

    // Connection events (all users)
    socketInstance.on(WS_EVENTS.CONNECT, () => {
      setIsConnected(true);
      setIsConnecting(false);
      setError(null);

      // Rejoin any active rooms after reconnect
      activeRoomsRef.current.forEach((roomId) => {
        joinRoom(socketInstance, roomId).catch((err) => {
          console.error(`Failed to rejoin room ${roomId}:`, err);
        });
      });

      currentHandlers.onConnect?.();
    });

    socketInstance.on(WS_EVENTS.DISCONNECT, () => {
      setIsConnected(false);
      currentHandlers.onDisconnect?.();
    });

    socketInstance.on(WS_EVENTS.CONNECT_ERROR, (err: Error) => {
      setIsConnecting(false);
      setError(err);
      currentHandlers.onError?.(err);
    });

    // Optional: listen for room join confirmations for debugging
    socketInstance.on(WS_EVENTS.JOINED_ROOM, (data: { room_id: string }) => {
      console.info(`Joined room: ${data.room_id}`);
    });

    // Role-based event listeners for doctors
    if (currentUserType === 'doctor') {
      if (currentHandlers.onNewBroadcast) {
        socketInstance.on(WS_EVENTS.NEW_BROADCAST, currentHandlers.onNewBroadcast);
      }

      if (currentHandlers.onBroadcastAssisted) {
        socketInstance.on(WS_EVENTS.BROADCAST_ASSISTED, currentHandlers.onBroadcastAssisted);
      }
    }

    // Role-based event listeners for shop owners
    if (currentUserType === 'shop_keeper') {
      if (currentHandlers.onNewPrescription) {
        socketInstance.on(WS_EVENTS.NEW_PRESCRIPTION, currentHandlers.onNewPrescription);
      }
    }

    // Common event listeners (all users)
    if (currentHandlers.onConversation) {
      socketInstance.on(WS_EVENTS.CONVERSATION, currentHandlers.onConversation);
    }

    if (currentHandlers.onMessage) {
      socketInstance.on(WS_EVENTS.MESSAGE, currentHandlers.onMessage);
    }

    if (currentHandlers.onMessageStatusUpdated) {
      socketInstance.on(WS_EVENTS.MESSAGE_STATUS_UPDATED, currentHandlers.onMessageStatusUpdated);
    }

    if (currentHandlers.onUserStatusChange) {
      socketInstance.on(WS_EVENTS.USER_STATUS_CHANGE, currentHandlers.onUserStatusChange);
    }
  }, [cleanupEventListeners]);

  useEffect(() => {
    handlersRef.current = handlers;
    if (socketRef.current) {
      setupEventListeners(socketRef.current);
    }
  }, [handlers, setupEventListeners]);

  useEffect(() => {
    userTypeRef.current = userType;
    if (socketRef.current) {
      setupEventListeners(socketRef.current);
    }
  }, [userType, setupEventListeners]);

  /**
   * Connect to WebSocket
   */
  const connect = useCallback(() => {
    const token = getAccessToken();

    if (!token) {
      setError(new Error('No access token available'));
      return;
    }

    // If socket already exists and is connected, don't reconnect
    if (socketRef.current && socketRef.current.connected) {
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Create new socket connection
      const newSocket = createSocketConnection({ token });

      // Setup event listeners
      setupEventListeners(newSocket);

      // Store socket reference
      socketRef.current = newSocket;
      setSocket(newSocket);
    } catch (err) {
      setIsConnecting(false);
      setError(err as Error);
    }
  }, [setupEventListeners]);

  /**
   * Disconnect from WebSocket
   */
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      cleanupEventListeners(socketRef.current);
      disconnectSocket(socketRef.current);
      socketRef.current = null;
      setSocket(null);
      setIsConnected(false);
      setIsConnecting(false);
    }
  }, [cleanupEventListeners]);

  /**
   * Reconnect WebSocket
   */
  const reconnect = useCallback(() => {
    const token = getAccessToken();

    if (!token) {
      setError(new Error('No access token available'));
      return;
    }

    if (socketRef.current) {
      // Reconnect existing socket with new token
      reconnectSocket(socketRef.current, token);
    } else {
      // Create new connection
      connect();
    }
  }, [connect]);

  /**
   * Join room wrapper
   */
  const handleJoinRoom = useCallback(
    async (roomId: string): Promise<void> => {
      if (!socketRef.current) {
        throw new Error('Socket not connected');
      }

      try {
        await joinRoom(socketRef.current, roomId);
        activeRoomsRef.current.add(roomId);
      } catch (err) {
        activeRoomsRef.current.delete(roomId);
        throw err;
      }
    },
    []
  );

  /**
   * Leave room wrapper
   */
  const handleLeaveRoom = useCallback((roomId: string): void => {
    if (!socketRef.current) {
      return;
    }
    leaveRoom(socketRef.current, roomId);
    activeRoomsRef.current.delete(roomId);
  }, []);

  /**
   * Update message status wrapper
   */
  const handleUpdateMessageStatus = useCallback(
    (
      messageId: string,
      status: 'PENDING' | 'SENT' | 'DELIVERED' | 'READ'
    ): void => {
      if (!socketRef.current) {
        return;
      }
      updateMessageStatus(socketRef.current, messageId, status);
    },
    []
  );

  /**
   * Initialize connection on mount
   */
  useEffect(() => {
    // Connect on mount if token exists
    const token = getAccessToken();
    if (token) {
      connect();
    }

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  /**
   * Update connection status when socket changes
   */
  useEffect(() => {
    if (socket) {
      setIsConnected(socket.connected);
    } else {
      setIsConnected(false);
    }
  }, [socket]);

  return {
    socket,
    isConnected,
    isConnecting,
    error,
    joinRoom: handleJoinRoom,
    leaveRoom: handleLeaveRoom,
    updateMessageStatus: handleUpdateMessageStatus,
    reconnect,
    disconnect,
  };
};

