"use client";

import { useState } from "react";
import type { Review } from "@/lib/types/api";
import {
  useCreateReviewMutation,
  useDeleteReviewMutation,
  useGetReviewsQuery,
  useUpdateReviewMutation,
} from "@/lib/api/review-api";
import { canDeleteReview, canEditReview } from "@/lib/auth/rbac";
import { parseApiError } from "@/lib/api/errors";
import { useAuth } from "@/lib/hooks/use-auth";
import { authInputClassName, authLabelClassName } from "@/components/auth/authFieldClasses";
import Link from "next/link";
import StarRating from "@/components/ui/StarRating";

type ProductReviewsProps = {
  productId: number;
  initialReviews?: Review[];
};

export default function ProductReviews({ productId, initialReviews = [] }: ProductReviewsProps) {
  const { user, isAuthenticated } = useAuth();
  const { data: reviews = initialReviews, refetch } = useGetReviewsQuery({ productId });
  const [createReview, { isLoading: isCreating }] = useCreateReviewMutation();
  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");

  const busy = isCreating || isUpdating || isDeleting;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await createReview({ productId, rating, comment: comment.trim() }).unwrap();
      setComment("");
      setRating(5);
      refetch();
    } catch (err) {
      setError(parseApiError(err, "Could not submit review.").message);
    }
  };

  const startEdit = (review: Review) => {
    setEditingId(review.id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const saveEdit = async (id: string | number) => {
    setError("");
    try {
      await updateReview({ id, rating: editRating, comment: editComment.trim() }).unwrap();
      setEditingId(null);
      refetch();
    } catch (err) {
      setError(parseApiError(err, "Could not update review.").message);
    }
  };

  const handleDelete = async (review: Review) => {
    if (!canDeleteReview(user, review)) return;
    if (!window.confirm("Delete this review?")) return;
    setError("");
    try {
      await deleteReview(review.id).unwrap();
      refetch();
    } catch (err) {
      setError(parseApiError(err, "Could not delete review.").message);
    }
  };

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <section className="mt-10 rounded-3xl border border-emerald-100 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/80 sm:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-emerald-950 dark:text-zinc-50">Reviews</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">
            {reviews.length} review{reviews.length === 1 ? "" : "s"}
            {avgRating ? ` · ${avgRating} average` : ""}
          </p>
        </div>
      </div>

      {error ? (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </p>
      ) : null}

      <ul className="mb-8 divide-y divide-emerald-50 dark:divide-zinc-800">
        {reviews.length === 0 ? (
          <li className="py-6 text-sm text-slate-500 dark:text-zinc-500">No reviews yet.</li>
        ) : (
          reviews.map((review) => (
            <li key={String(review.id)} className="py-4">
              {editingId === review.id ? (
                <div className="space-y-3">
                  <StarRating
                    label="Rating"
                    value={editRating}
                    onChange={setEditRating}
                    size="md"
                  />
                  <label className={authLabelClassName}>
                    Comment
                    <textarea
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      rows={3}
                      className={`mt-1 block w-full resize-y ${authInputClassName}`}
                    />
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => saveEdit(review.id)}
                      disabled={busy}
                      className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="rounded-lg border px-3 py-1.5 text-xs font-semibold dark:border-zinc-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-emerald-950 dark:text-zinc-100">
                      {review.userName ?? "Customer"}
                    </p>
                    <StarRating value={review.rating} readOnly size="sm" />
                  </div>
                  <p className="mt-2 text-sm text-slate-600 dark:text-zinc-400">{review.comment}</p>
                  <div className="mt-2 flex gap-3">
                    {canEditReview(user, review) ? (
                      <button
                        type="button"
                        onClick={() => startEdit(review)}
                        className="text-xs font-semibold text-emerald-700 dark:text-sky-400"
                      >
                        Edit
                      </button>
                    ) : null}
                    {canDeleteReview(user, review) ? (
                      <button
                        type="button"
                        onClick={() => handleDelete(review)}
                        disabled={busy}
                        className="text-xs font-semibold text-red-600 dark:text-red-400"
                      >
                        Delete
                      </button>
                    ) : null}
                  </div>
                </>
              )}
            </li>
          ))
        )}
      </ul>

      {isAuthenticated ? (
        <form onSubmit={handleCreate} className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 dark:border-zinc-700 dark:bg-zinc-800/40">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-800 dark:text-sky-400">
            Write a review
          </h3>
          <div className="mt-4 space-y-4">
            <StarRating label="Your rating" value={rating} onChange={setRating} size="lg" />
            <div>
              <label htmlFor="review-comment" className={authLabelClassName}>
                Comment
              </label>
              <textarea
                id="review-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                rows={3}
                maxLength={2000}
                className={`mt-1.5 w-full resize-y ${authInputClassName}`}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={busy}
            className="mt-4 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60 dark:bg-sky-600"
          >
            {isCreating ? "Submitting…" : "Submit review"}
          </button>
        </form>
      ) : (
        <p className="text-sm text-slate-600 dark:text-zinc-400">
          <Link href="/login" className="font-semibold text-emerald-700 underline dark:text-sky-400">
            Sign in
          </Link>{" "}
          to write a review.
        </p>
      )}
    </section>
  );
}
