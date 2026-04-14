"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import AuthCard from "@/components/auth/AuthCard";
import AuthPageHeader from "@/components/auth/AuthPageHeader";
import AuthTextField from "@/components/auth/AuthTextField";
import AuthPrimaryButton from "@/components/auth/AuthPrimaryButton";
import BackLink from "@/components/ui/BackLink";

export default function LoginPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <AuthShell>
      <AuthPageHeader
        eyebrow="Welcome back"
        title="Sign in to Kachu Kart"
        subtitle="Frontend preview — wire up your auth API when ready."
      />

      <AuthCard>
        <form onSubmit={handleSubmit} className="space-y-5">
          <AuthTextField
            id="email"
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
          />
          <AuthTextField
            id="password"
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            labelExtra={
              <button type="button" className="text-xs font-semibold text-emerald-600 dark:text-sky-400 hover:underline">
                Forgot password?
              </button>
            }
          />

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              name="remember"
              className="rounded border-gray-300 dark:border-zinc-600 text-emerald-600 focus:ring-emerald-500 dark:bg-zinc-900"
            />
            <span className="text-sm text-slate-600 dark:text-zinc-400">Remember me</span>
          </label>

          <AuthPrimaryButton>Sign in</AuthPrimaryButton>
        </form>

        {submitted && (
          <p className="mt-4 text-center text-sm text-emerald-700 dark:text-sky-300 font-medium" role="status">
            Demo only — no account was checked. Connect authentication to go live.
          </p>
        )}

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-zinc-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-bold text-emerald-600 dark:text-sky-400 hover:underline">
            Sign up
          </Link>
        </p>
      </AuthCard>

      <BackLink href="/">← Back to home</BackLink>
    </AuthShell>
  );
}
