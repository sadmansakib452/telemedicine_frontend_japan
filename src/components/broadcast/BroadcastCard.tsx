/**
 * Broadcast Card Component
 * 
 * Displays a single broadcast card in the broadcast list.
 * Used for both doctor inbox and patient's own broadcasts.
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { PROTECTED_ROUTES } from '@/config/routes';
import { BROADCAST_STATUS_CONFIG } from '@/config/constants';
import type { BroadcastListItem } from '@/types/broadcast.types';
import Badge from '@/components/ui/badge/Badge';

type BroadcastCardProps = {
  broadcast: BroadcastListItem;
  onClick?: (id: string) => void;
};

export default function BroadcastCard({
  broadcast,
  onClick,
}: BroadcastCardProps) {
  const {
    id,
    message,
    status,
    patient,
    created_at,
    assisted_by,
    conversation_id,
  } = broadcast;

  const statusConfig = BROADCAST_STATUS_CONFIG[status];
  const timeAgo = formatDistanceToNow(new Date(created_at), { addSuffix: true });

  const handleClick = () => {
    if (onClick) {
      onClick(id);
    }
  };

  return (
    <div
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm transition hover:border-brand-200 hover:shadow-theme-md dark:border-gray-800 dark:bg-gray-900"
      onClick={handleClick}
    >
      <div className="flex items-start gap-4">
        {/* Patient Avatar */}
        <div className="relative inline-flex h-12 w-12 overflow-hidden rounded-full">
          <Image
            src={patient.avatar_url || patient.avatar || '/images/user/user-01.jpg'}
            alt={patient.name}
            width={48}
            height={48}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Broadcast Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white/90">
                {patient.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {timeAgo}
              </p>
            </div>

            {/* Status Badge */}
            <Badge
              className={`${
                status === 'open'
                  ? 'bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-400'
                  : status === 'assisted'
                  ? 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                  : 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              }`}
            >
              {statusConfig.label}
            </Badge>
          </div>

          {/* Broadcast Message */}
          {message && (
            <p className="mt-3 text-sm leading-6 text-gray-700 dark:text-gray-300">
              {message}
            </p>
          )}

          {/* Actions */}
          {status === 'open' && (
            <div className="mt-4 flex items-center gap-3">
              <Link
                href={PROTECTED_ROUTES.BROADCAST_DETAIL(id)}
                className="inline-flex items-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600"
                onClick={(e) => e.stopPropagation()}
              >
                View Details
              </Link>
            </div>
          )}

          {status === 'assisted' && conversation_id && (
            <div className="mt-4">
              <Link
                href={PROTECTED_ROUTES.CONVERSATION_DETAIL(conversation_id)}
                className="inline-flex items-center text-sm font-medium text-brand-500 transition hover:text-brand-600 dark:text-brand-400"
                onClick={(e) => e.stopPropagation()}
              >
                View Conversation →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

