import { createApi } from "@reduxjs/toolkit/query/react";
import type { User } from "@/lib/types/api";
import { extractItem, extractList } from "../parse-response";
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
      transformResponse: (res: unknown) => extractList<User>(res, ["users"]),
      providesTags: ["User"],
    }),
    getUserById: builder.query<User, string>({
      query: (id) => `/${id}`,
      transformResponse: (res: unknown) => {
        const user = extractItem<User>(res, ["user"]);
        if (!user) throw new Error("User not found");
        return user;
      },
      providesTags: (_result, _error, id) => [{ type: "User" as const, id }],
    }),
    updateUser: builder.mutation<User, { id: string; body: Record<string, unknown> }>({
      query: ({ id, body }) => ({
        url: `/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (res: unknown) => {
        const user = extractItem<User>(res, ["user"]);
        if (!user) throw new Error("Invalid user response");
        return user;
      },
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation<void, string>({
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
