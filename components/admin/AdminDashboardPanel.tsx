"use client";

import Link from "next/link";
import { FiLayers, FiMessageSquare, FiPackage, FiUsers } from "react-icons/fi";
import AdminStatCard from "@/components/admin/AdminStatCard";
import { useGetAllUsersQuery } from "@/lib/api/auth/admin-auth-api";
import { useGetCategoriesQuery } from "@/lib/api/admin/admin-category-api";
import { useGetProductQuery } from "@/lib/api/admin/admin-product-api";
import { useGetReviewsQuery } from "@/lib/api/review-api";
import { useAuth } from "@/lib/hooks/use-auth";
import RoleBadge from "@/components/admin/RoleBadge";

export default function AdminDashboardPanel() {
  const { user } = useAuth();
  const { data: categories = [], isError: categoriesError } = useGetCategoriesQuery();
  const { data: products = [], isError: productsError } = useGetProductQuery();
  const { data: users = [], isError: usersError } = useGetAllUsersQuery();
  const { data: reviews = [], isError: reviewsError } = useGetReviewsQuery();

  const apiError = categoriesError || productsError;
  const inStock = products.filter((p) => p.stock == null || p.stock > 0).length;

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-emerald-950 dark:text-zinc-50">
            Dashboard
          </h1>
          <p className="mt-2 text-slate-600 dark:text-zinc-400">
            Catalog, users, and review moderation — signed in as {user?.name ?? "admin"}.
          </p>
        </div>
        {user ? <RoleBadge role={user.role} /> : null}
      </header>

      {apiError ? (
        <p className="mb-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          Could not reach the backend. Start the API and ensure CORS `CLIENT_URL` matches this frontend.
        </p>
      ) : null}

      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard title="Categories" value={categories.length} hint="Product groups" />
        <AdminStatCard title="Products" value={products.length} hint={`${inStock} in stock`} />
        <AdminStatCard
          title="Users"
          value={usersError ? "—" : users.length}
          hint="Admin list API"
        />
        <AdminStatCard
          title="Reviews"
          value={reviewsError ? "—" : reviews.length}
          hint="Public moderation"
        />
      </div>

      <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-emerald-800 dark:text-sky-400">
        Quick actions
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <QuickAction href="/admin/categories" icon={FiLayers} label="Add category" />
        <QuickAction href="/admin/products" icon={FiPackage} label="Add product" />
        <QuickAction href="/admin/users" icon={FiUsers} label="View users" />
        <QuickAction href="/admin/reviews" icon={FiMessageSquare} label="Moderate reviews" />
      </div>
    </div>
  );
}

function QuickAction({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: typeof FiLayers;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex min-h-12 items-center gap-3 rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm font-semibold text-emerald-900 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
    >
      <Icon className="h-4 w-4 shrink-0 text-emerald-600 dark:text-sky-400" aria-hidden />
      {label}
    </Link>
  );
}
