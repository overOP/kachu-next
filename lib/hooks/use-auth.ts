"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import {
  canManageUsers,
  hasMinAccess,
  isAdmin,
  isAuthenticated,
  isSuperadmin,
  type AccessLevel,
} from "@/lib/auth/rbac";

export function useAuth() {
  const { user, token, isAuthenticated: authed } = useSelector((s: RootState) => s.auth);

  return {
    user,
    token,
    isAuthenticated: authed && !!token,
    isAdmin: isAdmin(user),
    isSuperadmin: isSuperadmin(user),
    canManageUsers: canManageUsers(user),
    hasAccess: (level: AccessLevel) => hasMinAccess(user, level),
    isLoggedIn: isAuthenticated(user) && authed,
  };
}
