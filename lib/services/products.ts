import type { Product, ProductCategory } from "@/lib/data/products";
import { filterProductsByCategorySlug, getSeedProductCategories } from "@/lib/data/products";
import { getCatalogSnapshot } from "@/lib/services/product-catalog";

/**
 * Central catalog fetch. Uses in-memory catalog (seed + admin adds); swap for API when ready.
 *
 * @example
 * ```ts
 * const res = await fetch(`${process.env.API_URL}/products`, {
 *   next: { revalidate: 60 },
 * });
 * if (!res.ok) throw new Error("Failed to load products");
 * return res.json() as Promise<Product[]>;
 * ```
 */
export async function fetchProducts(): Promise<Product[]> {
  return getCatalogSnapshot();
}

/**
 * Category list for filters (toolbar, URL validation). Replace with `fetch(\`${API}/categories\`)` when ready.
 *
 * @example
 * ```ts
 * const res = await fetch(`${process.env.API_URL}/categories`);
 * return res.json() as Promise<ProductCategory[]>;
 * ```
 */
export async function fetchProductCategories(): Promise<ProductCategory[]> {
  return [...getSeedProductCategories()];
}

export async function fetchProductById(id: number): Promise<Product | undefined> {
  const products = await fetchProducts();
  return products.find((p) => p.id === id);
}

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
