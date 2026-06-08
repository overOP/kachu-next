import { beforeEach, describe, expect, it, vi } from "vitest";
import type { BaseQueryApi } from "@reduxjs/toolkit/query";
import { createFetchMock, getHeader } from "../../../helpers/mock-fetch";
import { mockUser } from "../../../helpers/fixtures";

const refreshSessionMock = vi.fn();

vi.mock("@/lib/auth/refresh-session", () => ({
  refreshSession: (...args: unknown[]) => refreshSessionMock(...args),
}));

describe("createAuthBaseQuery integration", () => {
  const baseUrl = "http://localhost:5050/api/auth";

  beforeEach(() => {
    vi.resetModules();
    refreshSessionMock.mockReset();
    refreshSessionMock.mockResolvedValue({ ok: false, reason: "unauthorized" });
    Object.defineProperty(window, "location", {
      value: { pathname: "/products", assign: vi.fn() },
      writable: true,
    });
  });

  function makeApi(token: string | null = "old-token"): BaseQueryApi {
    return {
      dispatch: vi.fn(),
      getState: () => ({ auth: { token } }),
      signal: new AbortController().signal,
      abort: vi.fn(),
      extra: undefined,
      endpoint: "test",
      type: "query",
    } as unknown as BaseQueryApi;
  }

  it("attaches Bearer token on requests", async () => {
    const fetchMock = createFetchMock(({ url, headers }) => {
      if (!url.includes("/profile")) {
        return { ok: false, status: 404, body: {} };
      }
      if (getHeader(headers, "Authorization") !== "Bearer stored-token") {
        return { ok: false, status: 401, body: { message: "No auth" } };
      }
      return { ok: true, body: { ok: true } };
    });

    const { createAuthBaseQuery } = await import("@/lib/api/auth/authBaseQuery");
    const baseQuery = createAuthBaseQuery({ baseUrl });

    const result = await baseQuery({ url: "/profile", method: "GET" }, makeApi("stored-token"), {});

    expect(result.data).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("strips undefined fields from JSON bodies", async () => {
    const fetchMock = createFetchMock(({ url, method, body }) => {
      if (url.includes("/login") && method === "POST") {
        const parsed = JSON.parse(body ?? "{}");
        if ("remember" in parsed) {
          return { ok: false, status: 400, body: { message: "Unexpected field" } };
        }
        return { ok: true, body: {} };
      }
      return { ok: false, status: 404, body: {} };
    });

    const { createAuthBaseQuery } = await import("@/lib/api/auth/authBaseQuery");
    const baseQuery = createAuthBaseQuery({ baseUrl });

    const result = await baseQuery(
      {
        url: "/login",
        method: "POST",
        body: { email: "a@b.com", password: "secret", remember: undefined },
      },
      makeApi(null),
      {}
    );

    expect(result.error).toBeUndefined();
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("accepts POST to refresh without requiring a request body", async () => {
    const fetchMock = createFetchMock(({ url, method }) => {
      if (url.includes("/refresh") && method === "POST") {
        return { ok: true, body: {} };
      }
      return { ok: false, status: 404, body: {} };
    });

    const { createAuthBaseQuery } = await import("@/lib/api/auth/authBaseQuery");
    const baseQuery = createAuthBaseQuery({ baseUrl });

    const result = await baseQuery({ url: "/refresh", method: "POST" }, makeApi(null), {});

    expect(result.error).toBeUndefined();
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("does not retry refresh endpoint on 401", async () => {
    createFetchMock(() => ({
      ok: false,
      status: 401,
      body: { message: "No refresh token" },
    }));

    const { createAuthBaseQuery } = await import("@/lib/api/auth/authBaseQuery");
    const baseQuery = createAuthBaseQuery({ baseUrl });
    const api = makeApi(null);

    const result = await baseQuery({ url: "/refresh", method: "POST" }, api, {});

    expect(result.error?.status).toBe(401);
    expect(refreshSessionMock).not.toHaveBeenCalled();
    expect(api.dispatch).not.toHaveBeenCalled();
  });

  it("retries protected request after successful silent refresh", async () => {
    let callCount = 0;
    createFetchMock(({ url }) => {
      callCount += 1;
      if (url.includes("/protected")) {
        if (callCount === 1) {
          return { ok: false, status: 401, body: { message: "Expired" } };
        }
        return { ok: true, body: { data: "secret" } };
      }
      return { ok: false, status: 404, body: {} };
    });

    refreshSessionMock.mockResolvedValue({
      ok: true,
      token: "fresh-token",
      user: mockUser,
    });

    const { createAuthBaseQuery } = await import("@/lib/api/auth/authBaseQuery");
    const baseQuery = createAuthBaseQuery({ baseUrl: "http://localhost:5050" });
    const api = makeApi("expired-token");

    const result = await baseQuery(
      { url: "/protected", method: "GET" },
      api,
      {}
    );

    expect(refreshSessionMock).toHaveBeenCalledOnce();
    expect(api.dispatch).toHaveBeenCalled();
    expect(result.data).toEqual({ data: "secret" });
    expect(callCount).toBe(2);
  });

  it("logs out and redirects when silent refresh fails", async () => {
    createFetchMock(() => ({
      ok: false,
      status: 401,
      body: { message: "Unauthorized" },
    }));

    refreshSessionMock.mockResolvedValue({ ok: false, reason: "unauthorized" });

    const { createAuthBaseQuery } = await import("@/lib/api/auth/authBaseQuery");
    const baseQuery = createAuthBaseQuery({ baseUrl: "http://localhost:5050" });
    const api = makeApi("stale-token");

    Object.defineProperty(window, "location", {
      value: { pathname: "/profile", assign: vi.fn() },
      writable: true,
    });

    const result = await baseQuery(
      { url: "/api/reviews", method: "GET" },
      api,
      {}
    );

    expect(refreshSessionMock).toHaveBeenCalledOnce();
    expect(api.dispatch).toHaveBeenCalled();
    expect(result.error?.status).toBe(401);
    expect(window.location.assign).toHaveBeenCalledWith("/login");
  });
});
