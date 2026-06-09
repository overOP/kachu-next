"use client";

import Link from "next/link";
import { FiLayers } from "react-icons/fi";
import { useGetCategoriesQuery } from "@/lib/api/admin/admin-category-api";
import QuickAddCategoryField from "@/components/admin/QuickAddCategoryField";

export default function AdminProductsCategoriesSection() {
  const { data: categories = [], isLoading } = useGetCategoriesQuery();

  return (
    <section className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-black text-emerald-950 dark:text-zinc-50">
            <FiLayers className="h-5 w-5 text-emerald-600 dark:text-sky-400" aria-hidden />
            Categories
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">
            {isLoading
              ? "Loading…"
              : `${categories.length} categor${categories.length === 1 ? "y" : "ies"} — assign one when adding a product.`}
          </p>
        </div>
        <Link
          href="/admin/categories"
          className="text-sm font-semibold text-emerald-700 hover:underline dark:text-sky-300"
        >
          Manage all
        </Link>
      </div>

      {!isLoading && categories.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {categories.map((c) => (
            <li
              key={c.id}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                c.isActive === false
                  ? "bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-zinc-500"
                  : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
              }`}
            >
              {c.name}
              {c.products?.length != null ? (
                <span className="ml-1 opacity-70">({c.products.length})</span>
              ) : null}
            </li>
          ))}
        </ul>
      ) : !isLoading ? (
        <p className="mt-4 text-sm text-amber-800 dark:text-amber-200">
          No categories yet — create one below or when adding a product.
        </p>
      ) : null}

      <QuickAddCategoryField categories={categories} onCreated={() => {}} />
    </section>
  );
}
