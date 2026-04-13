import React from "react";
import Sidebar from "@/app/components/ui/Sidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
