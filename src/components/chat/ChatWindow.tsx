"use client";

import Image from "next/image";
import { PaperPlaneIcon } from "@/icons";
import type { Conversation } from "./InboxWorkspace";

type ChatWindowProps = {
  conversation: Conversation;
  onBack: () => void;
};

export default function ChatWindow({ conversation, onBack }: ChatWindowProps) {
  const { name, role, status, avatar, messages } = conversation;

  return (
    <section className="flex h-full w-full flex-col overflow-hidden rounded-[32px] border border-gray-200 bg-white shadow-theme-xl dark:border-gray-800 dark:bg-gray-900">
      <header className="flex items-center gap-4 border-b border-gray-200 px-6 py-5 dark:border-gray-800 sm:px-8 sm:py-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-brand-200 hover:text-brand-500 dark:border-gray-800 dark:text-gray-400 dark:hover:border-brand-500/30 dark:hover:text-brand-300 lg:hidden"
          aria-label="Back to conversation list"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.25 3.75L6.75 8.25L11.25 12.75"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <span className="relative inline-flex h-12 w-12 overflow-hidden rounded-full">
          <Image
            src={avatar}
            alt={name}
            width={48}
            height={48}
            className="h-full w-full object-cover"
          />
          <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-success-500 dark:border-gray-900" />
        </span>
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white/90 sm:text-lg">
            {name}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {role} • {status}
          </p>
        </div>
      </header>

      <div className="flex-1 space-y-6 overflow-y-auto bg-gray-50 px-5 py-6 custom-scrollbar dark:bg-gray-900/40 sm:px-8">
        {messages.map((message) => {
          const isOutgoing = message.variant === "outgoing";
          return (
            <div
              key={message.id}
              className={`flex items-end gap-3 ${
                isOutgoing ? "flex-row-reverse text-right" : ""
              }`}
            >
              <span className="inline-flex h-10 w-10 overflow-hidden rounded-full sm:h-12 sm:w-12">
                <Image
                  src={message.avatar}
                  alt={message.author}
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                />
              </span>
              <div className="max-w-2xl">
                <div
                  className={`inline-flex rounded-3xl px-4 py-3 text-sm leading-6 sm:px-5 sm:py-4 ${
                    isOutgoing
                      ? "bg-brand-500 text-white shadow-theme-sm"
                      : "bg-white text-gray-700 shadow-theme-sm dark:bg-gray-900 dark:text-gray-200"
                  }`}
                >
                  {message.text}
                </div>
                <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                  {message.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <footer className="border-t border-gray-200 px-5 py-5 dark:border-gray-800 sm:px-8">
        <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-white px-5 py-3 shadow-theme-xs focus-within:border-brand-300 focus-within:ring-2 focus-within:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900">
          <input
            type="text"
            placeholder="Type a message"
            className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400 dark:text-gray-200 dark:placeholder:text-gray-500"
          />
          <button className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-500 text-white shadow-theme-xs transition hover:bg-brand-600">
            <PaperPlaneIcon className="h-4 w-4" />
          </button>
        </div>
      </footer>
    </section>
  );
}

