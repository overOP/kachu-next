import type { BaseQueryFn, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { refreshSession } from "@/lib/auth/refresh-session";
import { isUnauthorizedError } from "../errors";
import { logout, setSession } from "@/lib/store/auth-slice";

type JsonBody = Record<string, unknown>;

type FetchBaseQueryOptions = NonNullable<Parameters<typeof fetchBaseQuery>[0]>;

type FetchArg = string | (Record<string, unknown> & { url: string; method?: string; body?: unknown });

function stripUndefined(obj: JsonBody): JsonBody {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as JsonBody;
}

function isPlainJsonBody(body: unknown): body is JsonBody {
  if (body === null || typeof body !== "object") return false;
  if (body instanceof FormData) return false;
  if (body instanceof Blob) return false;
  if (body instanceof ArrayBuffer) return false;
  if (ArrayBuffer.isView(body)) return false;
  return true;
}

function normalizeFetchArgs(args: FetchArg): FetchArg {
  if (typeof args === "string") return args;

  const method = String(args.method ?? "GET").toUpperCase();
  let next: Record<string, unknown> = { ...args };

  if (isPlainJsonBody(next.body)) {
    next = { ...next, body: stripUndefined(next.body) };
  }

  if ((method === "POST" || method === "PUT" || method === "PATCH") && next.body === undefined) {
    next = { ...next, body: {} };
  }

  return next as FetchArg;
}

function wrapNormalizeBody(
  inner: BaseQueryFn<FetchArg, unknown, FetchBaseQueryError>
): BaseQueryFn<FetchArg, unknown, FetchBaseQueryError> {
  return async (args, api, extraOptions) => {
    const normalized = normalizeFetchArgs(args);
    return inner(normalized, api, extraOptions);
  };
}

function resolveRequestPath(args: FetchArg, baseUrl: string): string {
  const base = baseUrl.replace(/\/$/, "");
  if (typeof args === "string") {
    return args.startsWith("http") ? args : `${base}${args.startsWith("/") ? "" : "/"}${args}`;
  }
  const path = String(args.url ?? "");
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}

function shouldSkipReauth(args: FetchArg, baseUrl: string): boolean {
  const full = resolveRequestPath(args, baseUrl).toLowerCase();
  const skipFragments = [
    "/login",
    "/register",
    "/refresh",
    "/logout",
    "/forgot-password",
    "/verify-otp",
    "/reset-password",
  ];
  return skipFragments.some((frag) => full.includes(frag));
}

async function runSilentRefresh(dispatch: (action: unknown) => void): Promise<boolean> {
  const result = await refreshSession();
  if (!result.ok) return false;
  dispatch(
    setSession({
      token: result.token,
      ...(result.user ? { user: result.user } : {}),
    })
  );
  return true;
}

function wrapReauth(
  normalizedQuery: BaseQueryFn<FetchArg, unknown, FetchBaseQueryError>,
  baseUrl: string
): BaseQueryFn<FetchArg, unknown, FetchBaseQueryError> {
  return async (args, api, extraOptions) => {
    const result = await normalizedQuery(args, api, extraOptions);

    if (!isUnauthorizedError(result.error)) {
      return result;
    }
    if (shouldSkipReauth(args, baseUrl)) {
      return result;
    }

    const refreshed = await runSilentRefresh(api.dispatch);
    if (!refreshed) {
      api.dispatch(logout());
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        window.location.assign("/login");
      }
      return result;
    }

    return normalizedQuery(args, api, extraOptions);
  };
}

export function createAuthBaseQuery(
  options: FetchBaseQueryOptions
): BaseQueryFn<FetchArg, unknown, FetchBaseQueryError> {
  const { prepareHeaders: userPrepareHeaders, ...rest } = options;

  const raw = fetchBaseQuery({
    ...rest,
    credentials: "include",
    prepareHeaders: (headers, init) => {
      userPrepareHeaders?.(headers, init);
      const state = init.getState() as { auth?: { token: string | null } };
      const token = state.auth?.token ?? null;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      if (typeof headers.get === "function" && !headers.get("Accept")) {
        headers.set("Accept", "application/json");
      }
      if (
        typeof headers.get === "function" &&
        !headers.get("Content-Type") &&
        init.arg &&
        typeof init.arg === "object" &&
        "body" in init.arg &&
        isPlainJsonBody((init.arg as { body?: unknown }).body)
      ) {
        headers.set("Content-Type", "application/json");
      }
      return headers;
    },
  });

  const normalized = wrapNormalizeBody(raw);
  const baseUrlStr = String(options.baseUrl ?? "").replace(/\/$/, "");
  return wrapReauth(normalized, baseUrlStr);
}
