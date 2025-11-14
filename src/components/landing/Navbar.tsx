"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from "@/config/routes";
import { RouteHelpers } from "@/config/routes";

const nav_links = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
];

export default function LandingNavbar() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  // Get inbox route based on user type
  const getInboxRoute = () => {
    if (!user) return PROTECTED_ROUTES.CONVERSATIONS;
    return RouteHelpers.getRedirectRoute(user.type);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-(--breakpoint-2xl) items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-3">
          <Image
            src="/images/logo/logo.svg"
            alt="QuickMed Connect"
            width={150}
            height={40}
            className="dark:hidden"
            priority
          />
          <Image
            src="/images/logo/logo-dark.svg"
            alt="QuickMed Connect"
            width={150}
            height={40}
            className="hidden dark:block"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-gray-700 dark:text-gray-300 lg:flex">
          {nav_links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-brand-500 dark:hover:text-brand-400"
            >
              {link.label}
            </Link>
          ))}
          {/* Show Inbox link if authenticated */}
          {isAuthenticated && !isLoading && (
            <Link
              href={getInboxRoute()}
              className="transition-colors hover:text-brand-500 dark:hover:text-brand-400"
            >
              Inbox
            </Link>
          )}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden items-center gap-3 lg:flex">
          {isLoading ? (
            // Loading state
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
          ) : isAuthenticated && user ? (
            // Authenticated state
            <>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {user.name}
              </span>
              <Link
                href={getInboxRoute()}
                className="rounded-lg px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:text-brand-500 dark:text-gray-300 dark:hover:text-brand-400"
              >
                Inbox
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white shadow-theme-xs transition-colors hover:bg-brand-600 dark:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            // Not authenticated state
            <>
              <Link
                href={PUBLIC_ROUTES.LOGIN}
                className="rounded-lg px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:text-brand-500 dark:text-gray-300 dark:hover:text-brand-400"
              >
                Sign In
              </Link>
              <Link
                href={PUBLIC_ROUTES.REGISTER}
                className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white shadow-theme-xs transition-colors hover:bg-brand-600 dark:text-white"
              >
                Join Now
              </Link>
            </>
          )}
        </div>

        {/* Mobile Auth Buttons */}
        <div className="flex items-center gap-3 lg:hidden">
          {isLoading ? (
            // Loading state
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
          ) : isAuthenticated && user ? (
            // Authenticated state
            <>
              <Link
                href={getInboxRoute()}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-brand-200 hover:text-brand-500 dark:border-gray-800 dark:text-gray-300 dark:hover:border-brand-500/30 dark:hover:text-brand-400"
              >
                Inbox
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-theme-xs transition-colors hover:bg-brand-600 dark:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            // Not authenticated state
            <>
              <Link
                href={PUBLIC_ROUTES.LOGIN}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-brand-200 hover:text-brand-500 dark:border-gray-800 dark:text-gray-300 dark:hover:border-brand-500/30 dark:hover:text-brand-400"
              >
                Sign In
              </Link>
              <Link
                href={PUBLIC_ROUTES.REGISTER}
                className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-theme-xs transition-colors hover:bg-brand-600 dark:text-white"
              >
                Join
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

