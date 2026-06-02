import type { Product } from "@/lib/data/products";
import { allProducts as seedCatalog } from "@/lib/data/products";

/**
 * In-memory catalog (seed + admin-added rows). Survives for the lifetime of the Node process.
 * Replace with DB + repository when you wire persistence.
 */
let catalog: Product[] | null = null;

function ensureCatalog(): Product[] {
  if (!catalog) {
    catalog = [...seedCatalog];
  }
  return catalog;
}

export function getCatalogSnapshot(): Product[] {
  return [...ensureCatalog()];
}

export function addProduct(input: Omit<Product, "id">): Product {
  const list = ensureCatalog();
  const nextId = Math.max(0, ...list.map((p) => p.id)) + 1;
  const product: Product = { ...input, id: nextId };
  list.push(product);
  return product;
}
