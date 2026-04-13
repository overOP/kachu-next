import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: { url: string; public_id: string }[];
}

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/api/products" }),
 
  tagTypes: ["Product"], 
  
  endpoints: (builder) => ({
    // 1. Get all products
    getProducts: builder.query<Product[], void>({
      query: () => "/",
      providesTags: ["Product"],
    }),

    // 2. Get a single product by ID
    getProductDetails: builder.query<Product, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    // 3. Create a new product (Admin)
    createProduct: builder.mutation<Product, FormData>({
      query: (newProduct) => ({
        url: "/admin/",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Product"], // Clears cache to trigger a refetch of the list
    }),

    // 4. Update product
    updateProduct: builder.mutation<Product, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/admin/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => ["Product", { type: "Product", id }],
    }),

    // 5. Delete product
    deleteProduct: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;