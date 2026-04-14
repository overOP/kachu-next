/** Central API base URLs — override with NEXT_PUBLIC_API_URL in production */
export const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export const apiBaseQueryUrl = `${API_ORIGIN.replace(/\/$/, "")}/`;

export const userAuthApiBaseUrl = `${API_ORIGIN.replace(/\/$/, "")}/api/users`;
