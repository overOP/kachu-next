import { createApi } from "@reduxjs/toolkit/query/react";
import type { Category, CreateCategoryPayload, UpdateCategoryPayload } from "@/lib/types/api";
import { extractItem, extractList } from "../parse-response";
import { apiBaseQueryUrl } from "../config";
import { createAuthBaseQuery } from "../auth/authBaseQuery";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: createAuthBaseQuery({ baseUrl: apiBaseQueryUrl }),
  tagTypes: ["Category"],
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => "/api/categories",
      transformResponse: (response: unknown) => extractList<Category>(response, ["categories"]),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Category" as const, id })),
              { type: "Category", id: "LIST" },
            ]
          : [{ type: "Category", id: "LIST" }],
    }),

    getCategoryById: builder.query<Category, string>({
      query: (id) => `/api/categories/${id}`,
      transformResponse: (response: unknown) => {
        const category = extractItem<Category>(response, ["category"]);
        if (!category) throw new Error("Category not found");
        return category;
      },
      providesTags: (_result, _error, id) => [{ type: "Category", id }],
    }),

    addCategory: builder.mutation<Category, CreateCategoryPayload>({
      query: (body) => ({
        url: "/api/categories",
        method: "POST",
        body,
      }),
      transformResponse: (response: unknown) => {
        const category = extractItem<Category>(response, ["category"]);
        if (!category) throw new Error("Invalid category response");
        return category;
      },
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),

    updateCategory: builder.mutation<
      Category,
      { categoryId: string; updatedCategory: UpdateCategoryPayload }
    >({
      query: ({ categoryId, updatedCategory }) => ({
        url: `/api/categories/${categoryId}`,
        method: "PUT",
        body: updatedCategory,
      }),
      transformResponse: (response: unknown) => {
        const category = extractItem<Category>(response, ["category"]);
        if (!category) throw new Error("Invalid category response");
        return category;
      },
      invalidatesTags: (_result, _error, { categoryId }) => [
        { type: "Category", id: categoryId },
        { type: "Category", id: "LIST" },
      ],
    }),

    deleteCategory: builder.mutation<void, string>({
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
