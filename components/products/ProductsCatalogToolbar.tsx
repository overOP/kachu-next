"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiSearch } from "react-icons/fi";
import type { Category } from "@/lib/types/api";
import CatalogDownloadBanner from "@/components/catalog/CatalogDownloadBanner";

const DEBOUNCE_MS = 320;

type ProductsCatalogToolbarProps = {
  categories: Category[];
  categoryId: string;
  onCategoryChange: (categoryId: string) => void;
};

export default function ProductsCatalogToolbar({
  categories,
  categoryId,
  onCategoryChange,
}: ProductsCatalogToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const qFromUrl = searchParams.get("q") ?? "";
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [draft, setDraft] = useState(qFromUrl);

  useEffect(() => {
    const id = requestAnimationFrame(() => setDraft(qFromUrl));
    return () => cancelAnimationFrame(id);
  }, [qFromUrl]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const replaceQuery = useCallback(
    (nextQ: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const trimmed = nextQ.trim();
      if (trimmed) params.set("q", trimmed);
      else params.delete("q");
      const qs = params.toString();
      router.replace(qs ? `/products?${qs}` : "/products", { scroll: false });
    },
    [router, searchParams]
  );

  const onDraftChange = (value: string) => {
    setDraft(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      debounceRef.current = null;
      replaceQuery(value);
    }, DEBOUNCE_MS);
  };

  const submitSearch = () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    replaceQuery(draft);
  };

  return (
    <div className="mb-12 space-y-6">
      <CatalogDownloadBanner />

      <div className="relative max-w-xl">
        <label htmlFor="catalog-search" className="sr-only">
          Search catalog
        </label>
        <FiSearch
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 dark:text-zinc-400"
          aria-hidden
        />
        <input
          id="catalog-search"
          type="search"
          enterKeyHint="search"
          autoComplete="off"
          placeholder="Search by name or description…"
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submitSearch();
            }
          }}
          className="min-h-11 w-full rounded-2xl border border-emerald-100 bg-white py-3 pl-11 pr-4 text-sm text-emerald-950 shadow-sm outline-none ring-emerald-500/20 transition placeholder:text-slate-500 focus:border-emerald-300 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-400 dark:focus:border-sky-500/50 dark:focus:ring-sky-500/20"
        />
      </div>

      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-sky-400">
          Category
        </p>
        <div className="flex flex-wrap gap-2 sm:gap-3" role="group" aria-label="Filter by category">
          <button
            type="button"
            onClick={() => onCategoryChange("all")}
            className={`min-h-10 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
              categoryId === "all"
                ? "bg-emerald-600 text-white shadow-md dark:bg-sky-600"
                : "border border-emerald-100 bg-white text-emerald-950 hover:border-emerald-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            }`}
          >
            All
          </button>
          {categories.map(({ id, name }) => (
            <button
              key={id}
              type="button"
              onClick={() => onCategoryChange(id)}
              className={`min-h-10 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                categoryId === id
                  ? "bg-emerald-600 text-white shadow-md dark:bg-sky-600"
                  : "border border-emerald-100 bg-white text-emerald-950 hover:border-emerald-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
