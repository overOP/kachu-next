import type { User, UserRole } from "@/lib/types/api";

export type AccessLevel = "public" | "authenticated" | "admin" | "superadmin";

const ADMIN_ROLES = new Set(["admin", "superadmin"]);
const SUPERADMIN_ROLES = new Set(["superadmin"]);

export function normalizeRole(role: string | undefined | null): string {
  return String(role ?? "")
    .trim()
    .toLowerCase();
}

export function isAuthenticated(user: User | null | undefined): boolean {
  return user != null;
}

export function isAdmin(user: User | null | undefined): boolean {
  return ADMIN_ROLES.has(normalizeRole(user?.role));
}

export function isSuperadmin(user: User | null | undefined): boolean {
  return SUPERADMIN_ROLES.has(normalizeRole(user?.role));
}

export function hasMinAccess(
  user: User | null | undefined,
  required: AccessLevel
): boolean {
  switch (required) {
    case "public":
      return true;
    case "authenticated":
      return isAuthenticated(user);
    case "admin":
      return isAdmin(user);
    case "superadmin":
      return isSuperadmin(user);
    default:
      return false;
  }
}

export function canManageUsers(user: User | null | undefined): boolean {
  return isAdmin(user);
}

export function canDeleteUser(
  actor: User | null | undefined,
  targetId?: number | string
): boolean {
  if (!isSuperadmin(actor)) return false;
  if (targetId == null || actor?.id == null) return true;
  return String(actor.id) !== String(targetId);
}

export function canEditReview(
  user: User | null | undefined,
  review: { userId?: number | string }
): boolean {
  if (!user) return false;
  if (isAdmin(user)) return true;
  if (review.userId == null) return false;
  return String(user.id) === String(review.userId);
}

export function canDeleteReview(
  user: User | null | undefined,
  review: { userId?: number | string }
): boolean {
  if (!user) return false;
  if (isAdmin(user)) return true;
  if (review.userId == null) return false;
  return String(user.id) === String(review.userId);
}

export function roleLabel(role: UserRole | string | undefined): string {
  const r = normalizeRole(role);
  if (r === "superadmin") return "Superadmin";
  if (r === "admin") return "Admin";
  if (r === "user") return "User";
  return r || "User";
}
