"use client";

import { useEffect, useId, useRef, useState } from "react";
import StarRating from "@/components/ui/StarRating";
import { formatRateForApi } from "@/lib/utils/rating";
import { createPortal } from "react-dom";
import type { Category } from "@/lib/types/api";
import { useAddProductsMutation } from "@/lib/api/admin/admin-product-api";
import { parseApiError } from "@/lib/api/errors";
import { authInputClassName, authLabelClassName } from "@/components/auth/authFieldClasses";

type AddProductModalProps = {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  onSuccess: () => void;
};

export default function AddProductModal({
  open,
  onClose,
  categories,
  onSuccess,
}: AddProductModalProps) {
  const titleId = useId();
  const descId = useId();
  const firstFieldRef = useRef<HTMLSelectElement>(null);
  const [addProduct, { isLoading }] = useAddProductsMutation();
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [stars, setStars] = useState(5);

  useEffect(() => {
    if (!open) {
      const clearId = requestAnimationFrame(() => {
        setError("");
        setFieldErrors({});
      });
      return () => cancelAnimationFrame(clearId);
    }
    const t = requestAnimationFrame(() => firstFieldRef.current?.focus());
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(t);
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, isLoading, onClose]);

  if (typeof document === "undefined" || !open) return null;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set("rate", formatRateForApi(stars));

    try {
      await addProduct(fd).unwrap();
      form.reset();
      onSuccess();
    } catch (err) {
      const parsed = parseApiError(err, "Could not save the product.");
      setError(parsed.message);
      if (parsed.fieldErrors) setFieldErrors(parsed.fieldErrors);
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
        aria-describedby={descId}
        className="relative z-[101] max-h-[min(90vh,720px)] w-full max-w-lg overflow-y-auto rounded-2xl border border-emerald-100 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900 sm:max-w-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 id={titleId} className="text-xl font-black text-emerald-950 dark:text-zinc-50">
              Add product
            </h2>
            <p id={descId} className="mt-1 text-sm text-slate-600 dark:text-zinc-400">
              Uploads to the backend catalog via the products API.
            </p>
          </div>
          <button
            type="button"
            onClick={() => !isLoading && onClose()}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="add-product-category" className={authLabelClassName}>
                Category
              </label>
              <select
                ref={firstFieldRef}
                id="add-product-category"
                name="categorySlug"
                required
                className={`mt-1.5 ${authInputClassName}`}
                aria-describedby={fieldErrors.categorySlug ? "err-categorySlug" : undefined}
                defaultValue=""
              >
                <option value="" disabled>
                  Select category
                </option>
                {categories.map((c) => (
                  <option key={String(c.id)} value={c.slug}>
                    {c.label}
                  </option>
                ))}
              </select>
              {fieldErrors.categorySlug ? (
                <p id="err-categorySlug" className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
                  {fieldErrors.categorySlug}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="add-product-name" className={authLabelClassName}>
                Product name
              </label>
              <input
                id="add-product-name"
                name="name"
                required
                maxLength={160}
                autoComplete="off"
                className={`mt-1.5 ${authInputClassName}`}
              />
              {fieldErrors.name ? (
                <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">{fieldErrors.name}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="add-product-brand" className={authLabelClassName}>
                Brand
              </label>
              <input
                id="add-product-brand"
                name="brand"
                required
                maxLength={80}
                autoComplete="off"
                className={`mt-1.5 ${authInputClassName}`}
              />
              {fieldErrors.brand ? (
                <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">{fieldErrors.brand}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="add-product-price" className={authLabelClassName}>
                Price
              </label>
              <input
                id="add-product-price"
                name="price"
                required
                maxLength={40}
                placeholder="e.g. NPR 1,200"
                className={`mt-1.5 ${authInputClassName}`}
              />
              {fieldErrors.price ? (
                <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">{fieldErrors.price}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="add-product-quantity" className={authLabelClassName}>
                MOQ / quantity
              </label>
              <input
                id="add-product-quantity"
                name="quantity"
                required
                maxLength={80}
                placeholder="MOQ: 50 units"
                className={`mt-1.5 ${authInputClassName}`}
              />
              {fieldErrors.quantity ? (
                <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
                  {fieldErrors.quantity}
                </p>
              ) : null}
            </div>
            <div>
              <StarRating
                label="Rating"
                value={stars}
                onChange={setStars}
                size="lg"
              />
              <input type="hidden" name="rate" value={formatRateForApi(stars)} />
              {fieldErrors.rate ? (
                <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">{fieldErrors.rate}</p>
              ) : null}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="add-product-image-file" className={authLabelClassName}>
                Product image (file upload)
              </label>
              <input
                id="add-product-image-file"
                name="imageFile"
                type="file"
                required
                accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                className="mt-1.5 block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-slate-900 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-emerald-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:file:bg-sky-600 dark:hover:file:bg-sky-500"
              />
              <p className="mt-1 text-xs text-slate-500 dark:text-zinc-500">Accepted: image files up to 5MB.</p>
              {fieldErrors.imageFile ? (
                <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">{fieldErrors.imageFile}</p>
              ) : null}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="add-product-logo" className={authLabelClassName}>
                Logo URL (https)
              </label>
              <input
                id="add-product-logo"
                name="logo"
                type="url"
                required
                inputMode="url"
                placeholder="https://…"
                className={`mt-1.5 ${authInputClassName}`}
              />
              {fieldErrors.logo ? (
                <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">{fieldErrors.logo}</p>
              ) : null}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="add-product-desc" className={authLabelClassName}>
                Description
              </label>
              <textarea
                id="add-product-desc"
                name="Description"
                required
                rows={4}
                maxLength={2000}
                className={`mt-1.5 resize-y ${authInputClassName}`}
              />
              {fieldErrors.Description ? (
                <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
                  {fieldErrors.Description}
                </p>
              ) : null}
            </div>
          </div>

          {error ? (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800 dark:bg-red-950/40 dark:text-red-200">
              {error}
            </p>
          ) : null}

          <div className="flex flex-wrap justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => !isLoading && onClose()}
              className="rounded-xl border border-emerald-200 px-5 py-2.5 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50 disabled:opacity-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60 dark:bg-sky-600 dark:hover:bg-sky-500"
            >
              {isLoading ? "Saving…" : "Add product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
}
