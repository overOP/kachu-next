import { createApi } from "@reduxjs/toolkit/query/react";
import type { User } from "@/lib/types/api";
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
      query: () => "",
      transformResponse: (res: { users: User[] } | User[]) =>
        Array.isArray(res) ? res : (res.users ?? []),
      providesTags: ["User"],
    }),
    getUserById: builder.query<User, number | string>({
      query: (id) => `/${id}`,
      transformResponse: (res: { user: User } | User) =>
        "user" in res && res.user ? res.user : (res as User),
      providesTags: (_result, _error, id) => [{ type: "User" as const, id }],
    }),
    updateUser: builder.mutation<User, { id: number | string; body: FormData | Record<string, unknown> }>({
      query: ({ id, body }) => ({
        url: `/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (res: { user: User } | User) =>
        "user" in res && res.user ? res.user : (res as User),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation<void, number | string>({
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
