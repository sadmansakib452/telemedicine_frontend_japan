"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useAuth } from "@/hooks/useAuth";
import { getUserTypeLabel } from "@/utils/user.utils";

export default function UserDropdown() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!user) {
    return null;
  }

  const toggleDropdown = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const displayName = user.name || "User";
  const email = user.email || "—";
  const avatarSrc = user.avatar_url || user.avatar || "/images/user/owner.jpg";
  const userTypeLabel = getUserTypeLabel(user.type);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 transition hover:text-brand-500 dark:text-gray-300"
      >
        <span className="mr-3 h-11 w-11 overflow-hidden rounded-full">
          <Image width={44} height={44} src={avatarSrc} alt={displayName} />
        </span>

        {/* Name and User Type (desktop only) */}
        <div className="mr-1 hidden flex-col items-start sm:flex">
          <span className="font-medium text-theme-sm">
            {displayName}
          </span>
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
            {userTypeLabel}
          </span>
        </div>

        <svg
          className={`stroke-gray-500 transition-transform duration-200 dark:stroke-gray-400 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-900"
      >
        <div>
          <span className="block font-medium text-gray-800 text-theme-sm dark:text-gray-200">
            {displayName}
          </span>
          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
            {email}
          </span>
          <span className="mt-1 block text-xs font-bold text-gray-600 dark:text-gray-400">
            {userTypeLabel}
          </span>
        </div>

        <ul className="flex flex-col gap-1 border-b border-gray-200 pt-4 pb-3 dark:border-gray-800">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href="/profile"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-theme-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-200"
            >
              Profile
            </DropdownItem>
          </li>
        </ul>

        <DropdownItem
          onClick={handleLogout}
          onItemClick={closeDropdown}
          className="mt-3 flex items-center gap-3 rounded-lg px-3 py-2 text-theme-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-gray-100"
        >
          {isLoggingOut ? "Logging out..." : "Sign out"}
        </DropdownItem>
      </Dropdown>
    </div>
  );
}
