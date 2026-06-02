"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-emerald-50/40 px-6 dark:bg-zinc-950">
      <h1 className="text-2xl font-bold text-emerald-950 dark:text-zinc-100">Something went wrong</h1>
      <p className="max-w-md text-center text-slate-600 dark:text-zinc-400">
        We couldn&apos;t load this page. Try again, or return home if the problem continues.
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 dark:bg-sky-600 dark:hover:bg-sky-500"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-xl border border-emerald-200 px-5 py-2.5 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
