import { afterEach, describe, expect, it, vi } from "vitest";
import { createFetchMock, mockNetworkError } from "../../../helpers/mock-fetch";
import { mockAdmin } from "../../../helpers/fixtures";

describe("refreshSession", () => {
  afterEach(() => {
    vi.resetModules();
  });

  it("returns token and user on successful refresh", async () => {
    createFetchMock(({ url, method }) => {
      expect(url).toContain("/api/auth/refresh");
      expect(method).toBe("POST");
      return {
        ok: true,
        body: { accessToken: "new-token", user: mockAdmin },
      };
    });

    const { refreshSession } = await import("@/lib/auth/refresh-session");
    const result = await refreshSession();

    expect(result).toEqual({ ok: true, token: "new-token", user: mockAdmin });
  });

  it("returns unauthorized for 401 (no refresh cookie)", async () => {
    createFetchMock(() => ({
      ok: false,
      status: 401,
      body: { message: "No refresh token" },
    }));

    const { refreshSession } = await import("@/lib/auth/refresh-session");
    const result = await refreshSession();

    expect(result).toEqual({ ok: false, reason: "unauthorized" });
  });

  it("returns invalid when response has no token", async () => {
    createFetchMock(() => ({
      ok: true,
      body: { message: "ok" },
    }));

    const { refreshSession } = await import("@/lib/auth/refresh-session");
    const result = await refreshSession();

    expect(result).toEqual({ ok: false, reason: "invalid" });
  });

  it("returns invalid for non-401 error statuses", async () => {
    createFetchMock(() => ({
      ok: false,
      status: 500,
      body: { message: "Server error" },
    }));

    const { refreshSession } = await import("@/lib/auth/refresh-session");
    const result = await refreshSession();

    expect(result).toEqual({ ok: false, reason: "invalid" });
  });

  it("returns network on fetch failure", async () => {
    mockNetworkError();

    const { refreshSession } = await import("@/lib/auth/refresh-session");
    const result = await refreshSession();

    expect(result).toEqual({ ok: false, reason: "network" });
  });

  it("deduplicates concurrent refresh calls", async () => {
    const fetchMock = createFetchMock(
      () =>
        new Promise((resolve) => {
          setTimeout(
            () =>
              resolve({
                ok: true,
                body: { accessToken: "deduped-token" },
              }),
            20
          );
        })
    );

    const { refreshSession } = await import("@/lib/auth/refresh-session");
    const [first, second] = await Promise.all([refreshSession(), refreshSession()]);

    expect(first).toEqual({ ok: true, token: "deduped-token" });
    expect(second).toEqual({ ok: true, token: "deduped-token" });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
