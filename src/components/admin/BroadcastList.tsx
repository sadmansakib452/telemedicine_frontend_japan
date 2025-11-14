"use client";

import React from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { getUserTypeLabel } from "@/utils/user.utils";
import type { AdminBroadcast } from "@/types/admin.types";
import { MailIcon } from "@/icons/index";

interface BroadcastListProps {
  broadcasts: AdminBroadcast[];
  isLoading?: boolean;
  count?: number;
}

const BroadcastList: React.FC<BroadcastListProps> = ({
  broadcasts,
  isLoading = false,
  count,
}) => {
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Unknown";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "assisted":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "closed":
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  if (isLoading && broadcasts.length === 0) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (broadcasts.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <MailIcon className="h-6 w-6 text-gray-400" />
        </div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          No broadcasts found
        </p>
        {count !== undefined && count > 0 && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
            Showing {broadcasts.length} of {count} broadcasts
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {broadcasts.map((broadcast) => {
        const patient = broadcast.patient;
        const messagePreview = broadcast.message
          ? broadcast.message.length > 100
            ? `${broadcast.message.substring(0, 100)}...`
            : broadcast.message
          : "No message";

        return (
          <div
            key={broadcast.id}
            className="rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-brand-300 hover:shadow-theme-xs dark:border-gray-800 dark:bg-gray-900 dark:hover:border-brand-500/40"
          >
            <div className="flex items-start gap-4">
              {/* Patient Avatar */}
              <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
                <Image
                  src={
                    patient.avatar_url ||
                    patient.avatar ||
                    "/images/user/owner.jpg"
                  }
                  alt={patient.name}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Broadcast Info */}
              <div className="flex flex-1 items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                      {patient.name}
                    </h4>
                    <span className="flex-shrink-0 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                      Broadcast
                    </span>
                    <span
                      className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(
                        broadcast.status
                      )}`}
                    >
                      {broadcast.status}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <span>{messagePreview}</span>
                    <span className="text-gray-400 dark:text-gray-600">•</span>
                    <span>{formatDate(broadcast.created_at)}</span>
                  </div>
                  {broadcast.assisted_by && (
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Assisted by doctor ID: {broadcast.assisted_by}
                    </div>
                  )}
                  {broadcast.conversation_id && (
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Conversation ID: {broadcast.conversation_id}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BroadcastList;

