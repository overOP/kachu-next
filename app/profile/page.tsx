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
import type { User } from "@/lib/types/api";

type ProfileFormProps = {
  source: User;
  role: string | undefined;
  isSaving: boolean;
  onSave: (payload: { name: string; email: string }) => Promise<void>;
};

function ProfileForm({ source, role, isSaving, onSave }: ProfileFormProps) {
  const [name, setName] = useState(source.name);
  const [email, setEmail] = useState(source.email);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await onSave({ name: name.trim(), email: email.trim() });
      setMessage("Profile updated.");
    } catch (err) {
      setError(parseApiError(err, "Could not update profile.").message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-slate-600 dark:text-zinc-400">
        Role: <span className="font-semibold">{roleLabel(role)}</span>
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
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useAuth();
  const userId = user?.id;

  const { data: profile, isLoading } = useGetUserByIdQuery(userId!, { skip: userId == null });
  const [updateUserApi, { isLoading: isSaving }] = useUpdateUserMutation();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login?next=/profile");
    }
  }, [isAuthenticated, router]);

  const formSource = profile ?? user;
  const formKey = profile ? `profile-${profile.id}` : user ? `auth-${user.id}` : "loading";

  async function handleSave(payload: { name: string; email: string }) {
    if (userId == null) return;
    const updated = await updateUserApi({
      id: userId,
      body: payload,
    }).unwrap();
    dispatch(updateUser(updated));
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <SiteShell>
      <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
        <h1 className="mb-6 text-3xl font-black text-emerald-950 dark:text-zinc-50">Your profile</h1>
        <AuthCard>
          {isLoading || !formSource ? (
            <p className="text-sm text-slate-600 dark:text-zinc-400">Loading…</p>
          ) : (
            <ProfileForm
              key={formKey}
              source={formSource}
              role={user?.role}
              isSaving={isSaving}
              onSave={handleSave}
            />
          )}
        </AuthCard>
      </div>
      <Footer />
    </SiteShell>
  );
}
