"use client";

import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { useDeleteReviewMutation, useGetReviewsQuery } from "@/lib/api/review-api";
import { canDeleteReview } from "@/lib/auth/rbac";
import { parseApiError } from "@/lib/api/errors";
import { useAuth } from "@/lib/hooks/use-auth";
import StarRating from "@/components/ui/StarRating";

export default function AdminReviewsPanel() {
  const { user } = useAuth();
  const { data: reviews = [], isLoading, isError } = useGetReviewsQuery();
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();
  const [error, setError] = useState("");

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this review? This cannot be undone.")) return;
    setError("");
    try {
      await deleteReview(id).unwrap();
    } catch (err) {
      setError(parseApiError(err, "Could not delete review.").message);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-emerald-950 dark:text-zinc-50">
          Reviews
        </h1>
        <p className="mt-2 text-slate-600 dark:text-zinc-400">
          Moderate customer reviews. Admins can delete inappropriate content.
        </p>
      </header>

      {isError ? (
        <p className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          Could not load reviews from the API.
        </p>
      ) : null}

      {error ? (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </p>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-emerald-100 bg-emerald-50/80 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-sky-400">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Rating</th>
                <th className="px-4 py-3">Comment</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50 dark:divide-zinc-800">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    Loading reviews…
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No reviews yet.
                  </td>
                </tr>
              ) : (
                reviews.map((r) => {
                  const reviewer = r.reviewer ?? r.user;
                  const canDelete = canDeleteReview(user, { userId: r.userId });
                  return (
                    <tr key={r.id} className="text-slate-700 dark:text-zinc-300">
                      <td className="px-4 py-3 font-medium text-emerald-950 dark:text-zinc-100">
                        {r.product?.name ?? r.productId.slice(0, 8)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {reviewer?.profileImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={reviewer.profileImage}
                              alt=""
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800 dark:bg-zinc-800 dark:text-sky-300">
                              {(reviewer?.name ?? "?").charAt(0)}
                            </span>
                          )}
                          <span>{reviewer?.name ?? "Anonymous"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <StarRating value={r.rating} readOnly size="sm" showScore={false} />
                      </td>
                      <td className="max-w-xs truncate px-4 py-3">{r.comment ?? "—"}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {canDelete ? (
                          <button
                            type="button"
                            onClick={() => handleDelete(r.id)}
                            disabled={isDeleting}
                            className="inline-flex items-center gap-1 text-sm font-semibold text-red-600 dark:text-red-400"
                          >
                            <FiTrash2 className="h-4 w-4" aria-hidden />
                            Delete
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
