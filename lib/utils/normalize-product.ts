import type { Product } from "@/lib/types/api";

/** Coerce backend image payloads (array, JSON string, or single URL) into string[]. */
export function normalizeProductImages(images: unknown): string[] {
  if (images == null) return [];

  if (Array.isArray(images)) {
    return images.filter(
      (item): item is string => typeof item === "string" && item.trim().length > 0
    );
  }

  if (typeof images === "string") {
    const trimmed = images.trim();
    if (!trimmed) return [];

    if (trimmed.startsWith("[")) {
      try {
        const parsed: unknown = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (item): item is string => typeof item === "string" && item.trim().length > 0
          );
        }
      } catch {
        // Treat as a single URL below.
      }
    }

    return [trimmed];
  }

  return [];
}

export function normalizeProduct(product: Product): Product {
  return {
    ...product,
    images: normalizeProductImages(product.images),
  };
}

export function normalizeProducts(products: Product[]): Product[] {
  return products.map(normalizeProduct);
}
