"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import type { User, UserGender } from "@/lib/types/api";
import { useUpdateUserMutation } from "@/lib/api/auth/admin-auth-api";
import { parseApiError } from "@/lib/api/errors";
import { isSuperadmin } from "@/lib/auth/rbac";
import { useAuth } from "@/lib/hooks/use-auth";
import { authInputClassName, authLabelClassName } from "@/components/auth/authFieldClasses";
import ImageFileField from "@/components/admin/ImageFileField";
import RoleBadge from "@/components/admin/RoleBadge";

type EditUserModalProps = {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSuccess: () => void;
};

type EditUserFormProps = {
  user: User;
  titleId: string;
  onClose: () => void;
  onSuccess: () => void;
};

function userFormDefaults(user: User) {
  return {
    name: user.name,
    email: user.email,
    phone: user.phone ?? user.number ?? "",
    address: user.address ?? "",
    dateOfBirth: user.dateOfBirth?.slice(0, 10) ?? "",
    gender: (user.gender as UserGender) ?? ("" as const),
    profileImage: user.profileImage ?? user.img ?? "",
    role: user.role,
  };
}

function EditUserForm({ user, titleId, onClose, onSuccess }: EditUserFormProps) {
  const { user: actor } = useAuth();
  const defaults = userFormDefaults(user);
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const [error, setError] = useState("");
  const [name, setName] = useState(defaults.name);
  const [email, setEmail] = useState(defaults.email);
  const [phone, setPhone] = useState(defaults.phone);
  const [address, setAddress] = useState(defaults.address);
  const [dateOfBirth, setDateOfBirth] = useState(defaults.dateOfBirth);
  const [gender, setGender] = useState<UserGender | "">(defaults.gender);
  const [profileImage, setProfileImage] = useState(defaults.profileImage);
  const [role, setRole] = useState(defaults.role);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await updateUser({
        id: user.id,
        body: {
          name: name.trim(),
          email: email.trim(),
          ...(phone.trim() ? { phone: phone.trim() } : {}),
          ...(address.trim() ? { address: address.trim() } : {}),
          ...(dateOfBirth ? { dateOfBirth } : {}),
          ...(gender ? { gender } : {}),
          ...(profileImage.trim() ? { profileImage: profileImage.trim() } : {}),
          ...(isSuperadmin(actor) && role ? { role } : {}),
        },
      }).unwrap();
      onSuccess();
    } catch (err) {
      setError(parseApiError(err, "Could not update user.").message);
    }
  };

  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <h2 id={titleId} className="text-xl font-black text-emerald-950 dark:text-zinc-50">
          Edit user
        </h2>
        <RoleBadge role={user.role} />
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="edit-user-name" className={authLabelClassName}>
            Name
          </label>
          <input
            id="edit-user-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={`mt-1.5 ${authInputClassName}`}
          />
        </div>
        <div>
          <label htmlFor="edit-user-email" className={authLabelClassName}>
            Email
          </label>
          <input
            id="edit-user-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={`mt-1.5 ${authInputClassName}`}
          />
        </div>
        <div>
          <label htmlFor="edit-user-phone" className={authLabelClassName}>
            Phone
          </label>
          <input
            id="edit-user-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={`mt-1.5 ${authInputClassName}`}
          />
        </div>
        <div>
          <label htmlFor="edit-user-address" className={authLabelClassName}>
            Address
          </label>
          <input
            id="edit-user-address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className={`mt-1.5 ${authInputClassName}`}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="edit-user-dob" className={authLabelClassName}>
              Date of birth
            </label>
            <input
              id="edit-user-dob"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className={`mt-1.5 ${authInputClassName}`}
            />
          </div>
          <div>
            <label htmlFor="edit-user-gender" className={authLabelClassName}>
              Gender
            </label>
            <select
              id="edit-user-gender"
              value={gender}
              onChange={(e) => setGender(e.target.value as UserGender | "")}
              className={`mt-1.5 ${authInputClassName}`}
            >
              <option value="">—</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <ImageFileField
          label="Profile image"
          imageUrl={profileImage}
          onImageUrlChange={setProfileImage}
          disabled={isLoading}
        />
        {isSuperadmin(actor) ? (
          <div>
            <label htmlFor="edit-user-role" className={authLabelClassName}>
              Role
            </label>
            <select
              id="edit-user-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={`mt-1.5 ${authInputClassName}`}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="superadmin">Superadmin</option>
            </select>
          </div>
        ) : null}

        {error ? (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200">
            {error}
          </p>
        ) : null}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => !isLoading && onClose()}
            className="rounded-xl border px-5 py-2.5 text-sm font-semibold dark:border-zinc-600"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60 dark:bg-sky-600"
          >
            {isLoading ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </>
  );
}

export default function EditUserModal({ open, user, onClose, onSuccess }: EditUserModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (typeof document === "undefined" || !open || !user) return null;

  const overlay = (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center" role="presentation">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-[101] max-h-[min(90vh,720px)] w-full max-w-lg overflow-y-auto rounded-2xl border border-emerald-100 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <EditUserForm
          key={user.id}
          user={user}
          titleId={titleId}
          onClose={onClose}
          onSuccess={onSuccess}
        />
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
}
