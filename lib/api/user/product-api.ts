import { createApi } from "@reduxjs/toolkit/query/react";
import type { Product } from "@/lib/types/api";
import { apiBaseQueryUrl } from "../config";
import { createAuthBaseQuery } from "../auth/authBaseQuery";

export type { Product };

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: createAuthBaseQuery({ baseUrl: apiBaseQueryUrl }),
  tagTypes: ["Product", "Products"],
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => "/api/products",
      transformResponse: (response: { products: Product[] }) => response.products ?? [],
      providesTags: [{ type: "Products", id: "LIST" }],
    }),

    searchProducts: builder.query<Product[], string>({
      query: (searchTerm) => `/api/products/search?q=${encodeURIComponent(searchTerm)}`,
      transformResponse: (response: { products: Product[] }) => response.products ?? [],
    }),

    getProductById: builder.query<Product, number | string>({
      query: (productId) => `/api/products/${productId}`,
      transformResponse: (response: { product: Product }) => response.product,
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
    }),

    getProductsByCategory: builder.query<Product[], string | number>({
      query: (categoryId) => `/api/products/category/${categoryId}`,
      transformResponse: (response: { products: Product[] }) => response.products ?? [],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useSearchProductsQuery,
  useGetProductsByCategoryQuery,
} = productApi;
