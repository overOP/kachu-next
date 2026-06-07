"use client";

import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
} from "@/lib/api/auth/admin-auth-api";
import { canDeleteUser, roleLabel } from "@/lib/auth/rbac";
import { parseApiError } from "@/lib/api/errors";
import { useAuth } from "@/lib/hooks/use-auth";

export default function AdminUsersPanel() {
  const { user: actor } = useAuth();
  const { data: users = [], isLoading, isError } = useGetAllUsersQuery();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [error, setError] = useState("");

  const handleDelete = async (id: number | string) => {
    if (!canDeleteUser(actor, id)) return;
    if (!window.confirm("Delete this user? Only superadmins can do this.")) return;
    setError("");
    try {
      await deleteUser(id).unwrap();
    } catch (err) {
      setError(parseApiError(err, "Could not delete user.").message);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-emerald-950 dark:text-zinc-50">
          Users
        </h1>
        <p className="mt-2 text-slate-600 dark:text-zinc-400">
          Admin and superadmin access. Delete is superadmin-only.
        </p>
      </header>

      {isError ? (
        <p className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          Could not load users. You may need admin privileges.
        </p>
      ) : null}

      {error ? (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </p>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="border-b border-emerald-100 bg-emerald-50/80 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-sky-400">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-50 dark:divide-zinc-800">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                  Loading users…
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={String(u.id)} className="text-slate-700 dark:text-zinc-300">
                  <td className="px-4 py-3 font-semibold text-emerald-950 dark:text-zinc-100">
                    {u.name}
                  </td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-emerald-100/80 px-2 py-0.5 text-xs font-medium dark:bg-zinc-800 dark:text-sky-300">
                      {roleLabel(u.role)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {canDeleteUser(actor, u.id) ? (
                      <button
                        type="button"
                        onClick={() => handleDelete(u.id)}
                        disabled={isDeleting}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-red-600 dark:text-red-400"
                      >
                        <FiTrash2 className="h-4 w-4" aria-hidden />
                        Delete
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
