"use client";

import React from "react";
import { PieChartIcon, UserIcon, ChatIcon, DocsIcon, MailIcon } from "@/icons/index";
import type { Statistics } from "@/types/admin.types";

interface StatisticsCardsProps {
  statistics: Statistics | null;
  isLoading?: boolean;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, isLoading }) => {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="mt-2 h-8 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="h-12 w-12 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    );
  }

  // Get background color class based on text color
  const getBgColor = (textColor: string) => {
    if (textColor.includes('blue')) return 'bg-blue-100 dark:bg-blue-900/30';
    if (textColor.includes('green')) return 'bg-green-100 dark:bg-green-900/30';
    if (textColor.includes('purple')) return 'bg-purple-100 dark:bg-purple-900/30';
    if (textColor.includes('orange')) return 'bg-orange-100 dark:bg-orange-900/30';
    if (textColor.includes('yellow')) return 'bg-yellow-100 dark:bg-yellow-900/30';
    if (textColor.includes('red')) return 'bg-red-100 dark:bg-red-900/30';
    if (textColor.includes('indigo')) return 'bg-indigo-100 dark:bg-indigo-900/30';
    if (textColor.includes('teal')) return 'bg-teal-100 dark:bg-teal-900/30';
    return 'bg-gray-100 dark:bg-gray-900/30';
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-theme-xs transition-all hover:shadow-theme-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className={`mt-2 text-2xl font-bold ${color}`}>{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${getBgColor(color)}`}>
          <div className={color}>{icon}</div>
        </div>
      </div>
    </div>
  );
};

const StatisticsCards: React.FC<StatisticsCardsProps> = ({ statistics, isLoading }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {/* Total Users */}
      <StatCard
        title="Total Users"
        value={statistics?.users?.total || 0}
        icon={<UserIcon />}
        color="text-blue-600 dark:text-blue-400"
        isLoading={isLoading}
      />

      {/* Total Conversations */}
      <StatCard
        title="Total Conversations"
        value={statistics?.conversations?.total || 0}
        icon={<ChatIcon />}
        color="text-green-600 dark:text-green-400"
        isLoading={isLoading}
      />

      {/* Total Prescriptions */}
      <StatCard
        title="Total Prescriptions"
        value={statistics?.prescriptions?.total || 0}
        icon={<DocsIcon />}
        color="text-purple-600 dark:text-purple-400"
        isLoading={isLoading}
      />

      {/* Total Broadcasts */}
      <StatCard
        title="Total Broadcasts"
        value={statistics?.broadcasts?.total || 0}
        icon={<MailIcon />}
        color="text-orange-600 dark:text-orange-400"
        isLoading={isLoading}
      />

      {/* Pending Verifications */}
      <StatCard
        title="Pending Verifications"
        value={statistics?.pending_verifications?.total || 0}
        icon={<PieChartIcon />}
        color="text-yellow-600 dark:text-yellow-400"
        isLoading={isLoading}
      />

      {/* Open Broadcasts */}
      <StatCard
        title="Open Broadcasts"
        value={statistics?.broadcasts?.open || 0}
        icon={<MailIcon />}
        color="text-red-600 dark:text-red-400"
        isLoading={isLoading}
      />

      {/* Assisted Broadcasts */}
      <StatCard
        title="Assisted Broadcasts"
        value={statistics?.broadcasts?.assisted || 0}
        icon={<MailIcon />}
        color="text-indigo-600 dark:text-indigo-400"
        isLoading={isLoading}
      />

      {/* Approved Users */}
      <StatCard
        title="Approved Users"
        value={statistics?.approved_users?.total || 0}
        icon={<UserIcon />}
        color="text-teal-600 dark:text-teal-400"
        isLoading={isLoading}
      />
    </div>
  );
};

export default StatisticsCards;

