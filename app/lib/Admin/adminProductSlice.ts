import {createApi,fetchBaseQuery}from "@reduxjs/toolkit/query/react";

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

export const adminProductApi = createApi({
    reducerPath: 'adminProductApi', 
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/" }),
    tagTypes:['Product'],
    endpoints: (builder) => ({
getProduct:builder.query<Product[], void>({
  query: () => "/products",
  providesTags:['Product'],
  transformResponse: (response: { products: Product[] }) => response.products,
  
}),
addProducts:builder.mutation({
    query:(newProduct)=>({
        url:'/products',
        method:'POST',
        body:newProduct,
    }),
    invalidatesTags:['Product'],

}),

deleteProduct:builder.mutation({
    query:(productId)=>({
        url:`/products/${productId}`,
        method:'DELETE',
    }),
    invalidatesTags:['Product'],
})

}),
})

export const {useGetProductQuery,useAddProductsMutation,useDeleteProductMutation} = adminProductApi;