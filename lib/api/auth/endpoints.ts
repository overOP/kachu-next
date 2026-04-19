/** Relative paths under `authApiBaseUrl` (`/api/auth`) */
export const AUTH_ENDPOINTS = {
  login: "/login",
  register: "/register",
  refresh: "/refresh",
  logout: "/logout",
  forgotPassword: "/forgot-password",
  verifyOtp: "/verify-otp",
  resetPassword: "/reset-password",
} as const;
