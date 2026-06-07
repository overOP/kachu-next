import { API_ORIGIN } from "@/lib/api/config";
import { parseFetchResponseError } from "@/lib/api/errors";
import type { Category, Product, Review } from "@/lib/types/api";

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

export async function fetchProductsFromApi(): Promise<Product[]> {
  const data = await serverFetch<{ products: Product[] }>("/api/products");
  return data.products ?? [];
}

export async function fetchProductByIdFromApi(id: number): Promise<Product | undefined> {
  try {
    const data = await serverFetch<{ product: Product }>(`/api/products/${id}`);
    return data.product;
  } catch {
    return undefined;
  }
}

export async function fetchCategoriesFromApi(): Promise<Category[]> {
  const data = await serverFetch<{ categories: Category[] }>("/api/categories");
  return data.categories ?? [];
}

export async function fetchCategoryByIdFromApi(
  id: string | number
): Promise<Category | undefined> {
  try {
    const data = await serverFetch<{ category: Category }>(`/api/categories/${id}`);
    return data.category;
  } catch {
    return undefined;
  }
}

export async function fetchReviewsFromApi(productId?: number): Promise<Review[]> {
  const qs = productId != null ? `?productId=${productId}` : "";
  const data = await serverFetch<{ reviews: Review[] }>(`/api/reviews${qs}`);
  return data.reviews ?? [];
}

export async function fetchReviewByIdFromApi(
  id: string | number
): Promise<Review | undefined> {
  try {
    const data = await serverFetch<{ review: Review }>(`/api/reviews/${id}`);
    return data.review;
  } catch {
    return undefined;
  }
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
