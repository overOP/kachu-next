import { createApi } from "@reduxjs/toolkit/query/react";
import type { CreateReviewPayload, Review } from "@/lib/types/api";
import { extractItem, extractList } from "./parse-response";
import { apiBaseQueryUrl } from "./config";
import { createAuthBaseQuery } from "./auth/authBaseQuery";
import { normalizeReview, normalizeReviews } from "@/lib/utils/review-normalize";

export type UpdateReviewPayload = {
  id: string;
  rating?: number;
  comment?: string;
};

export const reviewApi = createApi({
  reducerPath: "reviewApi",
  baseQuery: createAuthBaseQuery({ baseUrl: apiBaseQueryUrl }),
  tagTypes: ["Review"],
  endpoints: (builder) => ({
    getReviews: builder.query<Review[], { productId?: string } | void>({
      query: (arg) => {
        const productId = arg && "productId" in arg ? arg.productId : undefined;
        return productId != null
          ? `/api/reviews?productId=${encodeURIComponent(productId)}`
          : "/api/reviews";
      },
      // Stable cache key per product — avoids duplicate entries for the same query shape.
      serializeQueryArgs: ({ queryArgs }) => {
        const productId =
          queryArgs && typeof queryArgs === "object" && "productId" in queryArgs
            ? queryArgs.productId
            : undefined;
        return productId ?? "all";
      },
      transformResponse: (response: unknown) => {
        const raw = extractList<unknown>(response, ["reviews"]);
        return normalizeReviews(raw);
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Review" as const, id })),
              { type: "Review", id: "LIST" },
            ]
          : [{ type: "Review", id: "LIST" }],
    }),

    getReviewById: builder.query<Review, string>({
      query: (id) => `/api/reviews/${id}`,
      transformResponse: (response: unknown) => {
        const raw = extractItem<unknown>(response, ["review"]);
        const review = normalizeReview(raw);
        if (!review) throw new Error("Review not found");
        return review;
      },
      providesTags: (_result, _error, id) => [{ type: "Review", id }],
    }),

    createReview: builder.mutation<Review, CreateReviewPayload>({
      query: (body) => ({
        url: "/api/reviews",
        method: "POST",
        body,
      }),
      transformResponse: (response: unknown) => {
        const raw = extractItem<unknown>(response, ["review"]);
        const review = normalizeReview(raw);
        if (!review) throw new Error("Invalid review response");
        return review;
      },
      invalidatesTags: [{ type: "Review", id: "LIST" }],
    }),

    updateReview: builder.mutation<Review, UpdateReviewPayload>({
      query: ({ id, ...body }) => ({
        url: `/api/reviews/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: unknown) => {
        const raw = extractItem<unknown>(response, ["review"]);
        const review = normalizeReview(raw);
        if (!review) throw new Error("Invalid review response");
        return review;
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Review", id },
        { type: "Review", id: "LIST" },
      ],
    }),

    deleteReview: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/reviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Review", id },
        { type: "Review", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetReviewsQuery,
  useGetReviewByIdQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewApi;
