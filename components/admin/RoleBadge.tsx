import { roleLabel, normalizeRole } from "@/lib/auth/rbac";
import type { UserRole } from "@/lib/types/api";

const roleClass: Record<string, string> = {
  superadmin: "bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-300",
  admin: "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300",
  user: "bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400",
};

export default function RoleBadge({ role }: { role?: UserRole | string | null }) {
  const key = normalizeRole(role);
  const cls = roleClass[key] ?? roleClass.user;
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
      {roleLabel(role ?? undefined)}
    </span>
  );
}
