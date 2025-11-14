"use client";

import React from "react";
import type { Statistics } from "@/types/admin.types";

interface UserTypeStatsProps {
  statistics: Statistics | null;
  isLoading?: boolean;
}

const UserTypeStats: React.FC<UserTypeStatsProps> = ({ statistics, isLoading }) => {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Users by Type
        </h3>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const userTypes = [
    { label: "Patients", value: statistics?.users?.by_type?.patient || 0, color: "bg-blue-500" },
    { label: "Doctors", value: statistics?.users?.by_type?.doctor || 0, color: "bg-green-500" },
    { label: "Shop Owners", value: statistics?.users?.by_type?.shop_owner || 0, color: "bg-purple-500" },
    { label: "Admins", value: statistics?.users?.by_type?.admin || 0, color: "bg-orange-500" },
  ];

  const total = userTypes.reduce((sum, type) => sum + type.value, 0);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        Users by Type
      </h3>
      <div className="space-y-3">
        {userTypes.map((type) => {
          const percentage = total > 0 ? (type.value / total) * 100 : 0;
          return (
            <div key={type.label} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {type.label}
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {type.value} ({percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className={`h-full ${type.color} transition-all duration-300`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserTypeStats;

