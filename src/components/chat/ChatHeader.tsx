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
  const { user, isAuthenticated } = useAuth();
  const pathname = usePathname();

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

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-gray-800 dark:bg-gray-900/80">
      <div className="mx-auto flex max-w-(--breakpoint-2xl) flex-col gap-2 px-3 py-2.5 sm:px-4 sm:py-3 lg:px-6 lg:py-3">
        <div className="flex flex-nowrap items-center justify-between gap-2 sm:gap-3">
          <Link 
            href={PUBLIC_ROUTES.HOME} 
            className="inline-flex flex-shrink-0 items-center gap-2 sm:gap-3"
          >
            <Image
              src="/images/logo/logo.svg"
              alt="QuickMed Connect"
              width={120}
              height={31}
              className="h-auto w-[120px] dark:hidden sm:w-[140px]"
              priority
            />
            <Image
              src="/images/logo/logo-dark.svg"
              alt="QuickMed Connect"
              width={120}
              height={31}
              className="hidden h-auto w-[120px] dark:block sm:w-[140px]"
              priority
            />
          </Link>

          <div className="flex min-w-0 flex-shrink-0 items-center gap-2 sm:gap-3">
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

        <nav className="flex items-center gap-2 overflow-x-auto pb-1 text-sm no-scrollbar">
          {accessibleLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex-shrink-0 rounded-full px-3 py-1.5 font-medium transition sm:px-4 sm:py-2 ${
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
    </header>
  );
};

export default ChatHeader;

