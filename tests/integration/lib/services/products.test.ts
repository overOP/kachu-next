import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  mockProduct,
  mockProductOtherCategory,
  mockProductTwo,
} from "../../../helpers/fixtures";

const fetchProductsFromApi = vi.fn();
const fetchProductByIdFromApi = vi.fn();
const fetchCategoriesFromApi = vi.fn();
const fetchCategoryByIdFromApi = vi.fn();

vi.mock("@/lib/api/server-fetch", () => ({
  fetchProductsFromApi: (...args: unknown[]) => fetchProductsFromApi(...args),
  fetchProductByIdFromApi: (...args: unknown[]) => fetchProductByIdFromApi(...args),
  fetchCategoriesFromApi: (...args: unknown[]) => fetchCategoriesFromApi(...args),
  fetchCategoryByIdFromApi: (...args: unknown[]) => fetchCategoryByIdFromApi(...args),
}));

describe("products service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("fetchProductsForCategoryId loads all products for null/all", async () => {
    fetchProductsFromApi.mockResolvedValue([mockProduct, mockProductTwo]);

    const { fetchProductsForCategoryId } = await import("@/lib/services/products");

    await expect(fetchProductsForCategoryId(null)).resolves.toHaveLength(2);
    await expect(fetchProductsForCategoryId("all")).resolves.toHaveLength(2);
    expect(fetchProductsFromApi).toHaveBeenCalledWith(undefined);
  });

  it("fetchProductsForCategoryId scopes by category id", async () => {
    fetchProductsFromApi.mockResolvedValue([mockProduct, mockProductTwo]);

    const { fetchProductsForCategoryId } = await import("@/lib/services/products");
    const result = await fetchProductsForCategoryId("cat-1");

    expect(fetchProductsFromApi).toHaveBeenCalledWith("cat-1");
    expect(result).toHaveLength(2);
  });

  it("fetchRelatedProducts uses category-scoped pool and excludes self", async () => {
    fetchProductsFromApi.mockResolvedValue([
      mockProduct,
      mockProductTwo,
      mockProductOtherCategory,
    ]);

    const { fetchRelatedProducts } = await import("@/lib/services/products");
    const related = await fetchRelatedProducts(mockProduct, 2);

    expect(fetchProductsFromApi).toHaveBeenCalledWith("cat-1");
    expect(related).toHaveLength(2);
    expect(related.map((p) => p.id)).toEqual(["prod-2", "prod-3"]);
    expect(related.every((p) => p.id !== mockProduct.id)).toBe(true);
  });

  it("fetchRelatedProducts falls back to full catalog without categoryId", async () => {
    const orphan = { ...mockProduct, categoryId: "", id: "orphan" };
    fetchProductsFromApi.mockResolvedValue([orphan, mockProductTwo]);

    const { fetchRelatedProducts } = await import("@/lib/services/products");
    const related = await fetchRelatedProducts(orphan, 1);

    expect(fetchProductsFromApi).toHaveBeenCalledWith(undefined);
    expect(related).toHaveLength(1);
    expect(related[0].id).toBe("prod-2");
  });

  it("fetchRelatedProducts respects limit", async () => {
    fetchProductsFromApi.mockResolvedValue([
      mockProduct,
      mockProductTwo,
      { ...mockProductTwo, id: "prod-4" },
    ]);

    const { fetchRelatedProducts } = await import("@/lib/services/products");
    const related = await fetchRelatedProducts(mockProduct, 1);

    expect(related).toHaveLength(1);
  });
});
