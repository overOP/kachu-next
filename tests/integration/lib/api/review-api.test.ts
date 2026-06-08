import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFetchMock } from "../../../helpers/mock-fetch";
import { createTestStore } from "../../../helpers/store";
import { mockReview, mockUser } from "../../../helpers/fixtures";

vi.mock("@/lib/auth/refresh-session", () => ({
  refreshSession: vi.fn().mockResolvedValue({ ok: false, reason: "unauthorized" }),
}));

describe("reviewApi integration", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("getReviews fetches and normalizes reviews for a product", async () => {
    createFetchMock(({ url, method }) => {
      if (url.includes("/api/reviews") && method === "GET") {
        return {
          ok: true,
          body: {
            reviews: [
              {
                id: mockReview.id,
                productId: "prod-1",
                rating: 5,
                reviewer: { name: "Alice" },
                comment: "Nice",
              },
            ],
          },
        };
      }
      return { ok: false, status: 404, body: {} };
    });

    const { reviewApi } = await import("@/lib/api/review-api");
    const store = createTestStore({
      token: "jwt",
      user: mockUser,
      isAuthenticated: true,
    });

    const result = await store.dispatch(
      reviewApi.endpoints.getReviews.initiate({ productId: "prod-1" })
    );

    expect(result.data).toHaveLength(1);
    expect(result.data?.[0].reviewer?.name).toBe("Alice");
  });

  it("createReview invalidates list cache", async () => {
    createFetchMock(({ url, method }) => {
      if (method === "POST" && url.includes("/api/reviews") && !url.includes("?")) {
        return {
          ok: true,
          body: {
            review: {
              id: "rev-new",
              productId: "prod-1",
              rating: 4,
              comment: "Good",
              reviewer: { name: mockUser.name },
            },
          },
        };
      }
      if (method === "GET" && url.includes("/api/reviews")) {
        return { ok: true, body: { reviews: [] } };
      }
      return { ok: false, status: 404, body: {} };
    });

    const { reviewApi } = await import("@/lib/api/review-api");
    const store = createTestStore({
      token: "jwt",
      user: mockUser,
      isAuthenticated: true,
    });

    await store.dispatch(reviewApi.endpoints.getReviews.initiate({ productId: "prod-1" }));

    const createResult = await store.dispatch(
      reviewApi.endpoints.createReview.initiate({
        productId: "prod-1",
        rating: 4,
        comment: "Good",
      })
    );

    expect(createResult.data?.id).toBe("rev-new");
  });

  it("updateReview mutates a review by id", async () => {
    createFetchMock(({ url, method }) => {
      if (url.includes("/api/reviews/rev-1") && method === "PUT") {
        return {
          ok: true,
          body: {
            review: {
              id: "rev-1",
              productId: "prod-1",
              rating: 3,
              comment: "Updated",
            },
          },
        };
      }
      return { ok: false, status: 404, body: {} };
    });

    const { reviewApi } = await import("@/lib/api/review-api");
    const store = createTestStore({
      token: "jwt",
      user: mockUser,
      isAuthenticated: true,
    });

    const result = await store.dispatch(
      reviewApi.endpoints.updateReview.initiate({
        id: "rev-1",
        rating: 3,
        comment: "Updated",
      })
    );

    expect(result.data?.rating).toBe(3);
    expect(result.data?.comment).toBe("Updated");
  });

  it("deleteReview calls DELETE endpoint", async () => {
    const fetchMock = createFetchMock(({ url, method }) => {
      if (url.includes("/api/reviews/rev-1") && method === "DELETE") {
        return { ok: true, body: { message: "Deleted" } };
      }
      return { ok: false, status: 404, body: {} };
    });

    const { reviewApi } = await import("@/lib/api/review-api");
    const store = createTestStore({
      token: "jwt",
      user: mockUser,
      isAuthenticated: true,
    });

    const result = await store.dispatch(reviewApi.endpoints.deleteReview.initiate("rev-1"));

    expect(result.data).toEqual({ message: "Deleted" });
    expect(fetchMock).toHaveBeenCalled();
  });
});
