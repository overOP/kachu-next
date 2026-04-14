import type { Metadata } from "next";
import Link from "next/link";
import AdminStatCard from "@/components/admin/AdminStatCard";
import { fetchProductCategories, fetchProducts } from "@/lib/services/products";

export const metadata: Metadata = {
  title: "Dashboard",
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [products, categories] = await Promise.all([
    fetchProducts(),
    fetchProductCategories(),
  ]);

  const brands = new Set(products.map((p) => p.brand)).size;

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-10">
        <h1 className="text-3xl font-black tracking-tight text-emerald-950 dark:text-zinc-50">
          Dashboard
        </h1>
        <p className="mt-2 text-slate-600 dark:text-zinc-400">
          Overview of your catalog — wired to the same data layer as the storefront until your API is
          connected.
        </p>
      </header>

      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AdminStatCard title="Products" value={products.length} hint="SKUs in catalog" />
        <AdminStatCard title="Categories" value={categories.length} hint="Supplier groups" />
        <AdminStatCard title="Brands" value={brands} hint="Distinct brands" />
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/products"
          className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 dark:bg-sky-600 dark:hover:bg-sky-500"
        >
          Manage products
        </Link>
        <Link
          href="/admin/categories"
          className="rounded-xl border border-emerald-200 px-5 py-2.5 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Manage categories
        </Link>
      </div>
    </div>
  );
}
