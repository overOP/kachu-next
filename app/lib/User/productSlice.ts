// for fetching the products
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Product {
  id: number;
  name: string;
  brand: string;
  price: string;
  img: string;
  rate: string;
  quantity: string;
  logo: string;
  Description: string;
}

export const productApi = createApi({
  reducerPath: 'productApi', 
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/" }),
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => "/products",
      transformResponse: (response: { products: Product[] }) => response.products,

    }),
    
   searchProducts: builder.query({
      query: (searchTerm) => `/products/search?q=${searchTerm}`,
transformResponse: (response: { products: Product[] }) => response.products,
    }),
    
  })
});

export const { useGetProductsQuery, useSearchProductsQuery } = productApi;

