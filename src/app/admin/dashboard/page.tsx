"use client";

import React from "react";
import { useAdminStatistics } from "@/hooks/useAdminStatistics";
import StatisticsCards from "@/components/admin/StatisticsCards";
import UserTypeStats from "@/components/admin/UserTypeStats";

export default function AdminDashboardPage() {
  const { statistics, isLoading, error, refetch } = useAdminStatistics();

  if (error) {
    return (
      <div className="flex h-full flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            System monitoring and user verification
          </p>
        </div>

        <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-red-300 bg-red-50 p-6 dark:border-red-700 dark:bg-red-900/30">
          <div className="text-center">
            <p className="text-sm font-medium text-red-600 dark:text-red-400">
              Error loading statistics: {error.message}
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
          Admin Dashboard
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          System monitoring and user verification
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="flex flex-col gap-6">
        <StatisticsCards statistics={statistics} isLoading={isLoading} />
        
        {/* User Type Statistics */}
        {statistics && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <UserTypeStats statistics={statistics} isLoading={isLoading} />
            
            {/* Pending Verifications Summary */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Pending Verifications
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Doctors
                  </span>
                  <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                    {statistics.pending_verifications?.by_type?.doctor || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Shop Owners
                  </span>
                  <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                    {statistics.pending_verifications?.by_type?.shop_owner || 0}
                  </span>
                </div>
                <div className="mt-4 border-t border-gray-200 pt-3 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      Total
                    </span>
                    <span className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                      {statistics.pending_verifications?.total || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

