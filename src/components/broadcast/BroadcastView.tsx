/**
 * Broadcast View Component
 * 
 * Displays a single broadcast in detail view.
 * Used for viewing broadcast details and actions.
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { PROTECTED_ROUTES } from '@/config/routes';
import { BROADCAST_STATUS_CONFIG } from '@/config/constants';
import Badge from '@/components/ui/badge/Badge';
import Button from '@/components/ui/button/Button';
import type { Broadcast } from '@/types/broadcast.types';

type BroadcastViewProps = {
  broadcast: Broadcast | null;
  isLoading?: boolean;
  onRespond?: (id: string) => void;
  onDelete?: (id: string) => void;
  canRespond?: boolean;
  canDelete?: boolean;
};

export default function BroadcastView({
  broadcast,
  isLoading = false,
  onRespond,
  onDelete,
  canRespond = false,
  canDelete = false,
}: BroadcastViewProps) {
  if (isLoading) {
    return (
      <div className="h-64 animate-pulse rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-800" />
    );
  }

  if (!broadcast) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 py-12 text-center dark:border-gray-700 dark:bg-gray-800/30">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Broadcast not found.
        </p>
      </div>
    );
  }

  const {
    id,
    message,
    status,
    patient,
    created_at,
    updated_at,
    assisted_by,
    conversation_id,
  } = broadcast;

  const statusConfig = BROADCAST_STATUS_CONFIG[status];
  const timeAgo = formatDistanceToNow(new Date(created_at), { addSuffix: true });
  const updatedAgo = formatDistanceToNow(new Date(updated_at), { addSuffix: true });

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-lg dark:border-gray-800 dark:bg-gray-900">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          {/* Patient Avatar */}
          <div className="relative inline-flex h-16 w-16 overflow-hidden rounded-full">
            <Image
              src={patient.avatar_url || patient.avatar || '/images/user/user-01.jpg'}
              alt={patient.name}
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Patient Info */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white/90">
              {patient.name}
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Created {timeAgo}
            </p>
            {updated_at !== created_at && (
              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                Updated {updatedAgo}
              </p>
            )}
          </div>
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
      <div className="mb-6">
        <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
          Message
        </h3>
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/30">
          <p className="text-sm leading-6 text-gray-700 dark:text-gray-300">
            {message || 'No message provided.'}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {status === 'open' && canRespond && onRespond && (
          <Button
            onClick={() => onRespond(id)}
            size="sm"
            className="bg-brand-500 hover:bg-brand-600"
          >
            Respond to Broadcast
          </Button>
        )}

        {status === 'assisted' && conversation_id && (
          <Link
            href={PROTECTED_ROUTES.CONVERSATION_DETAIL(conversation_id)}
            className="inline-flex items-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600"
          >
            View Conversation
          </Link>
        )}

        {canDelete && onDelete && (
          <Button
            onClick={() => onDelete(id)}
            size="sm"
            className="bg-error-500 hover:bg-error-600 text-white"
          >
            Delete Broadcast
          </Button>
        )}
      </div>
    </div>
  );
}

