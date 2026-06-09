import type { Metadata } from "next";
import AdminReviewsPanel from "@/components/admin/AdminReviewsPanel";

export const metadata: Metadata = {
  title: "Reviews",
};

export default function AdminReviewsPage() {
  return <AdminReviewsPanel />;
}
