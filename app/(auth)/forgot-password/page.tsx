"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import AuthCard from "@/components/auth/AuthCard";
import AuthPageHeader from "@/components/auth/AuthPageHeader";
import AuthTextField from "@/components/auth/AuthTextField";
import AuthPrimaryButton from "@/components/auth/AuthPrimaryButton";
import BackLink from "@/components/ui/BackLink";

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <AuthShell>
      <AuthPageHeader
        eyebrow="Account recovery"
        title="Forgot your password?"
        subtitle="Enter your email and we will send a reset link."
      />

      <AuthCard>
        <form onSubmit={handleSubmit} className="space-y-5">
          <AuthTextField
            id="reset-email"
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
          />

          <AuthPrimaryButton>Send reset link</AuthPrimaryButton>
        </form>

        {submitted ? (
          <p className="mt-4 text-center text-sm font-medium text-emerald-700 dark:text-sky-300" role="status">
            Demo only — no email was sent yet. Connect your auth API to enable password reset.
          </p>
        ) : null}

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-zinc-400">
          Remembered your password?{" "}
          <Link href="/login" className="font-bold text-emerald-600 dark:text-sky-400 hover:underline">
            Back to sign in
          </Link>
        </p>
      </AuthCard>

      <BackLink href="/">← Back to home</BackLink>
    </AuthShell>
  );
}
