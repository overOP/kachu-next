import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: number | string;
  name: string;
  email: string;
  role: string;
  img?: string;
  profileImage?: string;
}

interface AuthState {

  token: string | null;
  user: User | null; 
  isAuthenticated: boolean;
}
const isBrowser = typeof window !== "undefined";

function readStoredUser(): User | null {
  if (!isBrowser) return null;
  const raw = localStorage.getItem("userData");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    localStorage.removeItem("userData");
    return null;
  }
}

const initialState: AuthState = {
  token: isBrowser ? localStorage.getItem("token") : null,
  user: readStoredUser(),
  isAuthenticated: isBrowser ? !!localStorage.getItem("token") : false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: User }>
    ) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      state.isAuthenticated = true;

      if (typeof window !== "undefined") {
        localStorage.setItem('token', token);
        localStorage.setItem('userData', JSON.stringify(user));
      }
    },
    /** Refresh / silent re-auth: updates token; updates user only when `user` is provided. */
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
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
      }
    },
    // optional- for upadte data without relogging
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem('userData', JSON.stringify(action.payload));
      }
    }
  },
});

export const { setCredentials, setSession, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;