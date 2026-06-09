import { API_ORIGIN } from "@/lib/api/config";
import { parseFetchResponseError } from "@/lib/api/errors";
import { extractItem, extractList } from "@/lib/api/parse-response";
import type { Category, Product, Review } from "@/lib/types/api";
import { normalizeProduct, normalizeProducts } from "@/lib/utils/normalize-product";
import { normalizeReviews } from "@/lib/utils/review-normalize";

/** ISR window for public catalog data — pages should not set `force-dynamic` unless admin-only. */
const DEFAULT_REVALIDATE = 60;

type ServerFetchOptions = {
  revalidate?: number | false;
  token?: string | null;
};

async function serverFetch<T>(
  path: string,
  options: ServerFetchOptions = {}
): Promise<T> {
  const { revalidate = DEFAULT_REVALIDATE, token } = options;
  const url = `${API_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;

  const headers: HeadersInit = { Accept: "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(url, {
      headers,
      next: revalidate === false ? { revalidate: 0 } : { revalidate },
      cache: revalidate === false ? "no-store" : undefined,
    });
  } catch {
    throw new Error("Network error. Could not reach the API.");
  }

  const body: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    const parsed = parseFetchResponseError(res, body);
    throw new Error(parsed.message);
  }

  return body as T;
}

export async function fetchProductsFromApi(categoryId?: string): Promise<Product[]> {
  const qs = categoryId ? `?categoryId=${encodeURIComponent(categoryId)}` : "";
  const body = await serverFetch<unknown>(`/api/products${qs}`);
  return normalizeProducts(extractList<Product>(body, ["products"]));
}

export async function fetchProductByIdFromApi(id: string): Promise<Product | undefined> {
  try {
    const body = await serverFetch<unknown>(`/api/products/${id}`);
    const product = extractItem<Product>(body, ["product"]);
    return product ? normalizeProduct(product) : undefined;
  } catch {
    return undefined;
  }
}

export async function fetchCategoriesFromApi(): Promise<Category[]> {
  const body = await serverFetch<unknown>("/api/categories");
  return extractList<Category>(body, ["categories"]);
}

export async function fetchCategoryByIdFromApi(id: string): Promise<Category | undefined> {
  try {
    const body = await serverFetch<unknown>(`/api/categories/${id}`);
    return extractItem<Category>(body, ["category"]);
  } catch {
    return undefined;
  }
}

export async function fetchReviewsFromApi(productId?: string): Promise<Review[]> {
  const qs = productId != null ? `?productId=${encodeURIComponent(productId)}` : "";
  const body = await serverFetch<unknown>(`/api/reviews${qs}`);
  const raw = extractList<unknown>(body, ["reviews"]);
  return normalizeReviews(raw);
}

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_ORIGIN}/health`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 0 },
    });
    return res.ok;
  } catch {
    return false;
  }
}
