/**
 * Broadcast List Component
 * 
 * Displays a list of broadcasts.
 * Used for both doctor inbox (open broadcasts) and patient's own broadcasts.
 */

'use client';

import BroadcastCard from './BroadcastCard';
import type { BroadcastListItem } from '@/types/broadcast.types';

type BroadcastListProps = {
  broadcasts: BroadcastListItem[];
  isLoading?: boolean;
  onBroadcastClick?: (id: string) => void;
};

export default function BroadcastList({
  broadcasts,
  isLoading = false,
  onBroadcastClick,
}: BroadcastListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-800"
          />
        ))}
      </div>
    );
  }

  if (broadcasts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 py-12 text-center dark:border-gray-700 dark:bg-gray-800/30">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          No broadcasts found.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {broadcasts.map((broadcast) => (
        <BroadcastCard
          key={broadcast.id}
          broadcast={broadcast}
          onClick={onBroadcastClick}
        />
      ))}
    </div>
  );
}

