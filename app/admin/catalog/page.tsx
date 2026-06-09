import type { Metadata } from "next";
import AdminCatalogPanel from "@/components/admin/AdminCatalogPanel";

export const metadata: Metadata = {
  title: "Catalog",
};

export default function AdminCatalogPage() {
  return <AdminCatalogPanel />;
}
