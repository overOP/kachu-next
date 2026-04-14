import type { Metadata } from "next";
import AdminProductsPanel from "@/components/admin/AdminProductsPanel";
import { fetchProductCategories, fetchProducts } from "@/lib/services/products";

export const metadata: Metadata = {
  title: "Products",
};

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    fetchProducts(),
    fetchProductCategories(),
  ]);

  return <AdminProductsPanel products={products} categories={categories} />;
}
