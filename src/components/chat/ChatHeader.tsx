"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Button from "@/components/ui/button/Button";
import { useAuth } from "@/hooks/useAuth";
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from "@/config/routes";
import UserDropdown from "@/components/header/UserDropdown";

type NavLink = {
  label: string;
  href: string;
  roles?: string[];
};

const NAV_LINKS: NavLink[] = [
  {
    label: "Home",
    href: PUBLIC_ROUTES.HOME,
  },
  {
    label: "Conversations",
    href: PROTECTED_ROUTES.CONVERSATIONS,
  },
  {
    label: "Broadcasts",
    href: PROTECTED_ROUTES.BROADCASTS_INBOX,
    roles: ["doctor"],
  },
  {
    label: "Prescriptions",
    href: PROTECTED_ROUTES.PRESCRIPTIONS_INBOX,
    roles: ["shop_keeper", "shop_owner"],
  },
];

const ChatHeader = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const accessibleLinks = useMemo(() => {
    return NAV_LINKS.filter((link) => {
      if (!link.roles) {
        return true;
      }
      if (!user?.type) {
        return false;
      }
      // Handle both 'shop_keeper' (frontend constant) and 'shop_owner' (backend value)
      const userType = user.type === "shop_keeper" || (user.type as string) === "shop_owner" 
        ? "shop_owner" 
        : user.type;
      return link.roles.includes(userType) || link.roles.includes(user.type);
    });
  }, [user?.type]);

  const isLinkActive = (href: string) => {
    if (!pathname) return false;
    if (href === PUBLIC_ROUTES.HOME) {
      return pathname === PUBLIC_ROUTES.HOME;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-gray-800 dark:bg-gray-900/80">
      <div className="mx-auto flex max-w-(--breakpoint-2xl) flex-col gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link href={PUBLIC_ROUTES.HOME} className="inline-flex items-center gap-3">
            <Image
              src="/images/logo/logo.svg"
              alt="QuickMed Connect"
              width={140}
              height={36}
              className="dark:hidden"
              priority
            />
            <Image
              src="/images/logo/logo-dark.svg"
              alt="QuickMed Connect"
              width={140}
              height={36}
              className="hidden dark:block"
              priority
            />
          </Link>

          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleLogout}
                  disabled={isLoggingOut || isLoading}
                  className="hidden sm:inline-flex"
                >
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </Button>
                <UserDropdown />
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href={PUBLIC_ROUTES.LOGIN}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-brand-200 hover:text-brand-500 dark:border-gray-700 dark:text-gray-300 dark:hover:border-brand-500/40 dark:hover:text-brand-300"
                >
                  Sign In
                </Link>
                <Link
                  href={PUBLIC_ROUTES.REGISTER}
                  className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600"
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>
        </div>

        <nav className="flex items-center gap-2 overflow-x-auto text-sm">
          {accessibleLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-4 py-2 font-medium transition ${
                isLinkActive(link.href)
                  ? "bg-brand-500 text-white shadow-theme-xs"
                  : "text-gray-600 hover:bg-gray-100 hover:text-brand-500 dark:text-gray-300 dark:hover:bg-white/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated && user && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleLogout}
              disabled={isLoggingOut || isLoading}
              className="sm:hidden"
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default ChatHeader;

