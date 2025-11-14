"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from "@/config/routes";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { getUserTypeLabel } from "@/utils/user.utils";
import { useState, useEffect, useRef } from "react";

const nav_links = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
];

export default function LandingNavbar() {
  const { user, isAuthenticated, isLoading, error, logout } = useAuth();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isShopOwner = user?.type === "shop_keeper" || (user?.type as string) === "shop_owner";
  const userTypeLabel = user ? getUserTypeLabel(user.type) : "";

  // Handle loading timeout - if loading takes more than 3 seconds, show Sign In button
  useEffect(() => {
    if (isLoading) {
      // Clear any existing timeout
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      
      // Set timeout to show Sign In button after 3 seconds
      loadingTimeoutRef.current = setTimeout(() => {
        setShowSignIn(true);
      }, 3000);
    } else {
      // Loading finished, clear timeout and reset showSignIn
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
      setShowSignIn(false);
    }

    // Cleanup on unmount
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [isLoading]);

  // Also show Sign In if there's an error
  useEffect(() => {
    if (error) {
      setShowSignIn(true);
    }
  }, [error]);

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const handleNavigation = (href: string) => {
    router.push(href);
    closeDropdown();
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="absolute inset-x-0 top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-800/50">
      <div className="mx-auto flex max-w-(--breakpoint-2xl) flex-nowrap items-center justify-between gap-4 px-3 py-2.5 sm:px-4 sm:py-3 lg:px-6 lg:py-3">
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/images/logo/logo.png"
            alt="QuickMed Connect"
            width={40}
            height={40}
            className="h-8 w-8 object-contain dark:hidden sm:h-10 sm:w-10"
            priority
          />
          <Image
            src="/images/logo/logo-dark.svg"
            alt="QuickMed Connect"
            width={120}
            height={31}
            className="hidden h-8 w-auto object-contain dark:block sm:h-10"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 sm:gap-3 lg:flex">
          {nav_links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex-shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 font-medium transition-colors hover:bg-gray-100 hover:text-brand-500 dark:hover:bg-white/5 dark:hover:text-brand-400 sm:px-4 sm:py-2"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden flex-shrink-0 items-center gap-2 sm:gap-3 lg:flex">
          {isLoading && !showSignIn ? (
            // Loading state (only show for first 3 seconds)
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
          ) : isAuthenticated && user && !showSignIn ? (
            // Authenticated state - Custom profile dropdown
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDropdownOpen(!isDropdownOpen);
                }}
                className="dropdown-toggle flex items-center text-gray-700 transition hover:text-brand-500 dark:text-gray-300"
              >
                <span className="mr-3 h-11 w-11 overflow-hidden rounded-full">
                  <Image
                    width={44}
                    height={44}
                    src={user.avatar_url || user.avatar || "/images/user/owner.jpg"}
                    alt={user.name || "User"}
                  />
                </span>
                {/* Name and User Type (desktop only) */}
                <div className="mr-1 hidden flex-col items-start sm:flex">
                  <span className="font-medium text-theme-sm">
                    {user.name || "User"}
                  </span>
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                    {userTypeLabel}
                  </span>
                </div>
                <svg
                  className={`stroke-gray-500 transition-transform duration-200 dark:stroke-gray-400 ${
                    isDropdownOpen ? "rotate-180" : ""
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

              {/* Custom dropdown menu */}
              {isDropdownOpen && (
                <Dropdown
                  isOpen={isDropdownOpen}
                  onClose={closeDropdown}
                  className="absolute right-0 mt-2 flex w-[200px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-900"
                >
                  {/* User Info Header */}
                  <div className="mb-3 border-b border-gray-200 pb-3 dark:border-gray-800">
                    <span className="block font-medium text-sm text-gray-800 dark:text-gray-200">
                      {user.name || "User"}
                    </span>
                    {user.email && (
                      <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">
                        {user.email}
                      </span>
                    )}
                    <span className="mt-1 block text-xs font-bold text-gray-600 dark:text-gray-400">
                      {userTypeLabel}
                    </span>
                  </div>
                  <ul className="flex flex-col gap-1">
                    <li>
                      <DropdownItem
                        onClick={() => handleNavigation("/profile")}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-200"
                      >
                        Profile
                      </DropdownItem>
                    </li>
                    <li>
                      <DropdownItem
                        onClick={() => handleNavigation(PROTECTED_ROUTES.CONVERSATIONS)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-200"
                      >
                        Inbox
                      </DropdownItem>
                    </li>
                    {isShopOwner && (
                      <li>
                        <DropdownItem
                          onClick={() => handleNavigation(PROTECTED_ROUTES.PRESCRIPTIONS_INBOX)}
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-200"
                        >
                          Prescriptions
                        </DropdownItem>
                      </li>
                    )}
                  </ul>
                  {/* Logout Button */}
                  <DropdownItem
                    onClick={handleLogout}
                    className="mt-3 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-gray-100"
                  >
                    {isLoggingOut ? "Logging out..." : "Sign out"}
                  </DropdownItem>
                </Dropdown>
              )}
            </div>
          ) : (
            // Not authenticated state
            <div className="flex items-center gap-2">
              <Link
                href={PUBLIC_ROUTES.LOGIN}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:border-brand-200 hover:text-brand-500 dark:border-gray-700 dark:text-gray-300 dark:hover:border-brand-500/40 dark:hover:text-brand-300 sm:px-4 sm:py-2"
              >
                Sign In
              </Link>
              <Link
                href={PUBLIC_ROUTES.REGISTER}
                className="gradient-button rounded-lg px-3 py-1.5 text-sm font-semibold text-white sm:px-4 sm:py-2"
              >
                Join Now
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Auth Buttons */}
        <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3 lg:hidden">
          {isLoading && !showSignIn ? (
            // Loading state (only show for first 3 seconds)
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
          ) : isAuthenticated && user && !showSignIn ? (
            // Authenticated state - Mobile profile dropdown
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDropdownOpen(!isDropdownOpen);
                }}
                className="flex items-center text-gray-700 transition hover:text-brand-500 dark:text-gray-300"
              >
                <span className="h-11 w-11 overflow-hidden rounded-full">
                  <Image
                    width={44}
                    height={44}
                    src={user.avatar_url || user.avatar || "/images/user/owner.jpg"}
                    alt={user.name || "User"}
                  />
                </span>
              </button>

              {/* Mobile dropdown menu */}
              {isDropdownOpen && (
                <Dropdown
                  isOpen={isDropdownOpen}
                  onClose={closeDropdown}
                  className="absolute right-0 mt-2 flex w-[200px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-900"
                >
                  {/* User Info Header */}
                  <div className="mb-3 border-b border-gray-200 pb-3 dark:border-gray-800">
                    <span className="block font-medium text-sm text-gray-800 dark:text-gray-200">
                      {user.name || "User"}
                    </span>
                    {user.email && (
                      <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">
                        {user.email}
                      </span>
                    )}
                    <span className="mt-1 block text-xs font-bold text-gray-600 dark:text-gray-400">
                      {userTypeLabel}
                    </span>
                  </div>
                  <ul className="flex flex-col gap-1">
                    <li>
                      <DropdownItem
                        onClick={() => handleNavigation("/profile")}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-200"
                      >
                        Profile
                      </DropdownItem>
                    </li>
                    <li>
                      <DropdownItem
                        onClick={() => handleNavigation(PROTECTED_ROUTES.CONVERSATIONS)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-200"
                      >
                        Inbox
                      </DropdownItem>
                    </li>
                    {isShopOwner && (
                      <li>
                        <DropdownItem
                          onClick={() => handleNavigation(PROTECTED_ROUTES.PRESCRIPTIONS_INBOX)}
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-200"
                        >
                          Prescriptions
                        </DropdownItem>
                      </li>
                    )}
                  </ul>
                  {/* Logout Button */}
                  <DropdownItem
                    onClick={handleLogout}
                    className="mt-3 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-gray-100"
                  >
                    {isLoggingOut ? "Logging out..." : "Sign out"}
                  </DropdownItem>
                </Dropdown>
              )}
            </div>
          ) : (
            // Not authenticated state
            <div className="flex items-center gap-2">
              <Link
                href={PUBLIC_ROUTES.LOGIN}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:border-brand-200 hover:text-brand-500 dark:border-gray-700 dark:text-gray-300 dark:hover:border-brand-500/40 dark:hover:text-brand-300 sm:px-4 sm:py-2"
              >
                Sign In
              </Link>
              <Link
                href={PUBLIC_ROUTES.REGISTER}
                className="gradient-button rounded-lg px-3 py-1.5 text-sm font-semibold text-white sm:px-4 sm:py-2"
              >
                Join Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

