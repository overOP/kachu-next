"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import AuthCard from "@/components/auth/AuthCard";
import AuthPageHeader from "@/components/auth/AuthPageHeader";
import AuthTextField from "@/components/auth/AuthTextField";
import AuthPrimaryButton from "@/components/auth/AuthPrimaryButton";
import BackLink from "@/components/ui/BackLink";

export default function SignUpPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <AuthShell>
      <AuthPageHeader
        eyebrow="Join Kachu Kart"
        title="Create your account"
        subtitle="Frontend preview — connect registration when your backend is ready."
      />

      <AuthCard>
        <form onSubmit={handleSubmit} className="space-y-5">
          <AuthTextField id="name" name="name" label="Full name" type="text" autoComplete="name" placeholder="Your name" />
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
            autoComplete="new-password"
            placeholder="••••••••"
          />
          <AuthTextField
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
          />

          <label className="flex items-start gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              name="terms"
              required
              className="mt-1 rounded border-gray-300 dark:border-zinc-600 text-emerald-600 focus:ring-emerald-500 dark:bg-zinc-900"
            />
            <span className="text-sm text-slate-600 dark:text-zinc-400 leading-snug">
              I agree to the{" "}
              <button type="button" className="font-semibold text-emerald-600 dark:text-sky-400 hover:underline">
                Terms
              </button>{" "}
              and{" "}
              <button type="button" className="font-semibold text-emerald-600 dark:text-sky-400 hover:underline">
                Privacy Policy
              </button>
            </span>
          </label>

          <AuthPrimaryButton>Create account</AuthPrimaryButton>
        </form>

        {submitted && (
          <p className="mt-4 text-center text-sm text-emerald-700 dark:text-sky-300 font-medium" role="status">
            Demo only — no account was created. Hook up your API to register users.
          </p>
        )}

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-zinc-400">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-emerald-600 dark:text-sky-400 hover:underline">
            Sign in
          </Link>
        </p>
      </AuthCard>

      <BackLink href="/">← Back to home</BackLink>
    </AuthShell>
  );
}
