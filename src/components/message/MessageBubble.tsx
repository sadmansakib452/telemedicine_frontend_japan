/**
 * Message Bubble Component
 * 
 * Displays a single message bubble in the chat window.
 * Supports text messages and prescription messages.
 */

'use client';

import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import PrescriptionMessage from '@/components/prescriptions/PrescriptionMessage';
import type { MessageListItem } from '@/types/message.types';

type MessageBubbleProps = {
  message: MessageListItem;
  isOwn: boolean; // True if message is from current user
  currentUserId: string;
  onViewPrescription?: (prescriptionId: string) => void;
};

export default function MessageBubble({
  message,
  isOwn,
  currentUserId,
  onViewPrescription,
}: MessageBubbleProps) {
  const { id, message: text, message_type, sender, created_at, status } = message;
  const timeAgo = formatDistanceToNow(new Date(created_at), { addSuffix: true });

  // Check if it's a prescription message
  const isPrescription = message_type === 'prescription';

  return (
    <div
      className={`flex items-end gap-2 ${
        isOwn ? 'flex-row-reverse text-right' : ''
      }`}
    >
      {/* Avatar */}
      {!isOwn && (
        <div className="inline-flex h-9 w-9 flex-shrink-0 overflow-hidden rounded-full">
          <Image
            src={sender.avatar_url || sender.avatar || '/images/user/user-01.jpg'}
            alt={sender.name}
            width={36}
            height={36}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Message Content */}
      <div className={`max-w-[70%] sm:max-w-lg ${isOwn ? 'text-right' : ''}`}>
        {/* Message Bubble */}
        {isPrescription ? (
          /* Prescription Message */
          <PrescriptionMessage
            message={message}
            isOwn={isOwn}
            onViewPrescription={onViewPrescription}
          />
        ) : (
          /* Text Message */
          <div
            className={`inline-flex rounded-2xl px-4 py-2.5 text-sm leading-5 shadow-theme-sm ${
              isOwn
                ? 'bg-brand-500 text-white'
                : 'bg-white text-gray-700 dark:bg-gray-900 dark:text-gray-200'
            }`}
          >
            <div className="whitespace-pre-wrap break-words">{text || ''}</div>
          </div>
        )}

        {/* Message Meta */}
        <div className={`mt-1.5 flex items-center gap-1.5 ${isOwn ? 'justify-end' : ''}`}>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {timeAgo}
          </span>
          {isOwn && (
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {status === 'READ' ? '✓✓' : status === 'DELIVERED' ? '✓✓' : status === 'SENT' ? '✓' : '○'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

