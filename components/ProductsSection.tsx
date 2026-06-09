"use client";

import React, {
  Suspense,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import ProductsCatalogToolbar from "@/components/products/ProductsCatalogToolbar";
import ProductCard from "@/components/products/ProductCard";
import type { Category, Product } from "@/lib/types/api";
import { buildProductOrderMessage, buildWhatsAppUrl } from "@/lib/constants/contact";
import { filterProductsByQuery } from "@/lib/search/filter-products";
import {
  filterProductsByCategoryId,
} from "@/lib/utils/product-display";
import { getVisiblePageNumbers } from "@/lib/utils/pagination";

const ITEMS_PER_PAGE = 8;

function ProductsSectionSkeleton() {
  return (
    <section className="overflow-hidden bg-emerald-50/30 px-4 py-16 sm:px-6 sm:py-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 h-10 w-2/3 max-w-md animate-pulse rounded-lg bg-emerald-100/80 dark:bg-zinc-800" />
        <div className="products-grid grid grid-cols-2 gap-4 sm:gap-8 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border border-emerald-100 bg-white p-3 sm:rounded-[2rem] sm:p-4 dark:border-zinc-700/80 dark:bg-zinc-900/90"
            >
              <div className="aspect-square rounded-xl bg-slate-200 sm:rounded-[1.5rem] dark:bg-zinc-800" />
              <div className="mt-4 h-4 w-3/4 rounded bg-slate-200 dark:bg-zinc-800" />
              <div className="mt-2 h-3 w-1/2 rounded bg-slate-100 dark:bg-zinc-800/80" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductsSectionInner({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const deferredQuery = useDeferredValue(query);

  const isCatalogPage = pathname === "/products";
  const validCategoryIds = useMemo(
    () => new Set(categories.map((c) => c.id)),
    [categories]
  );

  const rawCategory = searchParams.get("categoryId");
  const categoryId =
    isCatalogPage &&
    rawCategory &&
    validCategoryIds.size > 0 &&
    validCategoryIds.has(rawCategory)
      ? rawCategory
      : "all";
  const deferredCategory = useDeferredValue(categoryId);

  const [currentPage, setCurrentPage] = useState(1);

  const replaceCategory = useCallback(
    (id: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (id === "all") params.delete("categoryId");
      else params.set("categoryId", id);
      const qs = params.toString();
      router.replace(qs ? `/products?${qs}` : "/products", { scroll: false });
    },
    [router, searchParams]
  );

  const basePool = useMemo(() => {
    if (!isCatalogPage) return products;
    return filterProductsByCategoryId(
      products,
      deferredCategory === "all" ? null : deferredCategory
    );
  }, [isCatalogPage, deferredCategory, products]);

  const filteredProducts = useMemo(
    () => filterProductsByQuery(basePool, deferredQuery),
    [basePool, deferredQuery]
  );

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const visiblePages = useMemo(
    () => getVisiblePageNumbers(currentPage, totalPages),
    [currentPage, totalPages]
  );

  useEffect(() => {
    const id = requestAnimationFrame(() => setCurrentPage(1));
    return () => cancelAnimationFrame(id);
  }, [deferredQuery, deferredCategory]);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setCurrentPage((p) => Math.min(p, totalPages));
    });
    return () => cancelAnimationFrame(id);
  }, [totalPages]);

  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const sendWhatsApp = useCallback((item: Product) => {
    const url = buildWhatsAppUrl(buildProductOrderMessage(item));
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  const navigateToProduct = useCallback(
    (productId: string) => router.push(`/product/${productId}`),
    [router]
  );

  const categoryLabel =
    isCatalogPage && categoryId !== "all"
      ? (categories.find((c) => c.id === categoryId)?.name ?? "")
      : "";

  const resultLabel =
    query.trim().length > 0
      ? `${filteredProducts.length} match${filteredProducts.length === 1 ? "" : "es"} for “${query.trim()}”${categoryLabel ? ` · ${categoryLabel}` : ""}`
      : `Displaying ${startIndex + 1} — ${startIndex + currentProducts.length} of ${filteredProducts.length} results${categoryLabel ? ` · ${categoryLabel}` : ""}`;

  return (
    <section className="overflow-hidden bg-emerald-50/30 px-4 py-16 sm:px-6 sm:py-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl">
        <header className="mb-20">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h3 className="mb-4 text-sm font-bold tracking-widest text-emerald-600 uppercase dark:text-sky-400">
                Curated Selection
              </h3>
              <h2 className="text-3xl font-black tracking-tighter text-emerald-950 sm:text-5xl md:text-6xl dark:text-zinc-50">
                Popular <span className="text-emerald-600 dark:text-sky-400">Products</span>
              </h2>
              <div className="mt-6 h-1.5 w-20 rounded-full bg-emerald-500 dark:bg-sky-500" />
            </div>
            <p className="mb-2 max-w-md border-l-2 border-emerald-200 pl-4 text-sm font-medium text-slate-500 dark:border-zinc-700 dark:text-zinc-400">
              {resultLabel}
            </p>
          </div>
        </header>

        {isCatalogPage ? (
          <ProductsCatalogToolbar
            categories={categories}
            categoryId={categoryId}
            onCategoryChange={replaceCategory}
          />
        ) : null}

        {filteredProducts.length === 0 ? (
          <div className="rounded-3xl border border-emerald-100 bg-white/80 px-8 py-16 text-center dark:border-zinc-700 dark:bg-zinc-900/60">
            <p className="text-lg font-semibold text-emerald-950 dark:text-zinc-100">
              {isCatalogPage
                ? "No products match your filters."
                : "No products match your search."}
            </p>
            <p className="mt-2 text-sm text-slate-500 dark:text-zinc-500">
              Try another keyword or{" "}
              <button
                type="button"
                onClick={() => router.push("/products")}
                className="font-semibold text-emerald-700 underline decoration-emerald-300 underline-offset-2 hover:text-emerald-800 dark:text-sky-400 dark:hover:text-sky-300"
              >
                clear filters
              </button>
              .
            </p>
          </div>
        ) : (
          <>
            <div className="products-grid grid grid-cols-2 gap-4 sm:gap-8 lg:grid-cols-4">
              {currentProducts.map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  onNavigate={navigateToProduct}
                  onOrder={sendWhatsApp}
                />
              ))}
            </div>

            <footer className="mt-20 flex items-center justify-between border-t border-emerald-100 pt-10 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="group inline-flex min-h-11 min-w-11 items-center gap-2 rounded-lg px-2 text-xs font-black tracking-widest text-emerald-900 uppercase transition-all disabled:opacity-40 dark:text-zinc-200"
              >
                <FiArrowLeft className="shrink-0 transition-transform group-hover:-translate-x-1" aria-hidden />
                <span>Back</span>
              </button>

              <div className="flex max-w-[min(100%,280px)] flex-wrap justify-center gap-2 sm:max-w-none sm:gap-4">
                {visiblePages[0] > 1 ? (
                  <span className="flex h-11 items-center px-1 text-xs text-slate-400">…</span>
                ) : null}
                {visiblePages.map((page) => (
                  <button
                    type="button"
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`h-11 min-w-[2.75rem] rounded-xl px-2 text-xs font-black transition-all ${
                      page === safePage
                        ? "scale-110 bg-emerald-600 text-white shadow-lg shadow-emerald-200 dark:bg-sky-600 dark:shadow-sky-900/50"
                        : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-sky-300"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                {visiblePages[visiblePages.length - 1] < totalPages ? (
                  <span className="flex h-11 items-center px-1 text-xs text-slate-400">…</span>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="group inline-flex min-h-11 min-w-11 items-center gap-2 rounded-lg px-2 text-xs font-black tracking-widest text-emerald-900 uppercase transition-all disabled:opacity-40 dark:text-zinc-200"
              >
                <span>Next</span>
                <FiArrowRight className="shrink-0 transition-transform group-hover:translate-x-1" aria-hidden />
              </button>
            </footer>
          </>
        )}
      </div>
    </section>
  );
}

export default function ProductsSection({
  products,
  categories = [],
}: {
  products: Product[];
  categories?: Category[];
}) {
  return (
    <Suspense fallback={<ProductsSectionSkeleton />}>
      <ProductsSectionInner products={products} categories={categories} />
    </Suspense>
  );
}
