import { describe, expect, it } from "vitest";
import {
  averageRatingFromProduct,
  averageRatingFromReviews,
  filterProductsByCategoryId,
  filterProductsByQuery,
  productImage,
  productImages,
  productMoqLabel,
  productPriceLabel,
  productStockLabel,
  reviewAuthor,
} from "@/lib/utils/product-display";
import {
  mockCategory,
  mockProduct,
  mockProductOtherCategory,
  mockProductTwo,
  mockReview,
} from "../../../helpers/fixtures";

describe("productImage", () => {
  it("returns first product image", () => {
    expect(productImage(mockProduct)).toBe("https://example.com/earbuds.jpg");
  });

  it("falls back to category image", () => {
    expect(productImage(mockProductTwo)).toBe(mockCategory.image);
  });

  it("falls back to placeholder when no images exist", () => {
    const bare = { ...mockProductTwo, category: undefined };
    expect(productImage(bare)).toMatch(/unsplash/);
  });
});

describe("productImages", () => {
  it("returns all product images when present", () => {
    expect(productImages(mockProduct)).toEqual(["https://example.com/earbuds.jpg"]);
  });

  it("returns category image array when product images empty", () => {
    expect(productImages(mockProductTwo)).toEqual([mockCategory.image!]);
  });
});

describe("productPriceLabel", () => {
  it("formats numeric prices as NPR", () => {
    expect(productPriceLabel(mockProduct)).toBe("NPR 2,500");
  });

  it("parses string prices with currency symbols", () => {
    expect(productPriceLabel(mockProductTwo)).toBe("NPR 150");
  });

  it("returns raw string when unparsable", () => {
    expect(productPriceLabel({ ...mockProduct, price: "Contact for price" })).toBe(
      "Contact for price"
    );
  });
});

describe("productMoqLabel", () => {
  it("uses singular unit for MOQ 1", () => {
    expect(productMoqLabel({ ...mockProduct, minimumOrder: 1 })).toBe("MOQ: 1 unit");
  });

  it("uses plural units for MOQ > 1", () => {
    expect(productMoqLabel(mockProduct)).toBe("MOQ: 10 units");
  });
});

describe("productStockLabel", () => {
  it("returns null when stock is undefined", () => {
    expect(productStockLabel({ ...mockProduct, stock: undefined })).toBeNull();
  });

  it("returns stock label when set", () => {
    expect(productStockLabel(mockProduct)).toBe("100 in stock");
  });
});

describe("averageRatingFromReviews", () => {
  it("returns 0 for empty list", () => {
    expect(averageRatingFromReviews([])).toBe(0);
  });

  it("computes rounded average to one decimal", () => {
    expect(averageRatingFromReviews(mockProduct.reviews!)).toBe(4.5);
  });
});

describe("averageRatingFromProduct", () => {
  it("delegates to embedded reviews", () => {
    expect(averageRatingFromProduct(mockProduct)).toBe(4.5);
  });

  it("returns 0 when product has no reviews", () => {
    expect(averageRatingFromProduct({ ...mockProduct, reviews: undefined })).toBe(0);
  });
});

describe("reviewAuthor", () => {
  it("returns reviewer name", () => {
    expect(reviewAuthor(mockReview)).toBe("Alice");
  });

  it("falls back to Customer", () => {
    expect(reviewAuthor({ ...mockReview, reviewer: undefined })).toBe("Customer");
  });
});

describe("filterProductsByCategoryId", () => {
  const pool = [mockProduct, mockProductTwo, mockProductOtherCategory];

  it("returns all products for null category", () => {
    expect(filterProductsByCategoryId(pool, null)).toHaveLength(3);
  });

  it("returns all products for 'all' category", () => {
    expect(filterProductsByCategoryId(pool, "all")).toHaveLength(3);
  });

  it("filters by category id", () => {
    const filtered = filterProductsByCategoryId(pool, "cat-1");
    expect(filtered).toHaveLength(2);
    expect(filtered.every((p) => p.categoryId === "cat-1")).toBe(true);
  });
});

describe("filterProductsByQuery", () => {
  const pool = [mockProduct, mockProductTwo, mockProductOtherCategory];

  it("returns full pool for empty query", () => {
    expect(filterProductsByQuery(pool, "")).toHaveLength(3);
    expect(filterProductsByQuery(pool, "   ")).toHaveLength(3);
  });

  it("matches product name case-insensitively", () => {
    expect(filterProductsByQuery(pool, "earbuds")).toEqual([mockProduct]);
  });

  it("matches description text", () => {
    expect(filterProductsByQuery(pool, "spiral")).toEqual([mockProductOtherCategory]);
  });

  it("matches category name", () => {
    expect(filterProductsByQuery(pool, "electronics")).toHaveLength(2);
  });
});
