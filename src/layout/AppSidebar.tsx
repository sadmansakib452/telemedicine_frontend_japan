"use client";
import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { ChatIcon, HorizontaLDots, MailIcon, DocsIcon } from "../icons/index";
import { useAuth } from "@/hooks/useAuth";
import { PROTECTED_ROUTES } from "@/config/routes";
type NavItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
};
type NavSection = {
  title: string;
  items: NavItem[];
};

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const { user } = useAuth();

  const nav_sections = useMemo<NavSection[]>(() => {
    const workspaceItems: NavItem[] = [
      {
        name: "Conversations",
        icon: <ChatIcon />,
        path: PROTECTED_ROUTES.CONVERSATIONS,
      },
    ];

    if (user?.type === "doctor") {
      workspaceItems.push({
        name: "Broadcasts",
        icon: <MailIcon />,
        path: PROTECTED_ROUTES.BROADCASTS_INBOX,
      });
    }

    // Add Prescriptions button for shop owners
    const isShopOwner = user?.type === "shop_keeper" || (user?.type as string) === "shop_owner";
    if (isShopOwner) {
      workspaceItems.push({
        name: "Prescriptions",
        icon: <DocsIcon />,
        path: PROTECTED_ROUTES.PRESCRIPTIONS_INBOX,
      });
    }

    return [
      {
        title: "Workspace",
        items: workspaceItems,
      },
    ];
  }, [user?.type]);

  const isActive = (path: string) => {
    if (!pathname) return false;
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex  ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image
                className="h-10 w-10 object-contain dark:hidden sm:h-12 sm:w-12"
                src="/images/logo/logo.png"
                alt="Logo"
                width={48}
                height={48}
              />
              <Image
                className="hidden h-10 w-auto object-contain dark:block sm:h-12"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={120}
                height={40}
              />
            </>
          ) : (
            <Image
              className="h-8 w-8 object-contain dark:hidden"
              src="/images/logo/logo.png"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6 flex flex-col gap-6">
          {nav_sections.map((section) => (
            <div key={section.title} className="flex flex-col gap-4">
              <h2
                className={`text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  section.title
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              <ul className="flex flex-col gap-2">
                {section.items.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.path}
                      className={`menu-item group ${
                        isActive(item.path)
                          ? "menu-item-active"
                          : "menu-item-inactive"
                      }`}
                    >
                      <span
                        className={`${
                          isActive(item.path)
                            ? "menu-item-icon-active"
                            : "menu-item-icon-inactive"
                        }`}
                      >
                        {item.icon}
                      </span>
                      {(isExpanded || isHovered || isMobileOpen) && (
                        <span className="menu-item-text">{item.name}</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
