"use client";

import { useAppSelector } from "@/lib/store/hooks";
import {
  canManageUsers,
  hasMinAccess,
  isAdmin,
  isAuthenticated,
  isSuperadmin,
  type AccessLevel,
} from "@/lib/auth/rbac";

export function useAuth() {
  const { user, token, isAuthenticated: authed } = useAppSelector((s) => s.auth);

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
