import type { Metadata } from "next";
import AdminCategoriesPanel from "@/components/admin/AdminCategoriesPanel";

export const metadata: Metadata = {
  title: "Categories",
};

export default function AdminCategoriesPage() {
  return <AdminCategoriesPanel />;
}
