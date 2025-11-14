"use client";

import React from "react";
import { UserType } from "@/config/constants";
import { getUserTypeLabel } from "@/utils/user.utils";

interface UserFiltersProps {
  searchQuery: string;
  userType: UserType | undefined;
  approvedStatus: "approved" | "pending" | undefined;
  onSearchChange: (query: string) => void;
  onTypeChange: (type: UserType | undefined) => void;
  onApprovedStatusChange: (status: "approved" | "pending" | undefined) => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({
  searchQuery,
  userType,
  approvedStatus,
  onSearchChange,
  onTypeChange,
  onApprovedStatusChange,
}) => {
  const userTypes: UserType[] = ["patient", "doctor", "shop_keeper", "admin"];

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Search Input */}
      <div className="flex-1">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 placeholder-gray-500 transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400 dark:focus:border-brand-400"
        />
      </div>

      {/* Type Filter */}
      <div className="flex items-center gap-2">
        <select
          value={userType || ""}
          onChange={(e) => onTypeChange(e.target.value ? (e.target.value as UserType) : undefined)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-brand-400"
        >
          <option value="">All Types</option>
          {userTypes.map((type) => (
            <option key={type} value={type}>
              {getUserTypeLabel(type)}
            </option>
          ))}
        </select>
      </div>

      {/* Approval Status Filter */}
      <div className="flex items-center gap-2">
        <select
          value={approvedStatus || ""}
          onChange={(e) =>
            onApprovedStatusChange(
              e.target.value ? (e.target.value as "approved" | "pending") : undefined
            )
          }
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-brand-400"
        >
          <option value="">All Status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
        </select>
      </div>
    </div>
  );
};

export default UserFilters;

