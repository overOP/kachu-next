"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types/api";
import { useUpdateProductMutation } from "@/lib/api/admin/admin-product-api";
import { parseApiError } from "@/lib/api/errors";
import { formatRateForApi, parseRateValue } from "@/lib/utils/rating";
import { useAuth } from "@/lib/hooks/use-auth";
import StarRating from "@/components/ui/StarRating";

type ProductRatingCardProps = {
  product: Product;
  reviewAverage?: number | null;
};

export default function ProductRatingCard({ product, reviewAverage }: ProductRatingCardProps) {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const [editing, setEditing] = useState(false);
  const [stars, setStars] = useState(parseRateValue(product.rate) || 5);
  const [error, setError] = useState("");
  const [updateProduct, { isLoading }] = useUpdateProductMutation();

  const displayValue =
    reviewAverage != null && reviewAverage > 0
      ? Math.round(reviewAverage)
      : parseRateValue(product.rate);

  const hint =
    reviewAverage != null
      ? "Average from customer reviews"
      : isAdmin
        ? undefined
        : "Scroll down to Reviews to rate this product";

  async function saveRating() {
    setError("");
    const fd = new FormData();
    fd.set("rate", formatRateForApi(stars));
    fd.set("name", product.name);
    fd.set("brand", product.brand);
    fd.set("price", product.price);
    fd.set("quantity", product.quantity);
    fd.set("categorySlug", product.categorySlug);
    fd.set("logo", product.logo);
    fd.set("Description", product.Description);

    try {
      await updateProduct({ productId: product.id, formData: fd }).unwrap();
      setEditing(false);
      router.refresh();
    } catch (err) {
      setError(parseApiError(err, "Could not update rating.").message);
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/70">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700 dark:text-sky-400">
        Rating
      </p>

      {editing && isAdmin ? (
        <div className="mt-2" onClick={(e) => e.stopPropagation()}>
          <StarRating value={stars} onChange={setStars} size="md" showScore />
          {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={saveRating}
              disabled={isLoading}
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white"
            >
              {isLoading ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setStars(parseRateValue(product.rate) || 5);
              }}
              className="rounded-lg border px-3 py-1.5 text-xs font-semibold dark:border-zinc-600"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-2 min-w-0">
          <StarRating
            value={displayValue}
            readOnly
            size="md"
            showScore
            hint={hint}
          />
          {isAdmin ? (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="mt-2 text-xs font-semibold text-emerald-700 underline dark:text-sky-400"
            >
              Change catalog rating
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}
