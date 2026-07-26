import { cache } from "react";
import type { Category, Product } from "@/lib/types/api";
import {
  fetchCategoriesFromApi,
  fetchProductByIdFromApi,
  fetchProductsFromApi,
} from "@/lib/api/server-fetch";
import { filterProductsByCategoryId } from "@/lib/utils/product-display";

export const fetchProducts = cache(async function fetchProducts(
  categoryId?: string
): Promise<Product[]> {
  return fetchProductsFromApi(categoryId).catch(() => []);
});

export const fetchProductCategories = cache(async function fetchProductCategories(): Promise<
  Category[]
> {
  return fetchCategoriesFromApi().catch(() => []);
});

export const fetchProductById = cache(async function fetchProductById(
  id: string
): Promise<Product | undefined> {
  return fetchProductByIdFromApi(id);
});

export const fetchCategoryById = cache(async function fetchCategoryById(
  id: string
): Promise<Category | undefined> {
  const { fetchCategoryByIdFromApi } = await import("@/lib/api/server-fetch");
  return fetchCategoryByIdFromApi(id);
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
