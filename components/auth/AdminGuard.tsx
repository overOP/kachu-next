"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import AdminLoginScreen from "@/components/admin/AdminLoginScreen";

type AdminGuardProps = {
  children: ReactNode;
  requireSuperadmin?: boolean;
};

export default function AdminGuard({ children, requireSuperadmin = false }: AdminGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isAdmin, isSuperadmin } = useAuth();

  const allowed = isAuthenticated && (requireSuperadmin ? isSuperadmin : isAdmin);

  useEffect(() => {
    if (isAuthenticated && !allowed) {
      router.replace("/");
    }
  }, [isAuthenticated, allowed, router]);

  if (!isAuthenticated) {
    return <AdminLoginScreen />;
  }

  if (!allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-emerald-50/40 dark:bg-zinc-950">
        <p className="text-sm text-slate-600 dark:text-zinc-400">Redirecting to storefront…</p>
      </div>
    );
  }

  return <>{children}</>;
}
