"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminBackdrop from "@/components/admin/AdminBackdrop";
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from "@/config/routes";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Role guard: Redirect non-admin users
  useEffect(() => {
    if (!isLoading) {
      // If not authenticated, redirect to login
      if (!isAuthenticated) {
        const loginUrl = `${PUBLIC_ROUTES.LOGIN}?redirect=${encodeURIComponent(pathname || PROTECTED_ROUTES.ADMIN_DASHBOARD)}`;
        router.push(loginUrl);
        return;
      }

      // If authenticated but not admin, redirect to appropriate route
      if (user && user.type !== "admin") {
        // Redirect based on user type
        if (user.type === "doctor") {
          router.push(PROTECTED_ROUTES.BROADCASTS_INBOX);
        } else if (user.type === "shop_keeper" || (user.type as string) === "shop_owner") {
          router.push(PROTECTED_ROUTES.PRESCRIPTIONS_INBOX);
        } else {
          router.push(PROTECTED_ROUTES.CONVERSATIONS);
        }
        return;
      }
    }
  }, [user, isAuthenticated, isLoading, router, pathname]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  // Show loading state while checking admin role
  if (!isAuthenticated || !user || user.type !== "admin") {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  // Admin layout with sidebar and header
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50 transition-colors dark:bg-gray-900">
      <AdminHeader />
      <div className="relative flex flex-1 overflow-hidden">
        <AdminBackdrop />
        <AdminSidebar />
        {/* Main content area - accounts for fixed sidebar (90px collapsed) */}
        <main className="flex-1 overflow-y-auto transition-all duration-300 lg:ml-[90px]">
          {children}
        </main>
      </div>
    </div>
  );
}

