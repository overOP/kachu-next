import { describe, expect, it } from "vitest";
import authReducer, {
  logout,
  setCredentials,
  setSession,
  updateUser,
} from "@/lib/store/auth-slice";
import { mockAdmin, mockUser } from "../../../helpers/fixtures";

const initialState = {
  token: null as string | null,
  user: null as typeof mockUser | null,
  isAuthenticated: false,
};

describe("authSlice", () => {
  describe("setCredentials", () => {
    it("stores token, user, and persists to localStorage", () => {
      const state = authReducer(
        initialState,
        setCredentials({ token: "jwt-123", user: mockUser })
      );

      expect(state.token).toBe("jwt-123");
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(localStorage.getItem("token")).toBe("jwt-123");
      expect(JSON.parse(localStorage.getItem("userData")!)).toEqual(mockUser);
    });
  });

  describe("setSession", () => {
    it("stores token without user", () => {
      const state = authReducer(initialState, setSession({ token: "access-only" }));
      expect(state.token).toBe("access-only");
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toBeNull();
      expect(localStorage.getItem("token")).toBe("access-only");
    });

    it("stores token and optional user", () => {
      const state = authReducer(
        initialState,
        setSession({ token: "jwt-456", user: mockAdmin })
      );
      expect(state.user).toEqual(mockAdmin);
      expect(JSON.parse(localStorage.getItem("userData")!)).toEqual(mockAdmin);
    });

    it("ignores empty token", () => {
      const state = authReducer(initialState, setSession({ token: "" }));
      expect(state).toEqual(initialState);
    });
  });

  describe("logout", () => {
    it("clears auth state and localStorage", () => {
      localStorage.setItem("token", "old");
      localStorage.setItem("userData", JSON.stringify(mockUser));

      const state = authReducer(
        { token: "old", user: mockUser, isAuthenticated: true },
        logout()
      );

      expect(state.token).toBeNull();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(localStorage.getItem("token")).toBeNull();
      expect(localStorage.getItem("userData")).toBeNull();
    });
  });

  describe("updateUser", () => {
    it("updates user in state and localStorage", () => {
      const updated = { ...mockUser, name: "Updated Name" };
      const state = authReducer(
        { token: "jwt", user: mockUser, isAuthenticated: true },
        updateUser(updated)
      );

      expect(state.user?.name).toBe("Updated Name");
      expect(JSON.parse(localStorage.getItem("userData")!)).toEqual(updated);
    });
  });
});
