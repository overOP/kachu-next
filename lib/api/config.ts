/** Central API origin — trim once; override with NEXT_PUBLIC_API_URL in production */
const trimmedOrigin = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5050").replace(/\/$/, "");

export const API_ORIGIN = trimmedOrigin;

export const apiBaseQueryUrl = `${trimmedOrigin}/`;

/** Cookie + JWT auth routes */
export const authApiBaseUrl = `${trimmedOrigin}/api/auth`;

/** User CRUD / admin user routes (not auth login/register) */
export const usersApiBaseUrl = `${trimmedOrigin}/api/users`;
