import { authApiBaseUrl } from "@/lib/api/config";
import { extractAccessToken, extractUser } from "@/lib/api/parse-response";
import type { User } from "@/lib/types/api";

export type RefreshSessionResult =
  | { ok: true; token: string; user?: User }
  | { ok: false; reason: "unauthorized" | "invalid" | "network" };

// Deduplicate concurrent refresh calls (startup + 401 retry may overlap).
let refreshInFlight: Promise<RefreshSessionResult> | null = null;

/**
 * Exchange the httpOnly refresh cookie for a new access token.
 * A 401 is expected when no cookie exists — callers should treat that as guest state.
 */
export async function refreshSession(): Promise<RefreshSessionResult> {
  if (!refreshInFlight) {
    refreshInFlight = performRefresh().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

async function performRefresh(): Promise<RefreshSessionResult> {
  try {
    const res = await fetch(`${authApiBaseUrl}/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { Accept: "application/json" },
    });

    if (res.status === 401) {
      return { ok: false, reason: "unauthorized" };
    }
    if (!res.ok) {
      return { ok: false, reason: "invalid" };
    }

    const json: unknown = await res.json().catch(() => null);
    const token = extractAccessToken(json);
    if (!token) {
      return { ok: false, reason: "invalid" };
    }

    const user = extractUser<User>(json);
    return { ok: true, token, ...(user !== undefined ? { user } : {}) };
  } catch {
    return { ok: false, reason: "network" };
  }
}
