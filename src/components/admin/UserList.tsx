"use client";

import React, { useState } from "react";
import Image from "next/image";
import { getUserTypeLabel } from "@/utils/user.utils";
import type { AdminUser } from "@/types/admin.types";
import { CheckLineIcon, CloseLineIcon } from "@/icons/index";

interface UserListProps {
  users: AdminUser[];
  isLoading?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  showActions?: boolean;
}

const UserList: React.FC<UserListProps> = ({
  users,
  isLoading = false,
  onApprove,
  onReject,
  showActions = false,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
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

  if (users.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          No users found
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {users.map((user) => (
        <div
          key={user.id}
          className="rounded-lg border border-gray-200 bg-white p-4 transition-all hover:shadow-theme-xs dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
              <Image
                src={user.avatar_url || user.avatar || "/images/user/owner.jpg"}
                alt={user.name}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>

            {/* User Info */}
            <div className="flex flex-1 items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                    {user.name}
                  </h4>
                  {user.approved_at ? (
                    <span className="flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      Approved
                    </span>
                  ) : (
                    <span className="flex-shrink-0 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                      Pending
                    </span>
                  )}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <span className="truncate">{user.email}</span>
                  <span className="text-gray-400 dark:text-gray-600">•</span>
                  <span>{getUserTypeLabel(user.type)}</span>
                  <span className="text-gray-400 dark:text-gray-600">•</span>
                  <span>Joined {formatDate(user.created_at)}</span>
                </div>
              </div>

              {/* Actions */}
              {showActions && !user.approved_at && onApprove && onReject && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onApprove(user.id)}
                    className="flex items-center gap-1 rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 transition hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
                    title="Approve user"
                  >
                    <CheckLineIcon />
                    Approve
                  </button>
                  <button
                    onClick={() => onReject(user.id)}
                    className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                    title="Reject user"
                  >
                    <CloseLineIcon />
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;

