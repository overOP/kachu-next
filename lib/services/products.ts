import { cache } from "react";
import type { Product, ProductCategory } from "@/lib/data/products";
import {
  allProducts,
  filterProductsByCategorySlug,
  getSeedProductCategories,
} from "@/lib/data/products";

/**
 * Catalog reads use in-repo seed data until the product API is wired for production.
 * Deduplicated per request via React `cache()`.
 */
export const fetchProducts = cache(async function fetchProducts(): Promise<Product[]> {
  return allProducts;
});

/**
 * Category list for filters — seed metadata only.
 * Deduplicated per request via React `cache()`.
 */
export const fetchProductCategories = cache(async function fetchProductCategories(): Promise<
  ProductCategory[]
> {
  return getSeedProductCategories();
});

export const fetchProductById = cache(async function fetchProductById(id: number): Promise<Product | undefined> {
  return allProducts.find((p) => p.id === id);
});

export async function fetchProductsForCategorySlug(
  slug: string | null,
  validSlugs?: ReadonlySet<string>
): Promise<Product[]> {
  const all = await fetchProducts();
  return filterProductsByCategorySlug(all, slug, validSlugs);
}

export async function fetchRelatedProducts(
  product: Product,
  limit = 2
): Promise<Product[]> {
  const all = await fetchProducts();
  return all
    .filter((item) => item.id !== product.id && item.brand === product.brand)
    .slice(0, limit);
}
