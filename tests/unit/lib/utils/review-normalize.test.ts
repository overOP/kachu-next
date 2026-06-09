import { describe, expect, it } from "vitest";
import { normalizeReview, normalizeReviews } from "@/lib/utils/review-normalize";

describe("normalizeReview", () => {
  it("normalizes a complete API review payload", () => {
    const result = normalizeReview({
      id: "rev-1",
      productId: "prod-1",
      userId: "user-1",
      rating: 5,
      comment: "Great",
      reviewer: { name: "Alice", profileImage: "https://example.com/a.jpg" },
      createdAt: "2025-06-01T00:00:00Z",
    });

    expect(result).toEqual({
      id: "rev-1",
      productId: "prod-1",
      userId: "user-1",
      rating: 5,
      comment: "Great",
      reviewer: { name: "Alice", profileImage: "https://example.com/a.jpg" },
      user: { name: "Alice", profileImage: "https://example.com/a.jpg" },
      product: undefined,
      createdAt: "2025-06-01T00:00:00Z",
    });
  });

  it("accepts legacy user field instead of reviewer", () => {
    const result = normalizeReview({
      id: 42,
      productId: 99,
      rating: 3,
      user: { name: "Bob", img: "https://example.com/b.jpg" },
    });

    expect(result?.id).toBe("42");
    expect(result?.productId).toBe("99");
    expect(result?.reviewer).toEqual({
      name: "Bob",
      profileImage: "https://example.com/b.jpg",
    });
  });

  it("returns null when required fields are missing", () => {
    expect(normalizeReview(null)).toBeNull();
    expect(normalizeReview({ id: "1" })).toBeNull();
    expect(normalizeReview({ id: "1", productId: "p", rating: "five" })).toBeNull();
  });

  it("sets comment to null when absent", () => {
    const result = normalizeReview({ id: "1", productId: "p", rating: 4 });
    expect(result?.comment).toBeNull();
  });
});

describe("normalizeReviews", () => {
  it("filters out invalid entries", () => {
    const result = normalizeReviews([
      { id: "1", productId: "p", rating: 5 },
      { bad: true },
      { id: "2", productId: "p", rating: 3 },
    ]);
    expect(result).toHaveLength(2);
  });

  it("returns empty array for non-array input", () => {
    expect(normalizeReviews(null)).toEqual([]);
    expect(normalizeReviews({ reviews: [] })).toEqual([]);
  });
});
