import type { Metadata } from "next";
import type { ReactNode } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";
import AdminGuard from "@/components/auth/AdminGuard";

export const metadata: Metadata = {
  title: { template: "%s · Admin", default: "Admin" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-zinc-950 lg:flex-row">
        <AdminSidebar />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <AdminTopBar />
          <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8 lg:px-10">{children}</main>
        </div>
      </div>
    </AdminGuard>
  );
}
