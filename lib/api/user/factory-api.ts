// for fetching the factory

import { createApi } from "@reduxjs/toolkit/query/react";
import { apiBaseQueryUrl } from "../config";
import { createAuthBaseQuery } from "../auth/authBaseQuery";

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
  reducerPath: "factoryApi",
  baseQuery: createAuthBaseQuery({ baseUrl: apiBaseQueryUrl }),
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

