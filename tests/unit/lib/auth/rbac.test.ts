import { describe, expect, it } from "vitest";
import {
  canDeleteReview,
  canDeleteUser,
  canEditReview,
  canManageUsers,
  hasMinAccess,
  isAdmin,
  isAuthenticated,
  isSuperadmin,
  normalizeRole,
  roleLabel,
} from "@/lib/auth/rbac";
import { mockAdmin, mockSuperadmin, mockUser } from "../../../helpers/fixtures";

describe("normalizeRole", () => {
  it("lowercases and trims role strings", () => {
    expect(normalizeRole("  ADMIN ")).toBe("admin");
  });

  it("returns empty string for nullish values", () => {
    expect(normalizeRole(null)).toBe("");
    expect(normalizeRole(undefined)).toBe("");
  });
});

describe("isAuthenticated", () => {
  it("returns true when user object exists", () => {
    expect(isAuthenticated(mockUser)).toBe(true);
  });

  it("returns false for null/undefined", () => {
    expect(isAuthenticated(null)).toBe(false);
    expect(isAuthenticated(undefined)).toBe(false);
  });
});

describe("isAdmin", () => {
  it("returns true for admin and superadmin", () => {
    expect(isAdmin(mockAdmin)).toBe(true);
    expect(isAdmin(mockSuperadmin)).toBe(true);
  });

  it("returns false for regular users", () => {
    expect(isAdmin(mockUser)).toBe(false);
    expect(isAdmin(null)).toBe(false);
  });
});

describe("isSuperadmin", () => {
  it("returns true only for superadmin role", () => {
    expect(isSuperadmin(mockSuperadmin)).toBe(true);
    expect(isSuperadmin(mockAdmin)).toBe(false);
    expect(isSuperadmin(mockUser)).toBe(false);
  });
});

describe("hasMinAccess", () => {
  it("always allows public access", () => {
    expect(hasMinAccess(null, "public")).toBe(true);
  });

  it("requires user for authenticated level", () => {
    expect(hasMinAccess(mockUser, "authenticated")).toBe(true);
    expect(hasMinAccess(null, "authenticated")).toBe(false);
  });

  it("requires admin for admin level", () => {
    expect(hasMinAccess(mockAdmin, "admin")).toBe(true);
    expect(hasMinAccess(mockUser, "admin")).toBe(false);
  });

  it("requires superadmin for superadmin level", () => {
    expect(hasMinAccess(mockSuperadmin, "superadmin")).toBe(true);
    expect(hasMinAccess(mockAdmin, "superadmin")).toBe(false);
  });
});

describe("canManageUsers", () => {
  it("allows admins and superadmins", () => {
    expect(canManageUsers(mockAdmin)).toBe(true);
    expect(canManageUsers(mockSuperadmin)).toBe(true);
    expect(canManageUsers(mockUser)).toBe(false);
  });
});

describe("canDeleteUser", () => {
  it("denies non-superadmins", () => {
    expect(canDeleteUser(mockAdmin, "user-2")).toBe(false);
    expect(canDeleteUser(mockUser, "user-2")).toBe(false);
  });

  it("allows superadmin to delete other users", () => {
    expect(canDeleteUser(mockSuperadmin, "user-2")).toBe(true);
  });

  it("prevents superadmin from deleting themselves", () => {
    expect(canDeleteUser(mockSuperadmin, mockSuperadmin.id)).toBe(false);
  });

  it("allows superadmin when target id is omitted", () => {
    expect(canDeleteUser(mockSuperadmin)).toBe(true);
  });
});

describe("canEditReview / canDeleteReview", () => {
  const ownReview = { userId: mockUser.id };
  const otherReview = { userId: "other-user" };

  it("allows review owner to edit and delete", () => {
    expect(canEditReview(mockUser, ownReview)).toBe(true);
    expect(canDeleteReview(mockUser, ownReview)).toBe(true);
  });

  it("denies other users", () => {
    expect(canEditReview(mockUser, otherReview)).toBe(false);
    expect(canDeleteReview(mockUser, otherReview)).toBe(false);
  });

  it("allows admins to moderate any review", () => {
    expect(canEditReview(mockAdmin, otherReview)).toBe(true);
    expect(canDeleteReview(mockAdmin, otherReview)).toBe(true);
  });

  it("denies when userId is missing on review", () => {
    expect(canEditReview(mockUser, {})).toBe(false);
    expect(canDeleteReview(mockUser, {})).toBe(false);
  });

  it("denies unauthenticated users", () => {
    expect(canEditReview(null, ownReview)).toBe(false);
    expect(canDeleteReview(null, ownReview)).toBe(false);
  });
});

describe("roleLabel", () => {
  it("maps known roles to display labels", () => {
    expect(roleLabel("superadmin")).toBe("Superadmin");
    expect(roleLabel("admin")).toBe("Admin");
    expect(roleLabel("user")).toBe("User");
  });

  it("returns raw role or User fallback", () => {
    expect(roleLabel("moderator")).toBe("moderator");
    expect(roleLabel("")).toBe("User");
  });
});
