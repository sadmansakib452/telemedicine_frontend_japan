"use client";

import React from "react";
import ChatHeader from "@/components/chat/ChatHeader";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50 transition-colors dark:bg-gray-900">
      <ChatHeader />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
