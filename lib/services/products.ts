import { cache } from "react";
import type { Category, Product } from "@/lib/types/api";
import {
  fetchCategoriesFromApi,
  fetchProductByIdFromApi,
  fetchProductsFromApi,
} from "@/lib/api/server-fetch";
import { localCategories, localProducts } from "@/lib/data/local-catalog";
import { filterProductsByCategoryId } from "@/lib/utils/product-display";

// ponytail: backend is optional — any API failure falls back to the bundled local catalog
// so the storefront still has real products instead of an empty page.
export const fetchProducts = cache(async function fetchProducts(
  categoryId?: string
): Promise<Product[]> {
  return fetchProductsFromApi(categoryId).catch(() =>
    filterProductsByCategoryId(localProducts, categoryId ?? null)
  );
});

export const fetchProductCategories = cache(async function fetchProductCategories(): Promise<
  Category[]
> {
  return fetchCategoriesFromApi().catch(() => localCategories);
});

export const fetchProductById = cache(async function fetchProductById(
  id: string
): Promise<Product | undefined> {
  const product = await fetchProductByIdFromApi(id);
  return product ?? localProducts.find((p) => p.id === id);
});

export const fetchCategoryById = cache(async function fetchCategoryById(
  id: string
): Promise<Category | undefined> {
  const { fetchCategoryByIdFromApi } = await import("@/lib/api/server-fetch");
  const category = await fetchCategoryByIdFromApi(id);
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
