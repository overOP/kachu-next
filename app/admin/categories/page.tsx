import type { Metadata } from "next";
import { fetchProductCategories, fetchProducts } from "@/lib/services/products";

export const metadata: Metadata = {
  title: "Categories",
};

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const [categories, products] = await Promise.all([
    fetchProductCategories(),
    fetchProducts(),
  ]);

  const countBySlug = categories.map((c) => ({
    ...c,
    count: products.filter((p) => p.categorySlug === c.slug).length,
  }));

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-emerald-950 dark:text-zinc-50">
          Categories
        </h1>
        <p className="mt-2 text-slate-600 dark:text-zinc-400">
          {categories.length} categor{categories.length === 1 ? "y" : "ies"} from{" "}
          <code className="rounded bg-emerald-100/80 px-1.5 py-0.5 text-xs dark:bg-zinc-800">
            fetchProductCategories()
          </code>
        </p>
      </header>

      <ul className="divide-y divide-emerald-100 overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900/80">
        {countBySlug.map(({ slug, label, count }) => (
          <li
            key={slug}
            className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-bold text-emerald-950 dark:text-zinc-100">{label}</p>
              <p className="text-xs font-mono text-slate-500 dark:text-zinc-500">{slug}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-900 dark:bg-zinc-800 dark:text-sky-300">
                {count} product{count === 1 ? "" : "s"}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
