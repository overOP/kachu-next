"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiPlus } from "react-icons/fi";
import type { Product, ProductCategory } from "@/lib/data/products";
import AddProductModal from "@/components/admin/AddProductModal";

type AdminProductsPanelProps = {
  products: Product[];
  categories: ProductCategory[];
};

export default function AdminProductsPanel({ products, categories }: AdminProductsPanelProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <header>
          <h1 className="text-3xl font-black tracking-tight text-emerald-950 dark:text-zinc-50">
            Products
          </h1>
          <p className="mt-2 text-slate-600 dark:text-zinc-400">
            {products.length} product{products.length === 1 ? "" : "s"} in the live catalog for this
            server.
          </p>
        </header>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 dark:bg-sky-600 dark:hover:bg-sky-500"
        >
          <FiPlus className="h-4 w-4" aria-hidden />
          Add product
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-emerald-100 bg-emerald-50/80 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-sky-400">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Brand</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50 dark:divide-zinc-800">
              {products.map((p) => (
                <tr
                  key={p.id}
                  className="text-slate-700 transition hover:bg-emerald-50/50 dark:text-zinc-300 dark:hover:bg-zinc-800/40"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-zinc-800">
                        {/* eslint-disable-next-line @next/next/no-img-element -- admin accepts arbitrary image hosts */}
                        <img
                          src={p.img}
                          alt=""
                          className="h-full w-full object-contain p-0.5"
                          loading="lazy"
                        />
                      </div>
                      <span className="font-semibold text-emerald-950 dark:text-zinc-100">
                        {p.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{p.brand}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-emerald-100/80 px-2 py-0.5 text-xs font-medium text-emerald-900 dark:bg-zinc-800 dark:text-sky-300">
                      {p.categorySlug}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium tabular-nums">{p.price}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/product/${p.id}`}
                      className="text-sm font-semibold text-emerald-700 underline-offset-2 hover:underline dark:text-sky-400"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        categories={categories}
        onSuccess={() => {
          router.refresh();
          setModalOpen(false);
        }}
      />
    </div>
  );
}
