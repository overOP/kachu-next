import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Product {
  id: number;
  name: string;
  price: number;
}

export const productApi = createApi({
  reducerPath: 'productApi', 
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/" }),
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => "/products"
    })
  })
});

export const { useGetProductsQuery } = productApi;