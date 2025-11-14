"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from "@/config/routes";
import UserDropdown from "@/components/header/UserDropdown";

type NavLink = {
  label: string;
  href: string;
};

const ADMIN_NAV_LINKS: NavLink[] = [
  {
    label: "Dashboard",
    href: PROTECTED_ROUTES.ADMIN_DASHBOARD,
  },
  {
    label: "Users",
    href: PROTECTED_ROUTES.ADMIN_USERS,
  },
  {
    label: "Conversations",
    href: PROTECTED_ROUTES.ADMIN_CONVERSATIONS,
  },
  {
    label: "Prescriptions",
    href: PROTECTED_ROUTES.ADMIN_PRESCRIPTIONS,
  },
  {
    label: "Broadcasts",
    href: PROTECTED_ROUTES.ADMIN_BROADCASTS,
  },
];

const AdminHeader = () => {
  const { user, isAuthenticated } = useAuth();
  const pathname = usePathname();

  const isLinkActive = (href: string) => {
    if (!pathname) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-gray-800 dark:bg-gray-900/80">
      <div className="mx-auto flex max-w-(--breakpoint-2xl) flex-nowrap items-center justify-between gap-4 px-3 py-2.5 sm:px-4 sm:py-3 lg:px-6 lg:py-3">
        {/* Left Side: Logo + Navigation Links - Same Row */}
        <div className="flex min-w-0 flex-1 flex-nowrap items-center gap-4 sm:gap-5 lg:gap-6">
          {/* Logo */}
          <Link 
            href={PUBLIC_ROUTES.HOME} 
            className="flex-shrink-0"
          >
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

          {/* Navigation Links - Horizontally aligned next to Logo */}
          <nav className="flex flex-nowrap items-center gap-2 overflow-x-auto text-sm no-scrollbar sm:gap-3">
            {ADMIN_NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex-shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 font-medium transition sm:px-4 sm:py-2 ${
                  isLinkActive(link.href)
                    ? "bg-brand-500 text-white shadow-theme-xs"
                    : "text-gray-600 hover:bg-gray-100 hover:text-brand-500 dark:text-gray-300 dark:hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Side: User Dropdown */}
        <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
          {isAuthenticated && user ? (
            <UserDropdown />
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href={PUBLIC_ROUTES.LOGIN}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:border-brand-200 hover:text-brand-500 dark:border-gray-700 dark:text-gray-300 dark:hover:border-brand-500/40 dark:hover:text-brand-300 sm:px-4 sm:py-2"
              >
                Sign In
              </Link>
              <Link
                href={PUBLIC_ROUTES.REGISTER}
                className="rounded-lg bg-brand-500 px-3 py-1.5 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600 sm:px-4 sm:py-2"
              >
                Join Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;

