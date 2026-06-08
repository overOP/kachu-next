"use client";

import { useEffect } from "react";
import { refreshSession } from "@/lib/auth/refresh-session";
import { useAppDispatch } from "@/lib/store/hooks";
import { logout, setSession } from "@/lib/store/auth-slice";

/**
 * Restores auth from the httpOnly refresh cookie in the background.
 * Public pages render immediately — no global loading gate.
 */
export default function AppInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    let cancelled = false;

    void refreshSession().then((result) => {
      if (cancelled) return;

      if (result.ok) {
        dispatch(
          setSession({
            token: result.token,
            ...(result.user ? { user: result.user } : {}),
          })
        );
      } else {
        // 401 = no cookie (guest). Also clears stale tokens left in localStorage.
        dispatch(logout());
      }
    });

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  return <>{children}</>;
}
