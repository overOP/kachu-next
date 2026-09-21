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

// ponytail: Sanity is the source of truth once it returns anything. The bundled
// local catalog is an OFFLINE FALLBACK only — it used to be merged in as a union,
// which silently overwrote Sanity docs whenever a slug collided (the "25 in Studio,
// 19 on the site" bug) and made catalog edits invisible. Merge only when Sanity is
// empty or unreachable.
function sanityOrFallback<T>(sanity: T[], fallback: T[]): T[] {
  return sanity.length > 0 ? sanity : fallback;
}

const revalidate = 60;

export const fetchProducts = cache(async function fetchProducts(
  categoryId?: string
): Promise<Product[]> {
  const localFallback = filterProductsByCategoryId(localProducts, categoryId ?? null);
  const sanityProducts = await fetchSanityProducts(categoryId).catch(() => []);
  return sanityOrFallback(sanityProducts, localFallback);
});

export const fetchProductCategories = cache(async function fetchProductCategories(): Promise<
  Category[]
> {
  const sanityCategories = await fetchSanityCategories().catch(() => []);
  return sanityOrFallback(sanityCategories, localCategories);
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
export { revalidate };
