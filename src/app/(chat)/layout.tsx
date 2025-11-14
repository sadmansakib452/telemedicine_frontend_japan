"use client";

import React from "react";
import ChatHeader from "@/components/chat/ChatHeader";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 transition-colors dark:bg-gray-900">
      <ChatHeader />
      <main className="min-h-[calc(100vh-4rem)]">{children}</main>
    </div>
  );
}
