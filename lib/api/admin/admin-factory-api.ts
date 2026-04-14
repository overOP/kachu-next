import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiBaseQueryUrl } from "../config";

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
    baseQuery: fetchBaseQuery({ baseUrl: apiBaseQueryUrl }),
    tagTypes:['Factory'],

    endpoints: (builder) => ({
getFactory:builder.query<Factory[], void>({
  query: () => "/factorys",
  providesTags:['Factory'],
  transformResponse: (response: { Factorys: Factory[] }) => response.Factorys,
  
}),

addFactorys:builder.mutation<void,FormData>({
    query:(newFactoryFormData)=>({
        url:'/factorys',
        method:'POST',
        body:newFactoryFormData,
    }),
invalidatesTags:[
    { type: 'Factory', id: 'LIST' },
]
}),
updateFactory: builder.mutation<void, { factoryId: number; formData: FormData }>({
      query: ({ factoryId, formData }) => ({
        url: `/factorys/${factoryId}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (result, error, { factoryId }) => [
        { type: 'Factory', id: factoryId },
        { type: 'Factory', id: 'LIST' },
      ],
    }),
    

deleteFactory:builder.mutation({
    query:(FactoryId)=>({
        url:`/factorys/${FactoryId}`,
        method:'DELETE',
    }),
invalidatesTags: (result, error, { FactoryId }) => [
      { type: 'Factory', id: FactoryId },
      { type: 'Factory', id: 'LIST' },
    ],
})

}),
})

export const {useGetFactoryQuery,useAddFactorysMutation,useDeleteFactoryMutation} = adminFactoryApi;