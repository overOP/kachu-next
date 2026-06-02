import type { Product } from "@/lib/data/products";

/** Case-insensitive match on name, brand, description, and price display. */
export function filterProductsByQuery(products: Product[], query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return products;
  return products.filter((p) => {
    const hay = `${p.name} ${p.brand} ${p.Description} ${p.price}`.toLowerCase();
    return hay.includes(q);
  });
}
