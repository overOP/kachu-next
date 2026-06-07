import { createApi } from "@reduxjs/toolkit/query/react";
import type { Product } from "@/lib/types/api";
import { apiBaseQueryUrl } from "../config";
import { createAuthBaseQuery } from "../auth/authBaseQuery";

export type { Product };

export const adminProductApi = createApi({
  reducerPath: "adminProductApi",
  baseQuery: createAuthBaseQuery({ baseUrl: apiBaseQueryUrl }),
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    getProduct: builder.query<Product[], void>({
      query: () => "/api/products",
      providesTags: [{ type: "Product", id: "LIST" }],
      transformResponse: (response: { products: Product[] }) => response.products ?? [],
    }),

    addProducts: builder.mutation<Product, FormData>({
      query: (newProductFormData) => ({
        url: "/api/products",
        method: "POST",
        body: newProductFormData,
      }),
      transformResponse: (response: { product: Product }) => response.product,
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    updateProduct: builder.mutation<Product, { productId: number | string; formData: FormData }>({
      query: ({ productId, formData }) => ({
        url: `/api/products/${productId}`,
        method: "PUT",
        body: formData,
      }),
      transformResponse: (response: { product: Product }) => response.product,
      invalidatesTags: (_result, _error, { productId }) => [
        { type: "Product", id: productId },
        { type: "Product", id: "LIST" },
      ],
    }),

    deleteProduct: builder.mutation<void, number | string>({
      query: (productId) => ({
        url: `/api/products/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
  }),
});

export const {
  useGetProductQuery,
  useAddProductsMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = adminProductApi;
