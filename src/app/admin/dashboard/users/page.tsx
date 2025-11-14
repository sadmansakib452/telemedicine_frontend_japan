"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import UserList from "@/components/admin/UserList";
import UserFilters from "@/components/admin/UserFilters";
import type { UserType } from "@/config/constants";

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [userType, setUserType] = useState<UserType | undefined>(undefined);
  const [approvedStatus, setApprovedStatus] = useState<"approved" | "pending" | undefined>(undefined);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    users,
    pendingVerifications,
    isLoading,
    isLoadingPending,
    error,
    count,
    refetch,
    approve,
    reject,
  } = useAdminUsers({
    q: debouncedSearchQuery || undefined,
    type: userType,
    approved: approvedStatus,
    limit: 20,
  });

  const handleApprove = useCallback(
    async (id: string) => {
      try {
        await approve(id);
        await refetch();
      } catch (err) {
        console.error("Failed to approve user:", err);
      }
    },
    [approve, refetch]
  );

  const handleReject = useCallback(
    async (id: string) => {
      try {
        await reject(id);
        await refetch();
      } catch (err) {
        console.error("Failed to reject user:", err);
      }
    },
    [reject, refetch]
  );

  if (error) {
    return (
      <div className="flex h-full flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            User Management
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage users and verifications
          </p>
        </div>

        <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-red-300 bg-red-50 p-6 dark:border-red-700 dark:bg-red-900/30">
          <div className="text-center">
            <p className="text-sm font-medium text-red-600 dark:text-red-400">
              Error loading users: {error.message}
            </p>
            <button
              onClick={() => refetch()}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          User Management
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Manage users and verifications ({count} users)
        </p>
      </div>

      {/* Filters */}
      <UserFilters
        searchQuery={searchQuery}
        userType={userType}
        approvedStatus={approvedStatus}
        onSearchChange={setSearchQuery}
        onTypeChange={setUserType}
        onApprovedStatusChange={setApprovedStatus}
      />

      {/* Pending Verifications */}
      {pendingVerifications.length > 0 && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/30">
          <h3 className="mb-3 text-sm font-semibold text-yellow-900 dark:text-yellow-300">
            Pending Verifications ({pendingVerifications.length})
          </h3>
          <UserList
            users={pendingVerifications}
            isLoading={isLoadingPending}
            onApprove={handleApprove}
            onReject={handleReject}
            showActions={true}
          />
        </div>
      )}

      {/* User List */}
      <div className="flex-1 overflow-y-auto">
        <UserList
          users={users}
          isLoading={isLoading}
          onApprove={handleApprove}
          onReject={handleReject}
          showActions={approvedStatus === "pending"}
        />
      </div>
    </div>
  );
}

