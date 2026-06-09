"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiBookOpen, FiGrid, FiHome, FiLayers, FiMessageSquare, FiPackage, FiUsers } from "react-icons/fi";
import { useAuth } from "@/lib/hooks/use-auth";

const nav = [
  { href: "/admin", label: "Dashboard", icon: FiGrid, exact: true },
  { href: "/admin/categories", label: "Categories", icon: FiLayers, exact: false },
  { href: "/admin/products", label: "Products", icon: FiPackage, exact: false },
  { href: "/admin/catalog", label: "Catalog", icon: FiBookOpen, exact: false },
  { href: "/admin/users", label: "Users", icon: FiUsers, exact: false, usersOnly: true },
  { href: "/admin/reviews", label: "Reviews", icon: FiMessageSquare, exact: false },
];

function isActive(pathname: string, href: string, exact: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const { canManageUsers } = useAuth();

  const visibleNav = nav.filter((item) => !item.usersOnly || canManageUsers);

  return (
    <aside className="flex w-full flex-col border-b border-emerald-100 bg-white dark:border-zinc-800 dark:bg-zinc-900 lg:h-screen lg:w-60 lg:shrink-0 lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between gap-3 border-b border-emerald-50 px-4 py-5 dark:border-zinc-800 lg:flex-col lg:items-stretch lg:px-4">
        <Link
          href="/admin"
          className="font-syne text-lg font-bold tracking-tight text-emerald-800 dark:text-sky-400"
        >
          Kachu Admin
        </Link>
        <Link
          href="/"
          className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-900 transition hover:bg-emerald-50 dark:border-zinc-600 dark:text-zinc-100 dark:hover:bg-zinc-800"
        >
          <FiHome className="h-3.5 w-3.5 shrink-0" aria-hidden />
          Storefront
        </Link>
      </div>

      <nav
        className="flex flex-1 flex-col gap-1 overflow-x-auto px-2 py-4 lg:overflow-visible lg:px-2"
        aria-label="Admin"
      >
        <div className="flex gap-1 lg:flex-col">
          {visibleNav.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(pathname, href, exact);
            return (
              <Link
                key={href}
                href={href}
                className={`flex min-h-10 shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition lg:w-full ${
                  active
                    ? "bg-emerald-600 text-white shadow-md dark:bg-sky-600"
                    : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                {label}
              </Link>
            );
          })}
        </div>

        <Link
          href="/"
          className="mt-auto flex min-h-10 shrink-0 items-center gap-3 rounded-xl border border-dashed border-emerald-200 px-3 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50 dark:border-zinc-600 dark:text-sky-300 dark:hover:bg-zinc-800 lg:w-full"
        >
          <FiHome className="h-4 w-4 shrink-0" aria-hidden />
          Back to website
        </Link>
      </nav>
    </aside>
  );
}
