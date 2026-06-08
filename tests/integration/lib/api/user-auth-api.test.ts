import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFetchMock } from "../../../helpers/mock-fetch";
import { createTestStore } from "../../../helpers/store";
import { mockUser } from "../../../helpers/fixtures";

vi.mock("@/lib/auth/refresh-session", () => ({
  refreshSession: vi.fn().mockResolvedValue({ ok: false, reason: "unauthorized" }),
}));

describe("userAuthApi integration", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("login mutation parses token and user", async () => {
    createFetchMock(({ url, method }) => {
      if (url.includes("/login") && method === "POST") {
        return {
          ok: true,
          body: {
            token: "login-jwt",
            user: mockUser,
          },
        };
      }
      return { ok: false, status: 404, body: {} };
    });

    const { userAuthApi } = await import("@/lib/api/auth/user-auth-api");
    const store = createTestStore();

    const result = await store.dispatch(
      userAuthApi.endpoints.login.initiate({
        email: "test@example.com",
        password: "password123",
      })
    );

    expect(result.data).toEqual({ token: "login-jwt", user: mockUser });
  });

  it("login mutation rejects missing credentials at query build time", async () => {
    const { userAuthApi } = await import("@/lib/api/auth/user-auth-api");
    const store = createTestStore();

    const result = await store.dispatch(
      userAuthApi.endpoints.login.initiate({ email: "", password: "" })
    );

    expect(result.error).toBeDefined();
    expect(result.error).toMatchObject({
      message: expect.stringMatching(/Email and password are required/i),
    });
  });

  it("refresh mutation parses accessToken response", async () => {
    createFetchMock(({ url, method }) => {
      if (url.includes("/refresh") && method === "POST") {
        return {
          ok: true,
          body: { accessToken: "refreshed-token", user: mockUser },
        };
      }
      return { ok: false, status: 404, body: {} };
    });

    const { userAuthApi } = await import("@/lib/api/auth/user-auth-api");
    const store = createTestStore();

    const result = await store.dispatch(userAuthApi.endpoints.refresh.initiate());

    expect(result.data).toEqual({ token: "refreshed-token", user: mockUser });
  });

  it("refresh mutation returns 401 for missing cookie without throwing", async () => {
    createFetchMock(({ url, method }) => {
      if (url.includes("/refresh") && method === "POST") {
        return { ok: false, status: 401, body: { message: "No refresh token" } };
      }
      return { ok: false, status: 404, body: {} };
    });

    const { userAuthApi } = await import("@/lib/api/auth/user-auth-api");
    const store = createTestStore();

    const result = await store.dispatch(userAuthApi.endpoints.refresh.initiate());

    expect(result.error).toBeDefined();
    expect(result.error && "status" in result.error ? result.error.status : null).toBe(401);
  });

  it("logout mutation clears auth even when API fails", async () => {
    createFetchMock(({ url, method }) => {
      if (url.includes("/logout") && method === "POST") {
        return { ok: false, status: 500, body: { message: "Server error" } };
      }
      return { ok: false, status: 404, body: {} };
    });

    const { userAuthApi } = await import("@/lib/api/auth/user-auth-api");
    const { setCredentials } = await import("@/lib/store/auth-slice");
    const store = createTestStore();

    store.dispatch(setCredentials({ token: "jwt", user: mockUser }));
    expect(store.getState().auth.isAuthenticated).toBe(true);

    await store.dispatch(userAuthApi.endpoints.logout.initiate());

    expect(store.getState().auth.isAuthenticated).toBe(false);
    expect(store.getState().auth.token).toBeNull();
  });

  it("verifyCode mutation extracts resetToken", async () => {
    createFetchMock(({ url, method }) => {
      if (url.includes("/verify-otp") && method === "POST") {
        return { ok: true, body: { resetToken: "reset-abc" } };
      }
      return { ok: false, status: 404, body: {} };
    });

    const { userAuthApi } = await import("@/lib/api/auth/user-auth-api");
    const store = createTestStore();

    const result = await store.dispatch(
      userAuthApi.endpoints.verifyCode.initiate({
        email: "test@example.com",
        otp: "123456",
      })
    );

    expect(result.data).toEqual({ resetToken: "reset-abc" });
  });

  it("resetPassword sends resetToken and newPassword", async () => {
    const fetchMock = createFetchMock(({ url, method, body }) => {
      if (url.includes("/reset-password") && method === "POST") {
        expect(JSON.parse(body ?? "{}")).toEqual({
          resetToken: "reset-abc",
          newPassword: "NewPass123!",
        });
        return { ok: true, body: { message: "Password reset" } };
      }
      return { ok: false, status: 404, body: {} };
    });

    const { userAuthApi } = await import("@/lib/api/auth/user-auth-api");
    const store = createTestStore();

    const result = await store.dispatch(
      userAuthApi.endpoints.resetPassword.initiate({
        resetToken: "reset-abc",
        password: "NewPass123!",
      })
    );

    expect(result.data).toBeUndefined();
    expect(fetchMock).toHaveBeenCalled();
  });
});
