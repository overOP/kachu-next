import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "./stateAuth";
import { verify } from "crypto";


export const userAuthApi = createApi({
  reducerPath: 'userAuthApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api/users' }),
  endpoints: (builder) => ({
    login: builder.mutation<{ token: string, user: User }, {password:string,email:string}>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: '/register',
        method: 'POST',
        body: formData, 
      }),
    }),
    forgotPassword: builder.mutation<void, { email: string }>({
      query: (body) => ({
        url: '/forgot-password',
        method: 'POST',
        body,
      }),
    }),
    verifyCode: builder.mutation<{ resetToken: string }, { email: string; code: string }>({
      query: (body) => ({
        url: '/verify-otp',
        method: 'POST',
        body,
      }),
        }),
        
        verifyToken: builder.mutation<void, { resetToken: string }>({
            query: (body) => ({
            url: '/verify-token',
            method: 'POST',
            body,
            }),
        }),

      resetPassword: builder.mutation<void, { resetToken: string; password: string }>({
        query: (body) => ({
          url: '/reset-password',
          method: 'POST',
          body,
        }),
    
    }),
  }),
});

export const { 
  useLoginMutation, 
  useRegisterMutation, 
  useForgotPasswordMutation, 
  useVerifyCodeMutation ,
  useResetPasswordMutation
} = userAuthApi;