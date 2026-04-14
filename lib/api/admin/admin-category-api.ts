import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { type Factory } from "./admin-factory-api";
import { apiBaseQueryUrl } from "../config";

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiBaseQueryUrl }),
  tagTypes: ['Category'],
  endpoints: (builder) => ({

    getCategories: builder.query<Factory[], void>({
      query: () => "/categories",
      transformResponse: (response: { categories: Factory[] }) => response.categories,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Category' as const, id })),
              { type: 'Category', id: 'LIST' },
            ]
          : [{ type: 'Category', id: 'LIST' }],
    }),

    getCategoryById: builder.query<Factory, string | number>({
      query: (id) => `/categories/${id}`,
      transformResponse: (response: { category: Factory }) => response.category,
      providesTags: (result, error, id) => [{ type: 'Category', id }],
    }),

    addCategory: builder.mutation<Factory, Partial<Factory>>({
      query: (newCategory) => ({
        url: '/categories',
        method: 'POST',
        body: newCategory,
      }),
      invalidatesTags: [{ type: 'Category', id: 'LIST' }],
    }),

    updateCategory: builder.mutation<Factory, { categoryId: string | number; updatedCategory: Partial<Factory> }>({
      query: ({ categoryId, updatedCategory }) => ({
        url: `/categories/${categoryId}`,
        method: 'PUT',
        body: updatedCategory,
      }),
      invalidatesTags: (result, error, { categoryId }) => [
        { type: 'Category', id: categoryId },
        { type: 'Category', id: 'LIST' },
      ],
    }),

    deleteCategory: builder.mutation<{ success: boolean }, string | number>({
      query: (categoryId) => ({
        url: `/categories/${categoryId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Category', id },
        { type: 'Category', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation
} = categoryApi;