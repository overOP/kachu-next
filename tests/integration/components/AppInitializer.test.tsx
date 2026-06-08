import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { afterEach, describe, expect, it, vi } from "vitest";
import AppInitializer from "@/components/auth/AppInitializer";
import { createTestStore } from "../../helpers/store";
import { mockUser } from "../../helpers/fixtures";

const refreshSessionMock = vi.fn();

vi.mock("@/lib/auth/refresh-session", () => ({
  refreshSession: (...args: unknown[]) => refreshSessionMock(...args),
}));

describe("AppInitializer user flow", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders children immediately without blocking spinner", () => {
    refreshSessionMock.mockReturnValue(new Promise(() => {}));

    render(
      <Provider store={createTestStore()}>
        <AppInitializer>
          <p>Storefront content</p>
        </AppInitializer>
      </Provider>
    );

    expect(screen.getByText("Storefront content")).toBeInTheDocument();
    expect(screen.queryByText(/Restoring session/i)).not.toBeInTheDocument();
  });

  it("restores cached localStorage session before refresh completes", async () => {
    localStorage.setItem("token", "cached-token");
    localStorage.setItem("userData", JSON.stringify(mockUser));
    refreshSessionMock.mockReturnValue(new Promise(() => {}));

    const store = createTestStore();

    render(
      <Provider store={store}>
        <AppInitializer>
          <p>Ready</p>
        </AppInitializer>
      </Provider>
    );

    await waitFor(() => {
      expect(store.getState().auth.token).toBe("cached-token");
      expect(store.getState().auth.user).toEqual(mockUser);
      expect(store.getState().auth.isAuthenticated).toBe(true);
    });
  });

  it("restores session when refresh succeeds", async () => {
    refreshSessionMock.mockResolvedValue({
      ok: true,
      token: "restored-token",
      user: mockUser,
    });

    const store = createTestStore();

    render(
      <Provider store={store}>
        <AppInitializer>
          <p>Ready</p>
        </AppInitializer>
      </Provider>
    );

    await waitFor(() => {
      expect(store.getState().auth.token).toBe("restored-token");
      expect(store.getState().auth.user).toEqual(mockUser);
      expect(store.getState().auth.isAuthenticated).toBe(true);
    });
  });

  it("clears stale auth when refresh returns unauthorized", async () => {
    localStorage.setItem("token", "stale");
    localStorage.setItem("userData", JSON.stringify(mockUser));

    refreshSessionMock.mockResolvedValue({ ok: false, reason: "unauthorized" });

    const store = createTestStore({
      token: "stale",
      user: mockUser,
      isAuthenticated: true,
    });

    render(
      <Provider store={store}>
        <AppInitializer>
          <p>Guest view</p>
        </AppInitializer>
      </Provider>
    );

    await waitFor(() => {
      expect(store.getState().auth.isAuthenticated).toBe(false);
      expect(store.getState().auth.token).toBeNull();
      expect(localStorage.getItem("token")).toBeNull();
    });
  });
});
