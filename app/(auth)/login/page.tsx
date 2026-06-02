"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import AuthShell from "@/components/auth/AuthShell";
import AuthCard from "@/components/auth/AuthCard";
import AuthPageHeader from "@/components/auth/AuthPageHeader";
import AuthTextField from "@/components/auth/AuthTextField";
import AuthPrimaryButton from "@/components/auth/AuthPrimaryButton";
import BackLink from "@/components/ui/BackLink";
import {
  useLoginMutation,
  useLogoutMutation,
} from "@/lib/api/auth/user-auth-api";
import { logout as clearAuth, setCredentials } from "@/lib/store/auth-slice";
import type { RootState } from "@/lib/store";

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [logoutApi, { isLoading: isLoggingOut }] = useLogoutMutation();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const result = await login({ email: email.trim(), password }).unwrap();
      dispatch(setCredentials({ token: result.token, user: result.user }));
      setMessage("Signed in successfully.");
      router.push("/");
    } catch (err: unknown) {
      const maybeMessage =
        typeof err === "object" &&
        err !== null &&
        "data" in err &&
        typeof (err as { data?: { message?: unknown } }).data?.message === "string"
          ? (err as { data: { message: string } }).data.message
          : "Could not sign in. Please check your credentials.";
      setError(maybeMessage);
    }
  }

  async function handleLogout() {
    setMessage("");
    setError("");
    try {
      await logoutApi().unwrap();
    } catch {
      // Clear local auth state even if token already expired.
    } finally {
      dispatch(clearAuth());
      setMessage("Logged out.");
    }
  }

  return (
    <AuthShell>
      <AuthPageHeader
        eyebrow="Welcome back"
        title="Sign in to Kachu Kart"
        subtitle="Use your account credentials to access Kachu Kart."
      />

      <AuthCard>
        {isAuthenticated ? (
          <div className="space-y-5">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 dark:border-zinc-700 dark:bg-zinc-800/60">
              <p className="text-sm font-semibold text-emerald-950 dark:text-zinc-100">
                Signed in as {user?.name}
              </p>
              <p className="text-xs text-slate-700 dark:text-zinc-300">{user?.email}</p>
            </div>
            <AuthPrimaryButton
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Signing out..." : "Logout"}
            </AuthPrimaryButton>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-5">
              <AuthTextField
                id="email"
                name="email"
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <AuthTextField
                id="password"
                name="password"
                label="Password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                labelExtra={
                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-emerald-600 dark:text-sky-400 hover:underline"
                  >
                    Forgot password?
                  </Link>
                }
              />

              <AuthPrimaryButton disabled={isLoggingIn}>
                {isLoggingIn ? "Signing in..." : "Sign in"}
              </AuthPrimaryButton>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600 dark:text-zinc-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-bold text-emerald-600 dark:text-sky-400 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </>
        )}
        {error ? (
          <p className="mt-4 text-center text-sm text-red-600 dark:text-red-400 font-medium" role="alert">
            {error}
          </p>
        ) : null}
        {message ? (
          <p className="mt-4 text-center text-sm text-emerald-700 dark:text-sky-300 font-medium" role="status">
            {message}
          </p>
        ) : null}
      </AuthCard>

      <BackLink href="/">← Back to home</BackLink>
    </AuthShell>
  );
}
