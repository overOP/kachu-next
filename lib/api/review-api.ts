import { createApi } from "@reduxjs/toolkit/query/react";
import type { Review } from "@/lib/types/api";
import { apiBaseQueryUrl } from "./config";
import { createAuthBaseQuery } from "./auth/authBaseQuery";

export type CreateReviewPayload = {
  productId: number;
  rating: number;
  comment: string;
};

export type UpdateReviewPayload = {
  id: number | string;
  rating?: number;
  comment?: string;
};

export const reviewApi = createApi({
  reducerPath: "reviewApi",
  baseQuery: createAuthBaseQuery({ baseUrl: apiBaseQueryUrl }),
  tagTypes: ["Review"],
  endpoints: (builder) => ({
    getReviews: builder.query<Review[], { productId?: number } | void>({
      query: (arg) => {
        const productId = arg && "productId" in arg ? arg.productId : undefined;
        return productId != null ? `/api/reviews?productId=${productId}` : "/api/reviews";
      },
      transformResponse: (response: { reviews: Review[] }) => response.reviews ?? [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Review" as const, id })),
              { type: "Review", id: "LIST" },
            ]
          : [{ type: "Review", id: "LIST" }],
    }),

    getReviewById: builder.query<Review, number | string>({
      query: (id) => `/api/reviews/${id}`,
      transformResponse: (response: { review: Review }) => response.review,
      providesTags: (_result, _error, id) => [{ type: "Review", id }],
    }),

    createReview: builder.mutation<Review, CreateReviewPayload>({
      query: (body) => ({
        url: "/api/reviews",
        method: "POST",
        body,
      }),
      transformResponse: (response: { review: Review }) => response.review,
      invalidatesTags: [{ type: "Review", id: "LIST" }],
    }),

    updateReview: builder.mutation<Review, UpdateReviewPayload>({
      query: ({ id, ...body }) => ({
        url: `/api/reviews/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: { review: Review }) => response.review,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Review", id },
        { type: "Review", id: "LIST" },
      ],
    }),

    deleteReview: builder.mutation<void, number | string>({
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
