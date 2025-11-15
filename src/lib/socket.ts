/**
 * WebSocket Client Library
 * 
 * Socket.IO client setup with JWT authentication and reconnection logic.
 * Handles connection, authentication, and reconnection with exponential backoff.
 */

import { io, Socket } from 'socket.io-client';
import { WS_URL, WS_RECONNECT_ATTEMPTS, WS_RECONNECT_DELAY } from '@/config/env';
import { getAccessToken } from '@/utils/token';
import { WS_EVENTS } from '@/config/constants';
import type { SocketConnectionOptions } from '@/types/socket.types';

let socketInstance: Socket | null = null;

const createNewConnection = (options: SocketConnectionOptions): Socket => {
  const { token, transports = ['websocket', 'polling'] } = options;

  const socket = io(WS_URL, {
    auth: {
      token,
    },
    transports,
    reconnection: true,
    reconnectionAttempts: WS_RECONNECT_ATTEMPTS,
    reconnectionDelay: WS_RECONNECT_DELAY,
    reconnectionDelayMax: 5000,
    timeout: 20000,
  });

  socket.on(WS_EVENTS.CONNECT, () => {
    console.log('WebSocket connected');
  });

  socket.on(WS_EVENTS.DISCONNECT, (reason: string) => {
    console.log('WebSocket disconnected:', reason);
  });

  socket.on(WS_EVENTS.CONNECT_ERROR, (error: Error) => {
    console.error('WebSocket connection error:', error);
  });

  return socket;
};

/**
 * Create Socket.IO connection
 * 
 * @param options Connection options including token
 * @returns Socket.IO instance
 */
export const createSocketConnection = (
  options: SocketConnectionOptions
): Socket => {
  if (socketInstance) {
    if (!socketInstance.connected) {
      socketInstance.connect();
    }
    return socketInstance;
  }

  socketInstance = createNewConnection(options);
  return socketInstance;
};

/**
 * Get Socket.IO connection with current token
 * 
 * @returns Socket.IO instance or null if no token
 */
export const getSocketConnection = (): Socket | null => {
  const token = getAccessToken();

  if (!token) {
    return null;
  }

  return createSocketConnection({ token });
};

/**
 * Reconnect Socket.IO with new token
 * 
 * @param socket Existing socket instance
 * @param newToken New JWT token
 */
export const reconnectSocket = (socket: Socket, newToken: string): void => {
  const targetSocket = socket || socketInstance;

  if (!targetSocket) {
    socketInstance = createNewConnection({ token: newToken });
    return;
  }

  targetSocket.auth = { token: newToken };
  targetSocket.connect();
  socketInstance = targetSocket;
};

/**
 * Disconnect Socket.IO connection
 * 
 * @param socket Socket instance to disconnect
 */
export const disconnectSocket = (socket: Socket | null): void => {
  const targetSocket = socket || socketInstance;

  if (targetSocket && targetSocket.connected) {
    targetSocket.disconnect();
  }

  socketInstance = null;
};

