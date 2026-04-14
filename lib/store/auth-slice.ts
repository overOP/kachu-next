import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user'; 
  img?: string;
}

interface AuthState {

  token: string | null;
  user: User | null; 
  isAuthenticated: boolean;
}
const isBrowser = typeof window !== 'undefined';

const initialState: AuthState = {
  token:isBrowser? localStorage.getItem('token'):null,
  user:isBrowser? JSON.parse(localStorage.getItem('userData') || 'null'):null,
  isAuthenticated: isBrowser? !!localStorage.getItem('token'):false,
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

      localStorage.setItem('token', token);
      localStorage.setItem('userData', JSON.stringify(user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
    },
    // optional- for upadte data without relogging
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem('userData', JSON.stringify(action.payload));
    }
  },
});

export const { setCredentials, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;