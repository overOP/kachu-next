import { createApi } from "@reduxjs/toolkit/query/react";
import type { User } from "../../store/auth-slice";
import { usersApiBaseUrl } from "../config";
import { createAuthBaseQuery } from "./authBaseQuery";

const baseQuery = createAuthBaseQuery({
  baseUrl: usersApiBaseUrl,
});

export const adminAuthApi = createApi({
  reducerPath: "adminAuthApi",
  baseQuery,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getAllUsers: builder.query<User[], void>({
      query: () => "/all-users",
      transformResponse: (res: { users: User[] }) => res.users,
      providesTags: ["User"],
    }),
    getUserById: builder.query<User, number>({
      query: (id) => `/${id}`,
      transformResponse: (res: { user: User }) => res.user,
      providesTags: (_result, _error, id) => [{ type: "User" as const, id }],
    }),
    updateUser: builder.mutation<User, { id: number; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetUserByIdQuery,
} = adminAuthApi;
