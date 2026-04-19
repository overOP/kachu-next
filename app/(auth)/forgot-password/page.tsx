"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import AuthCard from "@/components/auth/AuthCard";
import AuthPageHeader from "@/components/auth/AuthPageHeader";
import AuthTextField from "@/components/auth/AuthTextField";
import AuthPrimaryButton from "@/components/auth/AuthPrimaryButton";
import BackLink from "@/components/ui/BackLink";
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyCodeMutation,
} from "@/lib/api/auth/user-auth-api";

type Step = "email" | "otp" | "newPassword";

function getErrorMessage(err: unknown, fallback: string): string {
  if (typeof err === "object" && err !== null && "data" in err) {
    const data = (err as { data?: { message?: unknown } }).data;
    if (data && typeof data.message === "string") return data.message;
  }
  return fallback;
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [forgotPassword, { isLoading: sendingEmail }] = useForgotPasswordMutation();
  const [verifyCode, { isLoading: verifying }] = useVerifyCodeMutation();
  const [resetPassword, { isLoading: resetting }] = useResetPasswordMutation();

  async function onSubmitEmail(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await forgotPassword({ email: email.trim() }).unwrap();
      setMessage("If an account exists for this email, you will receive a code shortly.");
      setStep("otp");
    } catch (err) {
      setError(getErrorMessage(err, "Could not send reset instructions. Try again."));
    }
  }

  async function onSubmitOtp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");
    const trimmed = code.trim();
    if (!/^\d+$/.test(trimmed)) {
      setError("Enter the verification code as digits only.");
      return;
    }
    try {
      const { resetToken: token } = await verifyCode({
        email: email.trim(),
        otp: trimmed,
      }).unwrap();
      if (!token) {
        setError("Invalid response from server. Try again or request a new code.");
        return;
      }
      setResetToken(token);
      setMessage("Code verified. Choose a new password.");
      setStep("newPassword");
    } catch (err) {
      setError(getErrorMessage(err, "Invalid or expired code. Try again."));
    }
  }

  async function onSubmitNewPassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (!resetToken.trim()) {
      setError("Your reset session expired. Go back and verify your code again.");
      return;
    }
    try {
      await resetPassword({ resetToken: resetToken.trim(), password }).unwrap();
      setMessage("Password updated. Redirecting to sign in…");
      setTimeout(() => router.push("/login"), 1200);
    } catch (err) {
      setError(getErrorMessage(err, "Could not reset password. Try again."));
    }
  }

  return (
    <AuthShell>
      <AuthPageHeader
        eyebrow="Account recovery"
        title="Forgot your password?"
        subtitle={
          step === "email"
            ? "Enter your email and we will send a verification code."
            : step === "otp"
              ? "Enter the code from your email."
              : "Set a new password for your account."
        }
      />

      <AuthCard>
        {step === "email" ? (
          <form onSubmit={onSubmitEmail} className="space-y-5">
            <AuthTextField
              id="reset-email"
              name="email"
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              required
            />
            <AuthPrimaryButton disabled={sendingEmail}>
              {sendingEmail ? "Sending…" : "Send code"}
            </AuthPrimaryButton>
          </form>
        ) : null}

        {step === "otp" ? (
          <form onSubmit={onSubmitOtp} className="space-y-5">
            <AuthTextField
              id="reset-email-readonly"
              name="email"
              label="Email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              required
            />
            <AuthTextField
              id="reset-code"
              name="code"
              label="Verification code"
              type="text"
              autoComplete="one-time-code"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(ev) => setCode(ev.target.value)}
              required
            />
            <AuthPrimaryButton disabled={verifying}>
              {verifying ? "Verifying…" : "Verify code"}
            </AuthPrimaryButton>
            <button
              type="button"
              onClick={() => {
                setStep("email");
                setCode("");
                setError("");
                setMessage("");
              }}
              className="w-full text-sm font-semibold text-slate-600 underline-offset-2 hover:underline dark:text-zinc-400"
            >
              Use a different email
            </button>
          </form>
        ) : null}

        {step === "newPassword" ? (
          <form onSubmit={onSubmitNewPassword} className="space-y-5">
            <AuthTextField
              id="new-password"
              name="password"
              label="New password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              required
            />
            <AuthTextField
              id="confirm-new-password"
              name="confirmPassword"
              label="Confirm new password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(ev) => setConfirmPassword(ev.target.value)}
              required
            />
            <AuthPrimaryButton disabled={resetting}>
              {resetting ? "Updating…" : "Update password"}
            </AuthPrimaryButton>
          </form>
        ) : null}

        {error ? (
          <p className="mt-4 text-center text-sm font-medium text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        ) : null}
        {message ? (
          <p className="mt-4 text-center text-sm font-medium text-emerald-700 dark:text-sky-300" role="status">
            {message}
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
