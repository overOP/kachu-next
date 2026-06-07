"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import type { Product } from "@/lib/types/api";
import type { Category } from "@/lib/types/api";
import { useUpdateProductMutation } from "@/lib/api/admin/admin-product-api";
import { parseApiError } from "@/lib/api/errors";
import { formatRateForApi, parseRateValue } from "@/lib/utils/rating";
import StarRating from "@/components/ui/StarRating";
import { authInputClassName, authLabelClassName } from "@/components/auth/authFieldClasses";

type EditProductModalProps = {
  open: boolean;
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSuccess: () => void;
};

export default function EditProductModal({
  open,
  product,
  categories,
  onClose,
  onSuccess,
}: EditProductModalProps) {
  const titleId = useId();
  const [updateProduct, { isLoading }] = useUpdateProductMutation();
  const [error, setError] = useState("");
  const [stars, setStars] = useState(5);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [categorySlug, setCategorySlug] = useState("");

  useEffect(() => {
    if (!open || !product) return;
    setStars(parseRateValue(product.rate) || 5);
    setName(product.name);
    setPrice(product.price);
    setQuantity(product.quantity);
    setCategorySlug(product.categorySlug);
    setError("");
  }, [open, product]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (typeof document === "undefined" || !open || !product) return null;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const fd = new FormData();
    fd.set("name", name.trim());
    fd.set("price", price.trim());
    fd.set("quantity", quantity.trim());
    fd.set("categorySlug", categorySlug);
    fd.set("rate", formatRateForApi(stars));
    fd.set("brand", product.brand);
    fd.set("logo", product.logo);
    fd.set("Description", product.Description);

    try {
      await updateProduct({ productId: product.id, formData: fd }).unwrap();
      onSuccess();
    } catch (err) {
      setError(parseApiError(err, "Could not update product.").message);
    }
  };

  const overlay = (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={() => !isLoading && onClose()}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-[101] w-full max-w-lg rounded-2xl border border-emerald-100 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 id={titleId} className="text-xl font-black text-emerald-950 dark:text-zinc-50">
          Edit product
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">{product.name}</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <StarRating label="Rating" value={stars} onChange={setStars} size="lg" />

          <div>
            <label htmlFor="edit-name" className={authLabelClassName}>
              Name
            </label>
            <input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={`mt-1.5 ${authInputClassName}`}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="edit-price" className={authLabelClassName}>
                Price
              </label>
              <input
                id="edit-price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className={`mt-1.5 ${authInputClassName}`}
              />
            </div>
            <div>
              <label htmlFor="edit-quantity" className={authLabelClassName}>
                MOQ
              </label>
              <input
                id="edit-quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                className={`mt-1.5 ${authInputClassName}`}
              />
            </div>
          </div>

          <div>
            <label htmlFor="edit-category" className={authLabelClassName}>
              Category
            </label>
            <select
              id="edit-category"
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value)}
              className={`mt-1.5 ${authInputClassName}`}
            >
              {categories.map((c) => (
                <option key={String(c.id)} value={c.slug}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {error ? (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200">
              {error}
            </p>
          ) : null}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => !isLoading && onClose()}
              className="rounded-xl border border-emerald-200 px-5 py-2.5 text-sm font-semibold dark:border-zinc-600"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60 dark:bg-sky-600"
            >
              {isLoading ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
}
