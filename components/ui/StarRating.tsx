"use client";

import { useState } from "react";
import { parseRateValue } from "@/lib/utils/rating";

const STARS = [1, 2, 3, 4, 5] as const;

type StarRatingSize = "sm" | "md" | "lg";

type StarRatingProps = {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: StarRatingSize;
  label?: string;
  hint?: string;
  showScore?: boolean;
  className?: string;
};

const starTextClass: Record<StarRatingSize, string> = {
  sm: "text-sm",
  md: "text-lg",
  lg: "text-xl",
};

const interactiveStarTextClass: Record<StarRatingSize, string> = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-3xl",
};

export default function StarRating({
  value,
  onChange,
  readOnly = false,
  size = "md",
  label,
  hint,
  showScore = true,
  className = "",
}: StarRatingProps) {
  const [hover, setHover] = useState<number | null>(null);
  const interactive = !readOnly && onChange != null;
  const display = hover ?? value;

  const handleSelect = (star: number, e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange?.(star);
  };

  const textClass = interactive ? interactiveStarTextClass[size] : starTextClass[size];

  return (
    <div className={className} onClick={(e) => interactive && e.stopPropagation()}>
      {label ? (
        <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-sky-400">
          {label}
        </p>
      ) : null}
      <div
        className="flex max-w-full flex-col gap-1"
        role={interactive ? "radiogroup" : "img"}
        aria-label={interactive ? `Rating: ${value} of 5 stars` : `${value} out of 5 stars`}
        onMouseLeave={() => interactive && setHover(null)}
      >
        <div className={`inline-flex max-w-full flex-wrap items-center gap-0.5 ${textClass}`}>
          {STARS.map((star) => {
            const filled = star <= display;
            const selected = star <= value;
            return (
              <button
                key={star}
                type="button"
                tabIndex={interactive ? 0 : -1}
                aria-label={`${star} star${star === 1 ? "" : "s"}`}
                aria-checked={interactive ? selected : undefined}
                role={interactive ? "radio" : undefined}
                onClick={(e) => interactive && handleSelect(star, e)}
                onKeyDown={(e) => {
                  if (!interactive) return;
                  if (e.key === "Enter" || e.key === " ") handleSelect(star, e);
                }}
                onMouseEnter={() => interactive && setHover(star)}
                className={`inline-flex shrink-0 items-center justify-center leading-none select-none ${
                  interactive
                    ? "min-h-11 min-w-11 cursor-pointer rounded-lg transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    : "cursor-default pointer-events-none p-0"
                } ${filled ? "text-amber-400" : "text-slate-300 dark:text-zinc-600"}`}
              >
                <span aria-hidden>{filled ? "★" : "☆"}</span>
              </button>
            );
          })}
        </div>
        {showScore && value > 0 ? (
          <span
            className={`font-black tabular-nums text-emerald-950 dark:text-zinc-50 ${
              size === "sm" ? "text-sm" : size === "md" ? "text-lg sm:text-2xl" : "text-2xl"
            }`}
          >
            {value}/5
          </span>
        ) : null}
      </div>
      {interactive && hint !== "" ? (
        <p className="mt-1.5 text-xs text-slate-500 dark:text-zinc-500">
          {hint ?? "Click a star to set the rating"}
        </p>
      ) : null}
      {readOnly && hint ? (
        <p className="mt-1.5 text-xs leading-snug text-slate-500 dark:text-zinc-500">{hint}</p>
      ) : null}
    </div>
  );
}

/** Read-only stars from a product `rate` string or numeric value. */
export function ProductStarRating({
  rate,
  size = "sm",
  className,
  hint,
  showScore = false,
}: {
  rate: string | number;
  size?: StarRatingSize;
  className?: string;
  hint?: string;
  showScore?: boolean;
}) {
  const value = parseRateValue(rate);
  if (value <= 0) return null;
  return (
    <StarRating
      value={value}
      readOnly
      size={size}
      className={className}
      hint={hint}
      showScore={showScore}
    />
  );
}
