import type { Product, Review } from "@/lib/types/api";
import { resolveImageSrc } from "@/lib/utils/image-src";
import { normalizeProductImages } from "@/lib/utils/normalize-product";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&q=80";

export function productImage(product: Product): string {
  const images = normalizeProductImages(product.images).map(resolveImageSrc);
  if (images[0]) return images[0];
  const categoryImage = product.category?.image;
  if (categoryImage) return resolveImageSrc(categoryImage);
  return PLACEHOLDER_IMAGE;
}

export function productImages(product: Product): string[] {
  const images = normalizeProductImages(product.images).map(resolveImageSrc);
  if (images.length) return images;
  const fallback = product.category?.image;
  return fallback ? [resolveImageSrc(fallback)] : [PLACEHOLDER_IMAGE];
}

export function productPriceLabel(product: Product): string {
  const raw = product.price;
  if (typeof raw === "number" && Number.isFinite(raw)) {
    return `NPR ${raw.toLocaleString()}`;
  }
  const parsed = Number(String(raw).replace(/[^\d.]/g, ""));
  if (Number.isFinite(parsed) && parsed > 0) {
    return `NPR ${parsed.toLocaleString()}`;
  }
  return String(raw);
}

export function productMoqLabel(product: Product): string {
  return `MOQ: ${product.minimumOrder} unit${product.minimumOrder === 1 ? "" : "s"}`;
}

export function productStockLabel(product: Product): string | null {
  if (product.stock == null) return null;
  return `${product.stock} in stock`;
}

export function averageRatingFromReviews(reviews: Review[]): number {
  if (!reviews.length) return 0;
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  return Math.round(avg * 10) / 10;
}

export function averageRatingFromProduct(product: Product): number {
  return averageRatingFromReviews(product.reviews ?? []);
}

export function reviewAuthor(review: Review): string {
  return review.reviewer?.name ?? "Customer";
}

export function filterProductsByCategoryId(
  products: Product[],
  categoryId: string | null
): Product[] {
  if (!categoryId || categoryId === "all") return products;
  return products.filter((p) => p.categoryId === categoryId);
}

export function filterProductsByQuery(products: Product[], query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return products;
  return products.filter((p) => {
    const hay = `${p.name} ${p.description} ${productPriceLabel(p)} ${p.category?.name ?? ""}`.toLowerCase();
    return hay.includes(q);
  });
}
