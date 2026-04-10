// for fetching the factory

import { createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

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

export const factoryApi = createApi({
  reducerPath: 'factoryApi', 
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/" }),
  endpoints: (builder) => ({

    getFactory:builder.query<Factory[], void>({
      query: () => "/factory",
      transformResponse: (response: { factory: Factory[] }) => response.factory,
    }),
    
    searchFactory: builder.query({
      query: (searchTerm) => `/factory/search?q=${searchTerm}`,
      transformResponse: (response: { factory: Factory[] }) => response.factory,
    }),
  })
});

export const { useGetFactoryQuery, useSearchFactoryQuery} = factoryApi;

