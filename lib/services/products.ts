import { cache } from "react";
import type { Category, Product } from "@/lib/types/api";
import {
  fetchCategoriesFromApi,
  fetchProductByIdFromApi,
  fetchProductsFromApi,
} from "@/lib/api/server-fetch";
import {
  allProducts,
  filterProductsByCategorySlug,
  getSeedProductCategories,
} from "@/lib/data/products";

async function withFallback<T>(apiCall: () => Promise<T>, fallback: () => T): Promise<T> {
  try {
    const result = await apiCall();
    if (Array.isArray(result) && result.length === 0) {
      const seed = fallback();
      return Array.isArray(seed) && seed.length > 0 ? seed : result;
    }
    return result;
  } catch {
    return fallback();
  }
}

export const fetchProducts = cache(async function fetchProducts(): Promise<Product[]> {
  return withFallback(fetchProductsFromApi, () => allProducts);
});

export const fetchProductCategories = cache(async function fetchProductCategories(): Promise<
  Category[]
> {
  return withFallback(fetchCategoriesFromApi, () =>
    getSeedProductCategories().map((c, i) => ({ ...c, id: c.slug || i }))
  );
});

export const fetchProductById = cache(async function fetchProductById(
  id: number
): Promise<Product | undefined> {
  try {
    const product = await fetchProductByIdFromApi(id);
    if (product) return product;
  } catch {
    // fall through to seed
  }
  return allProducts.find((p) => p.id === id);
});

export async function fetchProductsForCategorySlug(
  slug: string | null,
  validSlugs?: ReadonlySet<string>
): Promise<Product[]> {
  const all = await fetchProducts();
  return filterProductsByCategorySlug(all, slug, validSlugs);
}

export async function fetchRelatedProducts(product: Product, limit = 2): Promise<Product[]> {
  const all = await fetchProducts();
  return all
    .filter((item) => item.id !== product.id && item.brand === product.brand)
    .slice(0, limit);
}
