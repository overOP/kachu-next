"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useRefreshMutation } from "@/lib/api/auth/user-auth-api";
import { setSession } from "@/lib/store/auth-slice";

/**
 * Runs once on app load: attempts cookie-based session refresh before rendering children.
 */
export default function AppInitializer({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const dispatch = useDispatch();
  const [refresh] = useRefreshMutation();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await refresh().unwrap();
        if (data?.token) {
          dispatch(
            setSession({
              token: data.token,
              ...(data.user ? { user: data.user } : {}),
            })
          );
        }
      } catch {
        // No valid refresh session — continue as guest
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [dispatch, refresh]);

  if (!ready) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-emerald-50/40 px-4 dark:bg-zinc-950">
        <div
          className="h-9 w-9 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent dark:border-sky-500 dark:border-t-transparent"
          aria-hidden
        />
        <p className="text-sm font-semibold text-emerald-900 dark:text-sky-300">Restoring session…</p>
      </div>
    );
  }

  return <>{children}</>;
}
