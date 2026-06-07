"use client";

import type { ReactNode } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import AdminLoginScreen from "@/components/admin/AdminLoginScreen";
import AdminAccessDenied from "@/components/admin/AdminAccessDenied";

type AdminGuardProps = {
  children: ReactNode;
  requireSuperadmin?: boolean;
};

export default function AdminGuard({ children, requireSuperadmin = false }: AdminGuardProps) {
  const { isAuthenticated, isAdmin, isSuperadmin } = useAuth();

  if (!isAuthenticated) {
    return <AdminLoginScreen />;
  }

  const allowed = requireSuperadmin ? isSuperadmin : isAdmin;

  if (!allowed) {
    return <AdminAccessDenied />;
  }

  return <>{children}</>;
}
