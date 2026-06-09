"use client";

import { useState } from "react";
import Link from "next/link";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import type { Product } from "@/lib/types/api";
import {
  useDeleteProductMutation,
  useGetProductQuery,
} from "@/lib/api/admin/admin-product-api";
import { useGetCategoriesQuery } from "@/lib/api/admin/admin-category-api";
import { parseApiError } from "@/lib/api/errors";
import {
  averageRatingFromProduct,
  productImage,
  productMoqLabel,
  productPriceLabel,
} from "@/lib/utils/product-display";
import StarRating from "@/components/ui/StarRating";
import AddProductModal from "@/components/admin/AddProductModal";
import EditProductModal from "@/components/admin/EditProductModal";
import CatalogUploadSection from "@/components/admin/CatalogUploadSection";
import AdminProductsCategoriesSection from "@/components/admin/AdminProductsCategoriesSection";

export default function AdminProductsPanel() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [actionError, setActionError] = useState("");
  const [filterCategoryId, setFilterCategoryId] = useState("");
  const { data: products = [], isLoading, isError, refetch } = useGetProductQuery(
    filterCategoryId ? { categoryId: filterCategoryId } : undefined
  );
  const { data: categories = [] } = useGetCategoriesQuery();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const categoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name ?? productCategoryName(id, products);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this product? This cannot be undone.")) return;
    setActionError("");
    try {
      await deleteProduct(id).unwrap();
    } catch (err) {
      setActionError(parseApiError(err, "Could not delete product.").message);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <header>
          <h1 className="text-3xl font-black tracking-tight text-emerald-950 dark:text-zinc-50">
            Products
          </h1>
          <p className="mt-2 text-slate-600 dark:text-zinc-400">
            {isLoading ? "Loading catalog…" : `${products.length} product${products.length === 1 ? "" : "s"} from the API.`}
          </p>
        </header>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 dark:bg-sky-600"
        >
          <FiPlus className="h-4 w-4" aria-hidden />
          Add product
        </button>
      </div>

      {isError ? (
        <p className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          Could not load products. Ensure the backend is running at {process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5050"}.
        </p>
      ) : null}

      {actionError ? (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200">
          {actionError}
        </p>
      ) : null}

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <AdminProductsCategoriesSection />
        <CatalogUploadSection compact />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label htmlFor="admin-product-filter" className="text-sm font-semibold text-emerald-900 dark:text-zinc-200">
          Filter by category
        </label>
        <select
          id="admin-product-filter"
          value={filterCategoryId}
          onChange={(e) => setFilterCategoryId(e.target.value)}
          className="min-h-10 rounded-xl border border-emerald-200 bg-white px-3 text-sm dark:border-zinc-600 dark:bg-zinc-900"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-emerald-100 bg-emerald-50/80 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-sky-400">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">MOQ</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Rating</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50 dark:divide-zinc-800">
              {!isLoading && products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <p className="font-semibold text-emerald-950 dark:text-zinc-100">No products yet</p>
                    <p className="mt-1 text-sm text-slate-500">Add your first product to get started.</p>
                  </td>
                </tr>
              ) : null}
              {products.map((p) => {
                const avg = averageRatingFromProduct(p);
                return (
                  <tr key={p.id} className="text-slate-700 dark:text-zinc-300">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-zinc-800">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={productImage(p)} alt="" className="h-full w-full object-contain p-0.5" loading="lazy" />
                        </div>
                        <span className="font-semibold text-emerald-950 dark:text-zinc-100">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{p.category?.name ?? categoryName(p.categoryId)}</td>
                    <td className="px-4 py-3 font-medium tabular-nums">{productPriceLabel(p)}</td>
                    <td className="px-4 py-3 tabular-nums">{p.stock ?? "—"}</td>
                    <td className="px-4 py-3">{productMoqLabel(p)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          p.isActive === false
                            ? "bg-slate-100 text-slate-500 dark:bg-zinc-800"
                            : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                        }`}
                      >
                        {p.isActive === false ? "Inactive" : "Active"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {avg > 0 ? <StarRating value={Math.round(avg)} readOnly size="sm" showScore={false} /> : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button type="button" onClick={() => setEditingProduct(p)} className="text-emerald-700 dark:text-sky-400" aria-label={`Edit ${p.name}`}>
                          <FiEdit2 className="h-4 w-4" />
                        </button>
                        <Link href={`/product/${p.id}`} className="text-sm font-semibold text-emerald-700 underline dark:text-sky-400">View</Link>
                        <button type="button" onClick={() => handleDelete(p.id)} disabled={isDeleting} className="text-red-600 dark:text-red-400" aria-label={`Delete ${p.name}`}>
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AddProductModal open={modalOpen} onClose={() => setModalOpen(false)} onSuccess={() => { refetch(); setModalOpen(false); }} />
      <EditProductModal open={editingProduct != null} product={editingProduct} categories={categories} onClose={() => setEditingProduct(null)} onSuccess={() => { refetch(); setEditingProduct(null); }} />
    </div>
  );
}

function productCategoryName(id: string, products: Product[]): string {
  const match = products.find((p) => p.categoryId === id);
  return match?.category?.name ?? id.slice(0, 8);
}
