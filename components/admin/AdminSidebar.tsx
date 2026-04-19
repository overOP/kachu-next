"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiGrid, FiHome, FiLayers, FiPackage } from "react-icons/fi";

const nav = [
  { href: "/admin", label: "Dashboard", icon: FiGrid, exact: true },
  { href: "/admin/products", label: "Products", icon: FiPackage, exact: false },
  { href: "/admin/categories", label: "Categories", icon: FiLayers, exact: false },
];

function isActive(pathname: string, href: string, exact: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full flex-col border-b border-emerald-100 bg-white dark:border-zinc-800 dark:bg-zinc-900 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between gap-3 px-5 py-5 lg:flex-col lg:items-stretch lg:px-4">
        <Link
          href="/admin"
          className="font-syne font-bold tracking-tight text-emerald-800 dark:text-sky-400"
        >
          Kachu Admin
        </Link>
        <Link
          href="/"
          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-900 transition hover:bg-emerald-50 dark:border-zinc-600 dark:text-zinc-100 dark:hover:bg-zinc-800"
        >
          <FiHome className="h-4 w-4 shrink-0" aria-hidden />
          View site
        </Link>
      </div>

      <nav className="flex gap-1 overflow-x-auto px-3 pb-4 lg:flex-col lg:px-2 lg:pb-6" aria-label="Admin">
        {nav.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(pathname, href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={`flex min-h-11 shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition lg:w-full ${
                active
                  ? "bg-emerald-600 text-white shadow-md dark:bg-sky-600"
                  : "text-slate-700 hover:bg-emerald-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
