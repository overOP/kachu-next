"use client";

import { useSyncExternalStore } from "react";
import { useAppSelector } from "@/lib/store/hooks";
import {
  canManageUsers,
  hasMinAccess,
  isAdmin,
  isAuthenticated,
  isSuperadmin,
  type AccessLevel,
} from "@/lib/auth/rbac";

/** True only after the client has hydrated — keeps SSR and first client paint in sync. */
function useHasHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export function useAuth() {
  const hydrated = useHasHydrated();
  const { user, token, isAuthenticated: authed } = useAppSelector((s) => s.auth);
  const sessionUser = hydrated ? user : null;
  const sessionToken = hydrated ? token : null;
  const sessionAuthed = hydrated && authed && !!token;

  return {
    user: sessionUser,
    token: sessionToken,
    isAuthenticated: sessionAuthed,
    isAdmin: isAdmin(sessionUser),
    isSuperadmin: isSuperadmin(sessionUser),
    canManageUsers: canManageUsers(sessionUser),
    hasAccess: (level: AccessLevel) => hasMinAccess(sessionUser, level),
    isLoggedIn: isAuthenticated(sessionUser) && sessionAuthed,
  };
}
