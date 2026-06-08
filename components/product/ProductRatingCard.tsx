"use client";

import StarRating from "@/components/ui/StarRating";

type ProductRatingCardProps = {
  averageRating: number;
  reviewCount: number;
};

export default function ProductRatingCard({ averageRating, reviewCount }: ProductRatingCardProps) {
  const display = averageRating > 0 ? Math.round(averageRating) : 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/70">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700 dark:text-sky-400">
        Rating
      </p>
      <div className="mt-2 min-w-0">
        {display > 0 ? (
          <StarRating
            value={display}
            readOnly
            size="md"
            showScore
            hint={`${reviewCount} review${reviewCount === 1 ? "" : "s"}`}
          />
        ) : (
          <p className="text-sm text-slate-600 dark:text-zinc-400">No reviews yet</p>
        )}
        {display === 0 ? (
          <p className="mt-1.5 text-xs text-slate-500 dark:text-zinc-500">
            Scroll down to Reviews to be the first to rate
          </p>
        ) : null}
      </div>
    </div>
  );
}
