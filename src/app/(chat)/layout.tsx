"use client";

import React from "react";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 transition-colors dark:bg-gray-900">
      {children}
    </div>
  );
}
