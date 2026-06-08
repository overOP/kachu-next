import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/lib/types/api";

export type { User };

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

/** Read persisted user for client-side hydration (never call during SSR initial state). */
export function readStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("userData");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    localStorage.removeItem("userData");
    return null;
  }
}

// Always start logged-out so server HTML matches the client's first paint (avoids hydration errors).
const initialState: AuthState = {
  token: null,
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; user: User }>) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      state.isAuthenticated = true;

      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
        localStorage.setItem("userData", JSON.stringify(user));
      }
    },
    setSession: (state, action: PayloadAction<{ token: string; user?: User }>) => {
      const { token, user } = action.payload;
      if (!token) return;
      state.token = token;
      state.isAuthenticated = true;
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
      }
      if (user !== undefined) {
        state.user = user;
        if (typeof window !== "undefined") {
          localStorage.setItem("userData", JSON.stringify(user));
        }
      }
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
      }
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("userData", JSON.stringify(action.payload));
      }
    },
  },
});

export const { setCredentials, setSession, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
