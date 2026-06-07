"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import SiteShell from "@/components/layout/SiteShell";
import Footer from "@/components/Footer";
import AuthCard from "@/components/auth/AuthCard";
import AuthTextField from "@/components/auth/AuthTextField";
import AuthPrimaryButton from "@/components/auth/AuthPrimaryButton";
import { useGetUserByIdQuery, useUpdateUserMutation } from "@/lib/api/auth/admin-auth-api";
import { parseApiError } from "@/lib/api/errors";
import { useAuth } from "@/lib/hooks/use-auth";
import { updateUser } from "@/lib/store/auth-slice";
import { roleLabel } from "@/lib/auth/rbac";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useAuth();
  const userId = user?.id;

  const { data: profile, isLoading } = useGetUserByIdQuery(userId!, { skip: userId == null });
  const [updateUserApi, { isLoading: isSaving }] = useUpdateUserMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login?next=/profile");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const source = profile ?? user;
    if (source) {
      setName(source.name);
      setEmail(source.email);
    }
  }, [profile, user]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (userId == null) return;
    setError("");
    setMessage("");
    try {
      const updated = await updateUserApi({
        id: userId,
        body: { name: name.trim(), email: email.trim() },
      }).unwrap();
      dispatch(updateUser(updated));
      setMessage("Profile updated.");
    } catch (err) {
      setError(parseApiError(err, "Could not update profile.").message);
    }
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <SiteShell>
      <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
        <h1 className="mb-6 text-3xl font-black text-emerald-950 dark:text-zinc-50">Your profile</h1>
        <AuthCard>
          {isLoading ? (
            <p className="text-sm text-slate-600 dark:text-zinc-400">Loading…</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-zinc-400">
                Role: <span className="font-semibold">{roleLabel(user?.role)}</span>
              </p>
              <AuthTextField
                id="profile-name"
                name="name"
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <AuthTextField
                id="profile-email"
                name="email"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {error ? (
                <p className="text-sm font-medium text-red-600 dark:text-red-400" role="alert">
                  {error}
                </p>
              ) : null}
              {message ? (
                <p className="text-sm font-medium text-emerald-700 dark:text-sky-300" role="status">
                  {message}
                </p>
              ) : null}
              <AuthPrimaryButton type="submit" disabled={isSaving}>
                {isSaving ? "Saving…" : "Save changes"}
              </AuthPrimaryButton>
            </form>
          )}
        </AuthCard>
      </div>
      <Footer />
    </SiteShell>
  );
}
