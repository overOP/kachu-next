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

vi.mock("@/lib/sanity/queries", () => ({
  fetchSanityProducts: (...args: unknown[]) => fetchProductsFromApi(...args),
  fetchSanityProductBySlug: (...args: unknown[]) => fetchProductByIdFromApi(...args),
  fetchSanityCategories: (...args: unknown[]) => fetchCategoriesFromApi(...args),
  fetchSanityCategoryBySlug: (...args: unknown[]) => fetchCategoryByIdFromApi(...args),
}));

// Fixed local catalog so merge-behavior assertions aren't coupled to the real data file.
const localOnlyProduct = { ...mockProductOtherCategory, id: "local-only" };
vi.mock("@/lib/data/local-catalog", () => ({
  localProducts: [mockProduct, localOnlyProduct],
  localCategories: [],
}));

describe("products service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("fetchProductsForCategoryId merges Sanity results with the local catalog for null/all", async () => {
    fetchProductsFromApi.mockResolvedValue([mockProductTwo]);

    const { fetchProductsForCategoryId } = await import("@/lib/services/products");

    const result = await fetchProductsForCategoryId(null);
    expect(result.map((p) => p.id).sort()).toEqual(["local-only", "prod-1", "prod-2"]);
    expect(fetchProductsFromApi).toHaveBeenCalledWith(undefined);
  });

  it("Sanity entries win over local entries on id collision", async () => {
    const sanityVersion = { ...mockProduct, name: "Sanity Wireless Earbuds" };
    fetchProductsFromApi.mockResolvedValue([sanityVersion]);

    const { fetchProductsForCategoryId } = await import("@/lib/services/products");
    const result = await fetchProductsForCategoryId(null);

    expect(result.find((p) => p.id === "prod-1")?.name).toBe("Sanity Wireless Earbuds");
  });

  it("falls back to the local catalog alone when Sanity fails", async () => {
    fetchProductsFromApi.mockRejectedValue(new Error("network error"));

    const { fetchProductsForCategoryId } = await import("@/lib/services/products");
    const result = await fetchProductsForCategoryId(null);

    expect(result.map((p) => p.id).sort()).toEqual(["local-only", "prod-1"]);
  });

  it("fetchProductsForCategoryId scopes the local catalog by category id too", async () => {
    fetchProductsFromApi.mockResolvedValue([mockProductTwo]);

    const { fetchProductsForCategoryId } = await import("@/lib/services/products");
    const result = await fetchProductsForCategoryId("cat-1");

    expect(fetchProductsFromApi).toHaveBeenCalledWith("cat-1");
    // local-only product has categoryId "cat-2", so it's filtered out here.
    expect(result.map((p) => p.id).sort()).toEqual(["prod-1", "prod-2"]);
  });

  it("fetchRelatedProducts uses category-scoped pool and excludes self", async () => {
    fetchProductsFromApi.mockResolvedValue([mockProductTwo, mockProductOtherCategory]);

    const { fetchRelatedProducts } = await import("@/lib/services/products");
    const related = await fetchRelatedProducts(mockProduct, 2);

    expect(fetchProductsFromApi).toHaveBeenCalledWith("cat-1");
    expect(related.every((p) => p.id !== mockProduct.id)).toBe(true);
    expect(related.map((p) => p.id)).toContain("prod-2");
  });

  it("fetchRelatedProducts respects limit", async () => {
    fetchProductsFromApi.mockResolvedValue([
      mockProductTwo,
      { ...mockProductTwo, id: "prod-4" },
    ]);

    const { fetchRelatedProducts } = await import("@/lib/services/products");
    const related = await fetchRelatedProducts(mockProduct, 1);

    expect(related).toHaveLength(1);
  });
});
