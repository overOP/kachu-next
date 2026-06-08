import type { Metadata } from "next";
import Link from "next/link";
import AdminStatCard from "@/components/admin/AdminStatCard";
import { fetchProductCategories, fetchProducts } from "@/lib/services/products";

export const metadata: Metadata = {
  title: "Dashboard",
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  let products: Awaited<ReturnType<typeof fetchProducts>> = [];
  let categories: Awaited<ReturnType<typeof fetchProductCategories>> = [];
  let apiError = false;

  try {
    [products, categories] = await Promise.all([fetchProducts(), fetchProductCategories()]);
  } catch {
    apiError = true;
  }

  const inStock = products.filter((p) => p.stock == null || p.stock > 0).length;

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-10">
        <h1 className="text-3xl font-black tracking-tight text-emerald-950 dark:text-zinc-50">
          Dashboard
        </h1>
        <p className="mt-2 text-slate-600 dark:text-zinc-400">
          Live overview from the API at {process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5050"}.
        </p>
      </header>

      {apiError ? (
        <p className="mb-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          Could not reach the backend. Start the API and ensure CORS `CLIENT_URL` matches this frontend.
        </p>
      ) : null}

      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AdminStatCard title="Products" value={products.length} hint="SKUs in catalog" />
        <AdminStatCard title="Categories" value={categories.length} hint="Product groups" />
        <AdminStatCard title="In stock" value={inStock} hint="Products with stock &gt; 0" />
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
        <Link
          href="/admin/users"
          className="rounded-xl border border-emerald-200 px-5 py-2.5 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Manage users
        </Link>
      </div>
    </div>
  );
}
