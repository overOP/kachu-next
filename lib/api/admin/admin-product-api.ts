import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiBaseQueryUrl } from "../config";

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
    baseQuery: fetchBaseQuery({ baseUrl: apiBaseQueryUrl }),
    tagTypes:['Product'],
    endpoints: (builder) => ({
getProduct:builder.query<Product[], void>({
  query: () => "/products",
  providesTags:['Product'],
  transformResponse: (response: { products: Product[] }) => response.products,
  
}),

addProducts:builder.mutation<void,FormData>({
    query:(newProductFormData)=>({
        url:'/products',
        method:'POST',
        body:newProductFormData,
    }),
invalidatesTags:[
    { type: 'Product', id: 'LIST' },
]
}),
updateProduct: builder.mutation<void, { productId: number; formData: FormData }>({
      query: ({ productId, formData }) => ({
        url: `/products/${productId}`,
        method: 'PUT',
        body: formData,
      }),
invalidatesTags: (result, error, { productId }) => [
      { type: 'Product', id: productId },
      { type: 'Product', id: 'LIST' },
    ],
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