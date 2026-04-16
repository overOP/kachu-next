"use client";

import React, {
  Suspense,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiArrowLeft, FiArrowRight, FiShoppingBag } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import ProductsCatalogToolbar from "@/components/products/ProductsCatalogToolbar";
import {
  filterProductsByCategorySlug,
  type Product,
  type ProductCategory,
} from "@/lib/data/products";
import { filterProductsByQuery } from "@/lib/search/filter-products";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function ProductsSectionSkeleton() {
  return (
    <section className="bg-emerald-50/30 dark:bg-zinc-950 py-16 sm:py-24 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 h-10 w-2/3 max-w-md rounded-lg bg-emerald-100/80 dark:bg-zinc-800 animate-pulse" />
        <div className="products-grid grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl sm:rounded-[2rem] border border-emerald-100 dark:border-zinc-700/80 bg-white dark:bg-zinc-900/90 p-3 sm:p-4 animate-pulse"
            >
              <div className="aspect-square rounded-xl sm:rounded-[1.5rem] bg-slate-200 dark:bg-zinc-800" />
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
  categories: ProductCategory[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const deferredQuery = useDeferredValue(query);

  const isCatalogPage = pathname === "/products";
  const validCategorySlugs = useMemo(
    () => new Set(categories.map((c) => c.slug)),
    [categories]
  );

  const rawCategory = searchParams.get("category");
  const categorySlug =
    isCatalogPage &&
    rawCategory &&
    validCategorySlugs.size > 0 &&
    validCategorySlugs.has(rawCategory)
      ? rawCategory
      : "all";
  const deferredCategory = useDeferredValue(categorySlug);

  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const replaceCategory = useCallback(
    (slug: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (slug === "all") params.delete("category");
      else params.set("category", slug);
      const qs = params.toString();
      router.replace(qs ? `/products?${qs}` : "/products", { scroll: false });
    },
    [router, searchParams]
  );

  const basePool = useMemo(() => {
    if (!isCatalogPage) return products;
    return filterProductsByCategorySlug(
      products,
      deferredCategory === "all" ? null : deferredCategory,
      validCategorySlugs
    );
  }, [isCatalogPage, deferredCategory, products, validCategorySlugs]);

  const filteredProducts = useMemo(
    () => filterProductsByQuery(basePool, deferredQuery),
    [basePool, deferredQuery]
  );

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setCurrentPage(1);
    });
    return () => cancelAnimationFrame(id);
  }, [deferredQuery, deferredCategory]);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setCurrentPage((p) => Math.min(p, totalPages));
    });
    return () => cancelAnimationFrame(id);
  }, [totalPages]);

  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

 

  const sendWhatsApp = (item: Product) => {
    const phoneNumber = "9779857043288";
    const message = `Hello! I'm interested in the following product:\n\nProduct:${item.name}\nBrand:${item.brand}\nPrice:${item.price}\nMOQ:${item.quantity}\n\nCould you please provide more details?`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const categoryLabel =
    isCatalogPage && categorySlug !== "all"
      ? categories.find((c) => c.slug === categorySlug)?.label ?? ""
      : "";

  const resultLabel =
    query.trim().length > 0
      ? `${filteredProducts.length} match${filteredProducts.length === 1 ? "" : "es"} for “${query.trim()}”${categoryLabel ? ` · ${categoryLabel}` : ""}`
      : `Displaying ${startIndex + 1} — ${startIndex + currentProducts.length} of ${filteredProducts.length} results${categoryLabel ? ` · ${categoryLabel}` : ""}`;

  return (
    <section
      ref={containerRef}
      className="bg-emerald-50/30 dark:bg-zinc-950 py-16 sm:py-24 px-4 sm:px-6 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <header className="mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h3 className="text-emerald-600 dark:text-sky-400 font-bold tracking-widest uppercase text-sm mb-4">
                Curated Selection
              </h3>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-emerald-950 dark:text-zinc-50 tracking-tighter">
                Popular <span className="text-emerald-600 dark:text-sky-400">Products</span>
              </h2>
              <div className="h-1.5 w-20 bg-emerald-500 dark:bg-sky-500 mt-6 rounded-full" />
            </div>
            <p className="text-slate-500 dark:text-zinc-400 font-medium text-sm border-l-2 border-emerald-200 dark:border-zinc-700 pl-4 mb-2 max-w-md">
              {resultLabel}
            </p>
          </div>
        </header>

        {isCatalogPage && categories.length > 0 && (
          <ProductsCatalogToolbar
            categories={categories}
            categorySlug={categorySlug}
            onCategoryChange={replaceCategory}
          />
        )}

        {filteredProducts.length === 0 ? (
          <div className="rounded-3xl border border-emerald-100 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/60 px-8 py-16 text-center">
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
            <div className="products-grid grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
              {currentProducts.map((item) => (
                <div
                  key={item.id}
                  className="product-card group bg-white dark:bg-zinc-900/90 rounded-2xl sm:rounded-[2rem] p-3 sm:p-4 flex flex-col transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-900/10 dark:hover:shadow-black/50 hover:-translate-y-3 cursor-pointer border border-emerald-100 dark:border-zinc-700/80"
                  onClick={() => router.push(`/product/${item.id}`)}
                >
                  <div className="relative aspect-square bg-slate-50 dark:bg-zinc-800/60 rounded-xl sm:rounded-[1.5rem] overflow-hidden flex items-center justify-center p-3 sm:p-8 transition-colors group-hover:bg-emerald-50/50 dark:group-hover:bg-zinc-800">
                    <Image
                      src={item.img}
                      alt={item.name}
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="object-contain p-2 sm:p-6 mix-blend-multiply dark:mix-blend-normal dark:drop-shadow-[0_8px_24px_rgba(255,255,255,0.12)] transition-transform duration-700 group-hover:scale-110"
                    />

                    <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-white dark:bg-zinc-900 shadow-sm p-1 sm:p-2 rounded-lg sm:rounded-xl">
                      <div className="relative w-4 h-4 sm:w-6 sm:h-6">
                        <Image
                          src={item.logo}
                          alt={`${item.brand} logo`}
                          fill
                          sizes="24px"
                          className="object-contain"
                        />
                      </div>
                    </div>

                    <div className="absolute inset-0 bg-emerald-900/10 dark:bg-zinc-950/40 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-center justify-center backdrop-blur-[2px]">
                      <div className="bg-emerald-600 dark:bg-sky-600 text-white px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform dark:hover:bg-sky-500">
                        <FiShoppingBag /> View Details
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-6 px-1 sm:px-2 pb-1 sm:pb-2">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-emerald-950 dark:text-zinc-100 font-bold text-sm sm:text-lg leading-tight">
                        {item.name}
                      </h4>
                      <span className="flex items-center gap-1 text-[9px] sm:text-[11px] font-bold text-emerald-700 dark:text-sky-300 bg-emerald-50 dark:bg-zinc-800 px-1.5 sm:px-2 py-0.5 rounded-lg">
                        ★ {item.rate.split("(")[0]}
                      </span>
                    </div>

                    <p className="text-[9px] sm:text-[11px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wide sm:tracking-widest">
                      {item.quantity}
                    </p>

                    <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-emerald-50 dark:border-zinc-700/80 flex items-center justify-between gap-2">
                      <span className="text-sm sm:text-xl font-black text-emerald-950 dark:text-zinc-50 tracking-tight">
                        {item.price}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          sendWhatsApp(item);
                        }}
                        className="flex items-center gap-1 sm:gap-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-sky-600 dark:hover:bg-sky-500 text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl transition-all duration-300 transform active:scale-95"
                      >
                        <FaWhatsapp size={14} />
                        <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-tighter">
                          Order
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <footer className="mt-20 pt-10 border-t border-emerald-100 dark:border-zinc-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-900 dark:text-zinc-200 disabled:opacity-30 group transition-all"
              >
                <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />{" "}
                Back
              </button>

              <div className="flex flex-wrap justify-center gap-2 sm:gap-4 max-w-[min(100%,280px)] sm:max-w-none">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    type="button"
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${
                      page === safePage
                        ? "bg-emerald-600 dark:bg-sky-600 text-white shadow-lg shadow-emerald-200 dark:shadow-sky-900/50 scale-110"
                        : "text-slate-300 dark:text-zinc-600 hover:text-emerald-600 dark:hover:text-sky-400 hover:bg-emerald-50 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-900 dark:text-zinc-200 disabled:opacity-30 group transition-all"
              >
                Next{" "}
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
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
  categories?: ProductCategory[];
}) {
  return (
    <Suspense fallback={<ProductsSectionSkeleton />}>
      <ProductsSectionInner products={products} categories={categories} />
    </Suspense>
  );
}
