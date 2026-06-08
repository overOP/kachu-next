import { createApi } from "@reduxjs/toolkit/query/react";
import type { CreateProductPayload, Product, UpdateProductPayload } from "@/lib/types/api";
import { extractItem, extractList } from "../parse-response";
import { apiBaseQueryUrl } from "../config";
import { createAuthBaseQuery } from "../auth/authBaseQuery";

export type { Product };

export const adminProductApi = createApi({
  reducerPath: "adminProductApi",
  baseQuery: createAuthBaseQuery({ baseUrl: apiBaseQueryUrl }),
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    getProduct: builder.query<Product[], { categoryId?: string } | void>({
      query: (arg) => {
        const categoryId = arg && "categoryId" in arg ? arg.categoryId : undefined;
        return categoryId
          ? `/api/products?categoryId=${encodeURIComponent(categoryId)}`
          : "/api/products";
      },
      providesTags: [{ type: "Product", id: "LIST" }],
      transformResponse: (response: unknown) => extractList<Product>(response, ["products"]),
    }),

    addProducts: builder.mutation<Product, CreateProductPayload>({
      query: (body) => ({
        url: "/api/products",
        method: "POST",
        body,
      }),
      transformResponse: (response: unknown) => {
        const product = extractItem<Product>(response, ["product"]);
        if (!product) throw new Error("Invalid product response");
        return product;
      },
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    updateProduct: builder.mutation<
      Product,
      { productId: string; body: UpdateProductPayload }
    >({
      query: ({ productId, body }) => ({
        url: `/api/products/${productId}`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: unknown) => {
        const product = extractItem<Product>(response, ["product"]);
        if (!product) throw new Error("Invalid product response");
        return product;
      },
      invalidatesTags: (_result, _error, { productId }) => [
        { type: "Product", id: productId },
        { type: "Product", id: "LIST" },
      ],
    }),

    deleteProduct: builder.mutation<void, string>({
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
