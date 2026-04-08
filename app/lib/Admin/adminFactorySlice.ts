import {createApi,fetchBaseQuery}from "@reduxjs/toolkit/query/react";

export interface Factory {
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

export const adminFactoryApi = createApi({
    reducerPath: 'adminFactoryApi', 
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/" }),
    tagTypes:['Factory'],
    endpoints: (builder) => ({
getFactory:builder.query<Factory[], void>({
  query: () => "/factorys",
  providesTags:['Factory'],
  transformResponse: (response: { Factorys: Factory[] }) => response.Factorys,
  
}),
addFactorys:builder.mutation({
    query:(newFactory)=>({
        url:'/factorys',
        method:'POST',
        body:newFactory,
    }),
    invalidatesTags:['Factory'],

}),

deleteFactory:builder.mutation({
    query:(FactoryId)=>({
        url:`/factorys/${FactoryId}`,
        method:'DELETE',
    }),
    invalidatesTags:['Factory'],
})

}),
})

export const {useGetFactoryQuery,useAddFactorysMutation,useDeleteFactoryMutation} = adminFactoryApi;