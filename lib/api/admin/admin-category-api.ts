import { createApi } from "@reduxjs/toolkit/query/react";
import type { Category } from "@/lib/types/api";
import { apiBaseQueryUrl } from "../config";
import { createAuthBaseQuery } from "../auth/authBaseQuery";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: createAuthBaseQuery({ baseUrl: apiBaseQueryUrl }),
  tagTypes: ["Category"],
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => "/api/categories",
      transformResponse: (response: { categories: Category[] }) => response.categories ?? [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Category" as const, id })),
              { type: "Category", id: "LIST" },
            ]
          : [{ type: "Category", id: "LIST" }],
    }),

    getCategoryById: builder.query<Category, string | number>({
      query: (id) => `/api/categories/${id}`,
      transformResponse: (response: { category: Category }) => response.category,
      providesTags: (_result, _error, id) => [{ type: "Category", id }],
    }),

    addCategory: builder.mutation<Category, Partial<Category>>({
      query: (newCategory) => ({
        url: "/api/categories",
        method: "POST",
        body: newCategory,
      }),
      transformResponse: (response: { category: Category }) => response.category,
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),

    updateCategory: builder.mutation<
      Category,
      { categoryId: string | number; updatedCategory: Partial<Category> }
    >({
      query: ({ categoryId, updatedCategory }) => ({
        url: `/api/categories/${categoryId}`,
        method: "PUT",
        body: updatedCategory,
      }),
      transformResponse: (response: { category: Category }) => response.category,
      invalidatesTags: (_result, _error, { categoryId }) => [
        { type: "Category", id: categoryId },
        { type: "Category", id: "LIST" },
      ],
    }),

    deleteCategory: builder.mutation<{ success: boolean }, string | number>({
      query: (categoryId) => ({
        url: `/api/categories/${categoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Category", id },
        { type: "Category", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
