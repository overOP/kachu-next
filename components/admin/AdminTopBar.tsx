"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { FiHome, FiLogOut } from "react-icons/fi";
import { useLogoutMutation } from "@/lib/api/auth/user-auth-api";
import { logout } from "@/lib/store/auth-slice";
import { useAuth } from "@/lib/hooks/use-auth";
import RoleBadge from "@/components/admin/RoleBadge";

export default function AdminTopBar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [logoutApi, { isLoading }] = useLogoutMutation();

  async function handleLogout() {
    try {
      await logoutApi().unwrap();
    } catch {
      // clear local session regardless
    } finally {
      dispatch(logout());
      router.refresh();
    }
  }

  return (
    <header className="flex shrink-0 items-center justify-between gap-4 border-b border-emerald-100 bg-white/80 px-4 py-3 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80 sm:px-8">
      <div className="flex min-w-0 items-center gap-3">
        {user?.profileImage || user?.img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.profileImage ?? user.img ?? ""}
            alt=""
            className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-emerald-100 dark:ring-zinc-700"
          />
        ) : (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white dark:bg-sky-600">
            {(user?.name ?? "A").charAt(0)}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-emerald-950 dark:text-zinc-100">
            {user?.name ?? "Admin"}
          </p>
          <p className="truncate text-xs text-slate-500 dark:text-zinc-500">{user?.email}</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <Link
          href="/"
          className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-900 transition hover:bg-emerald-100 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
        >
          <FiHome className="h-4 w-4 shrink-0" aria-hidden />
          <span className="hidden sm:inline">View website</span>
          <span className="sm:hidden">Store</span>
        </Link>
        <RoleBadge role={user?.role} />
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoading}
          className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-900 transition hover:bg-emerald-50 disabled:opacity-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          <FiLogOut className="h-4 w-4" aria-hidden />
          <span className="hidden sm:inline">{isLoading ? "Signing out…" : "Sign out"}</span>
        </button>
      </div>
    </header>
  );
}
