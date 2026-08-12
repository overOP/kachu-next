import { cache } from "react";
import type { Category, Product } from "@/lib/types/api";
import {
  fetchSanityCategories,
  fetchSanityCategoryBySlug,
  fetchSanityProductBySlug,
  fetchSanityProducts,
} from "@/lib/sanity/queries";
import { localCategories, localProducts } from "@/lib/data/local-catalog";
import { filterProductsByCategoryId } from "@/lib/utils/product-display";

// ponytail: always show the bundled local catalog alongside whatever Sanity has —
// Sanity entries win on id collisions, local fills in the rest. A Sanity fetch
// failure just leaves the local catalog as the whole list.
function mergeById<T extends { id: string }>(primary: T[], fallback: T[]): T[] {
  const merged = new Map(fallback.map((item) => [item.id, item]));
  for (const item of primary) merged.set(item.id, item);
  return Array.from(merged.values());
}

export const fetchProducts = cache(async function fetchProducts(
  categoryId?: string
): Promise<Product[]> {
  const localFallback = filterProductsByCategoryId(localProducts, categoryId ?? null);
  const sanityProducts = await fetchSanityProducts(categoryId).catch(() => []);
  return mergeById(sanityProducts, localFallback);
});

export const fetchProductCategories = cache(async function fetchProductCategories(): Promise<
  Category[]
> {
  const sanityCategories = await fetchSanityCategories().catch(() => []);
  return mergeById(sanityCategories, localCategories);
});

export const fetchProductById = cache(async function fetchProductById(
  id: string
): Promise<Product | undefined> {
  const product = await fetchSanityProductBySlug(id).catch(() => undefined);
  return product ?? localProducts.find((p) => p.id === id);
});

export const fetchCategoryById = cache(async function fetchCategoryById(
  id: string
): Promise<Category | undefined> {
  const category = await fetchSanityCategoryBySlug(id).catch(() => undefined);
  return category ?? localCategories.find((c) => c.id === id);
});

export async function fetchProductsForCategoryId(
  categoryId: string | null
): Promise<Product[]> {
  if (!categoryId || categoryId === "all") {
    return fetchProducts();
  }
  return fetchProducts(categoryId);
}

export async function fetchRelatedProducts(
  product: Product,
  limit = 2
): Promise<Product[]> {
  // Category-scoped fetch avoids loading the entire catalog for two related items.
  const pool = product.categoryId
    ? await fetchProducts(product.categoryId)
    : await fetchProducts();

  return pool.filter((item) => item.id !== product.id).slice(0, limit);
}

export { filterProductsByCategoryId };
