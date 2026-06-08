import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFetchMock, mockNetworkError } from "../../../helpers/mock-fetch";
import {
  mockCategory,
  mockProduct,
  mockReview,
} from "../../../helpers/fixtures";

describe("server-fetch API integration", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("fetchProductsFromApi extracts products list", async () => {
    createFetchMock(({ url }) => {
      if (url.includes("/api/products") && !url.includes("/api/products/")) {
        return { ok: true, body: { data: { products: [mockProduct] } } };
      }
      return { ok: false, status: 404, body: {} };
    });

    const { fetchProductsFromApi } = await import("@/lib/api/server-fetch");
    const products = await fetchProductsFromApi();
    expect(products).toEqual([mockProduct]);
  });

  it("fetchProductsFromApi passes categoryId query param", async () => {
    const fetchMock = createFetchMock(({ url }) => {
      if (url.includes("categoryId=cat-1")) {
        return { ok: true, body: { products: [mockProduct] } };
      }
      return { ok: false, status: 404, body: {} };
    });

    const { fetchProductsFromApi } = await import("@/lib/api/server-fetch");
    await fetchProductsFromApi("cat-1");
    expect(fetchMock.mock.calls[0][0]).toBeDefined();
    const ctx = fetchMock.mock.calls[0];
    const url = typeof ctx[0] === "string" ? ctx[0] : (ctx[0] as Request).url;
    expect(url).toContain("categoryId=cat-1");
  });

  it("fetchProductByIdFromApi returns product or undefined", async () => {
    createFetchMock(({ url }) => {
      if (url.endsWith("/api/products/prod-1")) {
        return { ok: true, body: { product: mockProduct } };
      }
      if (url.endsWith("/api/products/missing")) {
        return { ok: false, status: 404, body: { message: "Not found" } };
      }
      return { ok: false, status: 404, body: {} };
    });

    const { fetchProductByIdFromApi } = await import("@/lib/api/server-fetch");
    expect(await fetchProductByIdFromApi("prod-1")).toEqual(mockProduct);
    expect(await fetchProductByIdFromApi("missing")).toBeUndefined();
  });

  it("fetchCategoriesFromApi returns categories", async () => {
    createFetchMock(({ url }) => {
      if (url.includes("/api/categories") && !url.includes("/api/categories/")) {
        return { ok: true, body: { categories: [mockCategory] } };
      }
      return { ok: false, status: 404, body: {} };
    });

    const { fetchCategoriesFromApi } = await import("@/lib/api/server-fetch");
    expect(await fetchCategoriesFromApi()).toEqual([mockCategory]);
  });

  it("fetchCategoryByIdFromApi returns category or undefined", async () => {
    createFetchMock(({ url }) => {
      if (url.endsWith("/api/categories/cat-1")) {
        return { ok: true, body: { category: mockCategory } };
      }
      return { ok: false, status: 404, body: { message: "Not found" } };
    });

    const { fetchCategoryByIdFromApi } = await import("@/lib/api/server-fetch");
    expect(await fetchCategoryByIdFromApi("cat-1")).toEqual(mockCategory);
    expect(await fetchCategoryByIdFromApi("missing")).toBeUndefined();
  });

  it("fetchReviewsFromApi normalizes reviews", async () => {
    createFetchMock(({ url }) => {
      if (url.includes("/api/reviews?productId=prod-1")) {
        return {
          ok: true,
          body: {
            reviews: [
              {
                id: mockReview.id,
                productId: mockReview.productId,
                rating: mockReview.rating,
                reviewer: { name: "Alice" },
              },
            ],
          },
        };
      }
      return { ok: false, status: 404, body: {} };
    });

    const { fetchReviewsFromApi } = await import("@/lib/api/server-fetch");
    const reviews = await fetchReviewsFromApi("prod-1");
    expect(reviews).toHaveLength(1);
    expect(reviews[0].reviewer?.name).toBe("Alice");
  });

  it("throws network error when fetch fails", async () => {
    mockNetworkError();

    const { fetchProductsFromApi } = await import("@/lib/api/server-fetch");
    await expect(fetchProductsFromApi()).rejects.toThrow(/Could not reach the API/);
  });

  it("checkHealth returns true when API is up", async () => {
    createFetchMock(({ url }) => {
      if (url.endsWith("/health")) return { ok: true, body: { status: "ok" } };
      return { ok: false, status: 404, body: {} };
    });

    const { checkHealth } = await import("@/lib/api/server-fetch");
    expect(await checkHealth()).toBe(true);
  });

  it("checkHealth returns false when API is down", async () => {
    mockNetworkError();

    const { checkHealth } = await import("@/lib/api/server-fetch");
    expect(await checkHealth()).toBe(false);
  });
});
