'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useSocket } from '@/hooks/useSocket';
import type { UserStatus } from '@/config/constants';
import type { UserStatusChangeEvent } from '@/types/socket.types';

type PresenceMap = Record<string, UserStatus>;

interface PresenceContextValue {
  statuses: PresenceMap;
  isOnline: (userId: string | undefined) => boolean;
  setInitialStatus: (userId: string, status: UserStatus) => void;
}

const PresenceContext = createContext<PresenceContextValue | undefined>(undefined);

export const PresenceProvider = ({ children }: { children: ReactNode }) => {
  const [statuses, setStatuses] = useState<PresenceMap>({});

  const updateStatus = useCallback((userId: string, status: UserStatus) => {
    setStatuses((prev) => {
      if (prev[userId] === status) {
        return prev;
      }
      return { ...prev, [userId]: status };
    });
  }, []);

  // Allow setting initial status (e.g., from conversation data)
  const setInitialStatus = useCallback((userId: string, status: UserStatus) => {
    setStatuses((prev) => {
      // Only set if not already set (don't override existing status)
      if (prev[userId] !== undefined) {
        return prev;
      }
      return { ...prev, [userId]: status };
    });
  }, []);

  useSocket(undefined, {
    onUserStatusChange: (event: UserStatusChangeEvent) => {
      updateStatus(event.user_id, event.status);
    },
    onConnect: () => {
      // When connected, we can assume current user is online
      // Other users' status will come from userStatusChange events
    },
  });

  const isOnline = useCallback(
    (userId: string | undefined) => {
      if (!userId) {
        return false;
      }
      // Return true if status is 'online', false otherwise (including undefined)
      return statuses[userId] === 'online';
    },
    [statuses]
  );

  return (
    <PresenceContext.Provider value={{ statuses, isOnline, setInitialStatus }}>
      {children}
    </PresenceContext.Provider>
  );
};

export const usePresence = () => {
  const context = useContext(PresenceContext);
  if (!context) {
    throw new Error('usePresence must be used within a PresenceProvider');
  }
  return context;
};

