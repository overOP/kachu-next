import type { Metadata } from "next";
import AdminDashboardPanel from "@/components/admin/AdminDashboardPanel";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function AdminDashboardPage() {
  return <AdminDashboardPanel />;
}
