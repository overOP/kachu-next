import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import type { Product } from "@/lib/types/api";
import { buildProductOrderMessage, buildWhatsAppUrl } from "@/lib/constants/contact";
import {
  productImage,
  productImages,
  productMoqLabel,
  productPriceLabel,
  productStockLabel,
} from "@/lib/utils/product-display";

type ProductDetailProps = {
  product: Product;
  relatedProducts: Product[];
};

export default function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
  const whatsappUrl = buildWhatsAppUrl(buildProductOrderMessage(product));
  const images = productImages(product);
  const stock = productStockLabel(product);

  return (
    <div className="bg-emerald-50/40 dark:bg-zinc-950 px-4 py-8 sm:py-12 sm:px-6 md:px-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/products"
          className="inline-flex items-center text-sm font-bold text-emerald-700 hover:text-emerald-900 dark:text-sky-400 dark:hover:text-sky-300 transition-colors"
        >
          ← Back to products
        </Link>

        <section className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 rounded-3xl bg-white dark:bg-zinc-900 p-4 sm:p-8 md:p-10 border border-emerald-100 dark:border-zinc-800 shadow-2xl shadow-emerald-900/5 dark:shadow-black/50 dark:ring-1 dark:ring-zinc-800">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-50 dark:bg-zinc-800/70">
            <Image
              src={productImage(product)}
              alt={product.name}
              fill
              className="object-contain p-6 sm:p-10 mix-blend-multiply dark:mix-blend-normal dark:drop-shadow-[0_10px_28px_rgba(255,255,255,0.14)]"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>

          <div className="flex flex-col justify-center">
            {product.category?.name ? (
              <Link
                href={`/categories/${product.categoryId}`}
                className="text-xs uppercase tracking-[0.25em] font-bold text-emerald-600 dark:text-sky-400 hover:underline"
              >
                {product.category.name}
              </Link>
            ) : null}
            <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-emerald-950 dark:text-zinc-50">
              {product.name}
            </h1>
            <p className="mt-4 whitespace-pre-line text-sm sm:text-base text-slate-600 dark:text-zinc-400 leading-relaxed">
              {product.description}
            </p>

            {images.length > 1 ? (
              <div className="mt-4 flex gap-2 overflow-x-auto">
                {images.map((src, i) => (
                  <div key={src + i} className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-emerald-100 dark:border-zinc-700">
                    <Image src={src} alt="" fill className="object-contain p-1" sizes="64px" />
                  </div>
                ))}
              </div>
            ) : null}

            {relatedProducts.length > 0 && (
              <div className="mt-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-700 dark:text-sky-400 mb-3">
                  Related Products
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {relatedProducts.map((related) => (
                    <Link
                      key={related.id}
                      href={`/product/${related.id}`}
                      className="group flex items-center gap-3 rounded-xl border border-emerald-100 dark:border-zinc-700 bg-emerald-50/40 dark:bg-zinc-800/60 p-2.5 hover:border-emerald-300 dark:hover:border-sky-600/50 transition-colors"
                    >
                      <div className="relative h-14 w-14 rounded-lg bg-white dark:bg-zinc-900 overflow-hidden shrink-0">
                        <Image src={productImage(related)} alt={related.name} fill className="object-contain p-2" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-emerald-950 dark:text-zinc-100 truncate">{related.name}</p>
                        <p className="text-xs font-semibold text-slate-600 dark:text-zinc-300">{productPriceLabel(related)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 rounded-2xl bg-emerald-50 dark:bg-zinc-800/70 p-4 border border-emerald-100 dark:border-zinc-700">
              <p className="text-[10px] uppercase tracking-[0.18em] text-emerald-700 dark:text-sky-400 font-bold">Price</p>
              <p className="mt-1 text-lg sm:text-2xl font-black text-emerald-950 dark:text-zinc-50">{productPriceLabel(product)}</p>
            </div>

            <div className="mt-4 flex flex-wrap gap-3 text-sm font-bold text-slate-600 dark:text-zinc-300">
              <span>{productMoqLabel(product)}</span>
              {stock ? <span>{stock}</span> : null}
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white transition-colors hover:bg-emerald-700 dark:bg-sky-600 dark:hover:bg-sky-500 sm:w-auto"
            >
              <FaWhatsapp size={18} aria-hidden />
              Order on WhatsApp
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
