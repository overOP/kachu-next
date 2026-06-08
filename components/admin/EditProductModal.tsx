"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import type { Category, Product } from "@/lib/types/api";
import { useUpdateProductMutation } from "@/lib/api/admin/admin-product-api";
import { parseApiError } from "@/lib/api/errors";
import { productImage } from "@/lib/utils/product-display";
import { authInputClassName, authLabelClassName } from "@/components/auth/authFieldClasses";

type EditProductModalProps = {
  open: boolean;
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSuccess: () => void;
};

type EditProductFormProps = {
  product: Product;
  categories: Category[];
  titleId: string;
  onClose: () => void;
  onSuccess: () => void;
};

function productFormDefaults(product: Product) {
  return {
    name: product.name,
    price: String(typeof product.price === "number" ? product.price : product.price),
    description: product.description,
    minimumOrder: String(product.minimumOrder),
    stock: product.stock != null ? String(product.stock) : "",
    categoryId: product.categoryId,
    imageUrl: product.images?.[0] ?? "",
  };
}

function EditProductForm({
  product,
  categories,
  titleId,
  onClose,
  onSuccess,
}: EditProductFormProps) {
  const defaults = productFormDefaults(product);
  const [updateProduct, { isLoading }] = useUpdateProductMutation();
  const [error, setError] = useState("");
  const [name, setName] = useState(defaults.name);
  const [price, setPrice] = useState(defaults.price);
  const [description, setDescription] = useState(defaults.description);
  const [minimumOrder, setMinimumOrder] = useState(defaults.minimumOrder);
  const [stock, setStock] = useState(defaults.stock);
  const [categoryId, setCategoryId] = useState(defaults.categoryId);
  const [imageUrl, setImageUrl] = useState(defaults.imageUrl);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const mo = Number(minimumOrder);
    const priceNum = Number(price);
    if (!Number.isFinite(priceNum) || priceNum <= 0) {
      setError("Price must be a positive number.");
      return;
    }

    const images = imageUrl.trim() ? [imageUrl.trim()] : [];
    const stockNum = stock.trim() ? Number(stock) : undefined;

    try {
      await updateProduct({
        productId: product.id,
        body: {
          name: name.trim(),
          price: priceNum,
          description: description.trim(),
          minimumOrder: mo,
          categoryId,
          images,
          ...(stockNum != null && Number.isFinite(stockNum) ? { stock: stockNum } : {}),
        },
      }).unwrap();
      onSuccess();
    } catch (err) {
      setError(parseApiError(err, "Could not update product.").message);
    }
  };

  return (
    <>
      <h2 id={titleId} className="text-xl font-black text-emerald-950 dark:text-zinc-50">
        Edit product
      </h2>
      <p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">{product.name}</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="edit-category" className={authLabelClassName}>
            Category
          </label>
          <select
            id="edit-category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className={`mt-1.5 ${authInputClassName}`}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
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
            <label htmlFor="edit-moq" className={authLabelClassName}>
              Minimum order
            </label>
            <input
              id="edit-moq"
              type="number"
              min={1}
              value={minimumOrder}
              onChange={(e) => setMinimumOrder(e.target.value)}
              required
              className={`mt-1.5 ${authInputClassName}`}
            />
          </div>
        </div>
        <div>
          <label htmlFor="edit-stock" className={authLabelClassName}>
            Stock
          </label>
          <input
            id="edit-stock"
            type="number"
            min={0}
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className={`mt-1.5 ${authInputClassName}`}
          />
        </div>
        <div>
          <label htmlFor="edit-image" className={authLabelClassName}>
            Image URL
          </label>
          <input
            id="edit-image"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder={productImage(product)}
            className={`mt-1.5 ${authInputClassName}`}
          />
        </div>
        <div>
          <label htmlFor="edit-desc" className={authLabelClassName}>
            Description
          </label>
          <textarea
            id="edit-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className={`mt-1.5 w-full resize-y ${authInputClassName}`}
          />
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
            className="rounded-xl border px-5 py-2.5 text-sm font-semibold dark:border-zinc-600"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60 dark:bg-sky-600"
          >
            {isLoading ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </>
  );
}

export default function EditProductModal({
  open,
  product,
  categories,
  onClose,
  onSuccess,
}: EditProductModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (typeof document === "undefined" || !open || !product) return null;

  const overlay = (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center" role="presentation">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-[101] w-full max-w-lg rounded-2xl border border-emerald-100 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <EditProductForm
          key={product.id}
          product={product}
          categories={categories}
          titleId={titleId}
          onClose={onClose}
          onSuccess={onSuccess}
        />
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
}
