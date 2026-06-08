import { createApi } from "@reduxjs/toolkit/query/react";
import type { User } from "@/lib/types/api";
import { extractAccessToken, extractUser } from "../parse-response";
import { authApiBaseUrl } from "../config";
import { createAuthBaseQuery } from "./authBaseQuery";
import { AUTH_ENDPOINTS } from "./endpoints";
import { logout } from "@/lib/store/auth-slice";

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type RefreshResult = {
  token: string;
  user?: User;
};

const baseQuery = createAuthBaseQuery({
  baseUrl: authApiBaseUrl,
});

function pickResetToken(res: unknown): string | undefined {
  if (!res || typeof res !== "object") return undefined;
  const token = extractAccessToken(res);
  if (token) return token;
  const r = res as Record<string, unknown>;
  if (typeof r.resetToken === "string") return r.resetToken;
  const data = r.data;
  if (data && typeof data === "object" && typeof (data as Record<string, unknown>).resetToken === "string") {
    return (data as Record<string, unknown>).resetToken as string;
  }
  return undefined;
}

function parseAuthResult(res: unknown): { token: string; user: User } {
  const token = extractAccessToken(res) ?? "";
  const user = extractUser<User>(res);
  if (!token || !user) {
    throw new Error("Invalid auth response from server.");
  }
  return { token, user };
}

function parseRefreshResponse(res: unknown): RefreshResult {
  const token = extractAccessToken(res) ?? "";
  const user = extractUser<User>(res);
  return { token, ...(user !== undefined ? { user } : {}) };
}

export const userAuthApi = createApi({
  reducerPath: "userAuthApi",
  baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation<{ token: string; user: User }, { password: string; email: string }>({
      query: ({ email, password }) => {
        const e = String(email ?? "").trim();
        const p = String(password ?? "");
        if (!e || !p) {
          throw new Error("Email and password are required.");
        }
        return {
          url: AUTH_ENDPOINTS.login,
          method: "POST",
          body: { email: e, password: p },
        };
      },
      transformResponse: (res: unknown) => parseAuthResult(res),
    }),
    register: builder.mutation<void, RegisterPayload>({
      query: (body) => ({
        url: AUTH_ENDPOINTS.register,
        method: "POST",
        body,
      }),
    }),
    refresh: builder.mutation<RefreshResult, void>({
      query: () => ({
        url: AUTH_ENDPOINTS.refresh,
        method: "POST",
      }),
      transformResponse: (res: unknown) => parseRefreshResponse(res),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: AUTH_ENDPOINTS.logout,
        method: "POST",
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {
          // still clear local session if server is unreachable
        } finally {
          dispatch(logout());
        }
      },
    }),
    forgotPassword: builder.mutation<void, { email: string }>({
      query: (body) => ({
        url: AUTH_ENDPOINTS.forgotPassword,
        method: "POST",
        body,
      }),
    }),
    verifyCode: builder.mutation<{ resetToken: string }, { email: string; otp: string }>({
      query: ({ email, otp }) => {
        const trimmedEmail = email.trim();
        const otpString = String(otp).trim();
        if (!trimmedEmail) {
          throw new Error("Email is required");
        }
        if (!/^\d+$/.test(otpString)) {
          throw new Error("Invalid verification code");
        }
        return {
          url: AUTH_ENDPOINTS.verifyOtp,
          method: "POST",
          body: { email: trimmedEmail, otp: otpString },
        };
      },
      transformResponse: (res: unknown) => {
        const resetToken = pickResetToken(res) ?? "";
        return { resetToken };
      },
    }),
    resetPassword: builder.mutation<void, { resetToken: string; password: string }>({
      query: ({ resetToken, password }) => {
        const token = String(resetToken ?? "").trim();
        const pwd = String(password ?? "");
        if (!token) {
          throw new Error("Reset token is missing. Verify your code again.");
        }
        if (!pwd) {
          throw new Error("Password is required.");
        }
        return {
          url: AUTH_ENDPOINTS.resetPassword,
          method: "POST",
          body: {
            resetToken: token,
            newPassword: pwd,
          },
        };
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useVerifyCodeMutation,
  useResetPasswordMutation,
} = userAuthApi;
