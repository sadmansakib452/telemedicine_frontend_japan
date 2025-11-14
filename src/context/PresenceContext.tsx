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

  useSocket(undefined, {
    onUserStatusChange: (event: UserStatusChangeEvent) => {
      updateStatus(event.user_id, event.status);
    },
  });

  const isOnline = useCallback(
    (userId: string | undefined) => {
      if (!userId) {
        return false;
      }
      return statuses[userId] === 'online';
    },
    [statuses]
  );

  return (
    <PresenceContext.Provider value={{ statuses, isOnline }}>
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

