"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Category } from "@/lib/types/api";
import { useAddProductsMutation } from "@/lib/api/admin/admin-product-api";
import { parseApiError } from "@/lib/api/errors";
import { authInputClassName, authLabelClassName } from "@/components/auth/authFieldClasses";
import ImageFileField from "@/components/admin/ImageFileField";

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
  const firstFieldRef = useRef<HTMLSelectElement>(null);
  const [addProduct, { isLoading }] = useAddProductsMutation();
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [minimumOrder, setMinimumOrder] = useState("1");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (!open) return;
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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const mo = Number(minimumOrder);
    const priceNum = Number(price);
    if (!Number.isFinite(priceNum) || priceNum <= 0) {
      setError("Price must be a positive number.");
      return;
    }
    if (!Number.isFinite(mo) || mo < 1) {
      setError("Minimum order must be at least 1.");
      return;
    }
    if (!categoryId) {
      setError("Select a category.");
      return;
    }

    const images = imageUrl.trim() ? [imageUrl.trim()] : undefined;
    const stockNum = stock.trim() ? Number(stock) : undefined;

    try {
      await addProduct({
        name: name.trim(),
        price: priceNum,
        description: description.trim(),
        minimumOrder: mo,
        categoryId,
        ...(images ? { images } : {}),
        ...(stockNum != null && Number.isFinite(stockNum) ? { stock: stockNum } : {}),
      }).unwrap();
      setName("");
      setPrice("");
      setDescription("");
      setMinimumOrder("1");
      setStock("");
      setCategoryId("");
      setImageUrl("");
      onSuccess();
    } catch (err) {
      setError(parseApiError(err, "Could not save the product.").message);
    }
  };

  const overlay = (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center" role="presentation">
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
        className="relative z-[101] max-h-[min(90vh,720px)] w-full max-w-lg overflow-y-auto rounded-2xl border border-emerald-100 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900 sm:max-w-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 id={titleId} className="text-xl font-black text-emerald-950 dark:text-zinc-50">
          Add product
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">
          Upload a product image or paste a URL — the image is stored here and saved to the API as a link.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="add-category" className={authLabelClassName}>
                Category
              </label>
              <select
                ref={firstFieldRef}
                id="add-category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className={`mt-1.5 ${authInputClassName}`}
              >
                <option value="" disabled>
                  Select category
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="add-name" className={authLabelClassName}>
                Name
              </label>
              <input
                id="add-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={`mt-1.5 ${authInputClassName}`}
              />
            </div>
            <div>
              <label htmlFor="add-price" className={authLabelClassName}>
                Price (number)
              </label>
              <input
                id="add-price"
                type="number"
                min={0}
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className={`mt-1.5 ${authInputClassName}`}
              />
            </div>
            <div>
              <label htmlFor="add-moq" className={authLabelClassName}>
                Minimum order
              </label>
              <input
                id="add-moq"
                type="number"
                min={1}
                value={minimumOrder}
                onChange={(e) => setMinimumOrder(e.target.value)}
                required
                className={`mt-1.5 ${authInputClassName}`}
              />
            </div>
            <div>
              <label htmlFor="add-stock" className={authLabelClassName}>
                Stock (optional)
              </label>
              <input
                id="add-stock"
                type="number"
                min={0}
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className={`mt-1.5 ${authInputClassName}`}
              />
            </div>
            <div className="sm:col-span-2">
              <ImageFileField
                imageUrl={imageUrl}
                onImageUrlChange={setImageUrl}
                disabled={isLoading}
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="add-desc" className={authLabelClassName}>
                Description
              </label>
              <textarea
                id="add-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                className={`mt-1.5 w-full resize-y ${authInputClassName}`}
              />
            </div>
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
              {isLoading ? "Saving…" : "Add product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
}
