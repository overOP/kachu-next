import type { BaseQueryFn, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { authApiBaseUrl } from "../config";
import { logout, setSession, type User } from "@/lib/store/auth-slice";

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

/** Do not run silent refresh for these auth flows (wrong password, etc.). */
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

function isUnauthorized(result: { error?: FetchBaseQueryError }): boolean {
  if (!result.error) return false;
  const s = result.error.status;
  if (s === 401) return true;
  if (typeof s === "string" && /^\d+$/.test(s) && Number(s) === 401) return true;
  return false;
}

function extractTokenFromRefresh(json: unknown): string | undefined {
  if (!json || typeof json !== "object") return undefined;
  const r = json as Record<string, unknown>;
  if (typeof r.token === "string" && r.token) return r.token;
  const data = r.data;
  if (data && typeof data === "object" && typeof (data as Record<string, unknown>).token === "string") {
    return (data as Record<string, unknown>).token as string;
  }
  return undefined;
}

function extractUserFromRefresh(json: unknown): User | undefined {
  if (!json || typeof json !== "object") return undefined;
  const r = json as Record<string, unknown>;
  if (r.user && typeof r.user === "object") return r.user as User;
  const data = r.data;
  if (data && typeof data === "object" && (data as Record<string, unknown>).user) {
    return (data as Record<string, unknown>).user as User;
  }
  return undefined;
}

let refreshInFlight: Promise<boolean> | null = null;

/**
 * Cookie-only refresh to avoid circular RTK baseQuery → refresh mutation.
 * Dispatches `setSession` with new access token (and user when present).
 */
function runSilentRefresh(dispatch: (action: unknown) => void): Promise<boolean> {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      try {
        const res = await fetch(`${authApiBaseUrl}/refresh`, {
          method: "POST",
          credentials: "include",
          headers: { Accept: "application/json" },
        });
        if (!res.ok) return false;
        const json: unknown = await res.json().catch(() => null);
        const token = extractTokenFromRefresh(json);
        if (!token) return false;
        const user = extractUserFromRefresh(json);
        dispatch(setSession({ token, ...(user !== undefined ? { user } : {}) }));
        return true;
      } catch {
        return false;
      } finally {
        refreshInFlight = null;
      }
    })();
  }
  return refreshInFlight;
}

function wrapReauth(
  normalizedQuery: BaseQueryFn<FetchArg, unknown, FetchBaseQueryError>,
  baseUrl: string
): BaseQueryFn<FetchArg, unknown, FetchBaseQueryError> {
  return async (args, api, extraOptions) => {
    const result = await normalizedQuery(args, api, extraOptions);

    if (!isUnauthorized(result)) {
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

/**
 * RTK Query base query with:
 * - `credentials: "include"` (HttpOnly cookies)
 * - `Authorization: Bearer <token>` from Redux `auth.token`
 * - JSON body normalization (strip undefined, default `{}` for mutating methods)
 * - On **401**: silent `/api/auth/refresh`, retry once; on refresh failure → `logout()` + redirect `/login`
 */
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
      return headers;
    },
  });

  const normalized = wrapNormalizeBody(raw);
  const baseUrlStr = String(options.baseUrl ?? "").replace(/\/$/, "");
  return wrapReauth(normalized, baseUrlStr);
}
