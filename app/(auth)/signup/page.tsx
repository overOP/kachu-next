"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import AuthCard from "@/components/auth/AuthCard";
import AuthPageHeader from "@/components/auth/AuthPageHeader";
import AuthTextField from "@/components/auth/AuthTextField";
import AuthPrimaryButton from "@/components/auth/AuthPrimaryButton";
import BackLink from "@/components/ui/BackLink";
import { useRegisterMutation } from "@/lib/api/auth/user-auth-api";
import { parseApiError } from "@/lib/api/errors";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [register, { isLoading }] = useRegisterMutation();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
      }).unwrap();
      setMessage("Account created successfully. Redirecting to sign in...");
      setTimeout(() => {
        router.push("/login");
      }, 900);
    } catch (err: unknown) {
      setError(parseApiError(err, "Could not create account. Please try again.").message);
    }
  }

  return (
    <AuthShell>
      <AuthPageHeader
        eyebrow="Join Kachu Kart"
        title="Create your account"
        subtitle="Register with your name, email, and password."
      />

      <AuthCard>
        <form onSubmit={handleSubmit} className="space-y-5">
          <AuthTextField
            id="name"
            name="name"
            label="Full name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <AuthTextField
            id="email"
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <AuthTextField
            id="password"
            name="password"
            label="Password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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

          <AuthPrimaryButton disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create account"}
          </AuthPrimaryButton>
        </form>

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
