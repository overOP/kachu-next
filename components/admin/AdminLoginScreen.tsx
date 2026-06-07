"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { FiLock, FiMail, FiShield } from "react-icons/fi";
import { useLoginMutation } from "@/lib/api/auth/user-auth-api";
import { setCredentials } from "@/lib/store/auth-slice";
import { parseApiError } from "@/lib/api/errors";
import { isAdmin } from "@/lib/auth/rbac";
import { authInputClassName, authLabelClassName } from "@/components/auth/authFieldClasses";

export default function AdminLoginScreen() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [login, { isLoading }] = useLoginMutation();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const result = await login({ email: email.trim(), password }).unwrap();
      if (!isAdmin(result.user)) {
        setError("This account does not have admin access. Contact a superadmin.");
        return;
      }
      dispatch(setCredentials({ token: result.token, user: result.user }));
    } catch (err) {
      setError(parseApiError(err, "Invalid email or password.").message);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 px-4 py-12 dark:from-zinc-950 dark:via-zinc-900 dark:to-emerald-950">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -right-16 bottom-16 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 ring-1 ring-emerald-400/30">
            <FiShield className="h-7 w-7 text-emerald-300" aria-hidden />
          </div>
          <h1 className="font-syne text-3xl font-black tracking-tight text-white">Kachu Admin</h1>
          <p className="mt-2 text-sm text-emerald-100/80">
            Sign in with your admin email to manage the catalog.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/95 p-6 shadow-2xl shadow-black/30 backdrop-blur-sm dark:bg-zinc-900/95 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="admin-email" className={authLabelClassName}>
                Admin email
              </label>
              <div className="relative mt-1.5">
                <FiMail
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden
                />
                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="admin@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${authInputClassName} pl-10`}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between gap-2">
                <label htmlFor="admin-password" className={authLabelClassName}>
                  Password
                </label>
                <Link
                  href="/forgot-password?next=/admin"
                  className="text-xs font-semibold text-emerald-600 hover:underline dark:text-sky-400"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative mt-1.5">
                <FiLock
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden
                />
                <input
                  id="admin-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${authInputClassName} pl-10`}
                />
              </div>
            </div>

            {error ? (
              <p
                className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800 dark:bg-red-950/50 dark:text-red-200"
                role="alert"
              >
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isLoading}
              className="flex min-h-11 w-full items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-700 disabled:opacity-60 dark:bg-sky-600 dark:hover:bg-sky-500"
            >
              {isLoading ? "Signing in…" : "Sign in to admin"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500 dark:text-zinc-500">
            Admin and superadmin accounts only.{" "}
            <Link href="/" className="font-semibold text-emerald-700 hover:underline dark:text-sky-400">
              Back to storefront
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
