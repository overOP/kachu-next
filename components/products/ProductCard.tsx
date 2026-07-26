"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiShoppingBag } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import type { Product } from "@/lib/types/api";
import { productImage, productMoqLabel, productPriceLabel } from "@/lib/utils/product-display";

type ProductCardProps = {
  product: Product;
  /** Catalog grid: full card with hover overlay and WhatsApp CTA. */
  variant?: "catalog" | "compact";
  onNavigate?: (productId: string) => void;
  onOrder?: (product: Product) => void;
};

function ProductCard({
  product,
  variant = "catalog",
  onNavigate,
  onOrder,
}: ProductCardProps) {
  if (variant === "compact") {
    return (
      <Link
        href={`/product/${product.id}`}
        className="rounded-2xl border border-emerald-100 bg-white p-4 transition hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-50 dark:bg-zinc-800">
          <Image
            src={productImage(product)}
            alt={product.name}
            fill
            className="object-contain p-4"
            sizes="25vw"
          />
        </div>
        <h2 className="mt-3 font-bold text-emerald-950 dark:text-zinc-100">{product.name}</h2>
        <p className="text-sm text-slate-600 dark:text-zinc-400">{productMoqLabel(product)}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-black text-emerald-950 dark:text-zinc-50">
            {productPriceLabel(product)}
          </span>
        </div>
      </Link>
    );
  }

  return (
    <div
      className="product-card group flex cursor-pointer flex-col rounded-2xl border border-emerald-100 bg-white p-3 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-emerald-900/10 dark:border-zinc-700/80 dark:bg-zinc-900/90 dark:hover:shadow-black/50 sm:rounded-[2rem] sm:p-4"
      onClick={() => onNavigate?.(product.id)}
    >
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-slate-50 p-3 transition-colors group-hover:bg-emerald-50/50 dark:bg-zinc-800/60 dark:group-hover:bg-zinc-800 sm:rounded-[1.5rem] sm:p-8">
        <Image
          src={productImage(product)}
          alt={product.name}
          fill
          sizes="(max-width: 1024px) 50vw, 25vw"
          className="object-contain p-2 mix-blend-multiply transition-transform duration-700 group-hover:scale-110 dark:mix-blend-normal dark:drop-shadow-[0_8px_24px_rgba(255,255,255,0.12)] sm:p-6"
        />

        <div className="absolute inset-0 hidden items-center justify-center bg-emerald-900/10 opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100 dark:bg-zinc-950/40 sm:flex">
          <div className="flex translate-y-4 transform items-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-xs font-bold tracking-widest text-white uppercase transition-transform group-hover:translate-y-0 dark:bg-sky-600 dark:hover:bg-sky-500">
            <FiShoppingBag /> View Details
          </div>
        </div>
      </div>

      <div className="mt-4 px-1 pb-1 sm:mt-6 sm:px-2 sm:pb-2">
        <div className="mb-2 flex items-start justify-between">
          <h4 className="text-sm leading-tight font-bold text-emerald-950 dark:text-zinc-100 sm:text-lg">
            {product.name}
          </h4>
        </div>

        <p className="text-[9px] font-bold tracking-wide text-slate-600 uppercase sm:text-[11px] sm:tracking-widest dark:text-zinc-400">
          {productMoqLabel(product)}
        </p>

        <div className="mt-4 flex items-center justify-between gap-2 border-t border-emerald-50 pt-3 sm:mt-6 sm:pt-4 dark:border-zinc-700/80">
          <span className="text-sm font-black tracking-tight text-emerald-950 sm:text-xl dark:text-zinc-50">
            {productPriceLabel(product)}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOrder?.(product);
            }}
            aria-label={`Order ${product.name} on WhatsApp`}
            className="inline-flex min-h-10 min-w-10 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-white transition-all duration-300 hover:bg-emerald-700 active:scale-95 dark:bg-sky-600 dark:hover:bg-sky-500 sm:min-w-0 sm:rounded-xl sm:px-4 sm:py-2.5"
          >
            <FaWhatsapp size={16} className="shrink-0" aria-hidden />
            <span className="text-[10px] font-bold tracking-tighter uppercase sm:text-xs">Order</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(ProductCard);
