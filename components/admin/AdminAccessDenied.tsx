"use client";

import Link from "next/link";
import { FiAlertCircle } from "react-icons/fi";
import { useAuth } from "@/lib/hooks/use-auth";

export default function AdminAccessDenied() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-emerald-50/40 px-4 py-12 dark:bg-zinc-950">
      <div className="w-full max-w-md rounded-2xl border border-amber-200 bg-white p-8 text-center shadow-sm dark:border-amber-900/50 dark:bg-zinc-900">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/50">
          <FiAlertCircle className="h-6 w-6 text-amber-700 dark:text-amber-400" aria-hidden />
        </div>
        <h1 className="text-xl font-black text-emerald-950 dark:text-zinc-50">Access denied</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-zinc-400">
          Signed in as <span className="font-semibold">{user?.email}</span>, but this account is not
          an admin. Ask a superadmin to upgrade your role.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 dark:bg-sky-600"
          >
            Go to storefront
          </Link>
          <Link
            href="/profile"
            className="rounded-xl border border-emerald-200 px-5 py-2.5 text-sm font-semibold text-emerald-900 dark:border-zinc-600 dark:text-zinc-200"
          >
            Your profile
          </Link>
        </div>
      </div>
    </div>
  );
}
