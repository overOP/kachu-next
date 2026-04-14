import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { User } from "../../store/auth-slice";
import { userAuthApiBaseUrl } from "../config";

export const adminAuthApi = createApi({
  reducerPath: 'adminAuthApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: userAuthApiBaseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as { auth: { token: string | null } }).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getAllUsers: builder.query<User[], void>({
      query: () => '/all-users',
      transformResponse: (res: { users: User[] }) => res.users,
      providesTags: ['User'],
    }),
    // User by ID
    getUserById: builder.query<User, number>({
      query: (id) => `/${id}`,
      transformResponse: (res: { user: User }) => res.user,
      providesTags: ['User'],
    }),
    // User update (can include profile image)
    updateUser: builder.mutation<User, { id: number; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const { 
  useGetAllUsersQuery, 
  useUpdateUserMutation, 
  useDeleteUserMutation,
  useGetUserByIdQuery,
} = adminAuthApi;