"use client";

import { Boxes, LayoutDashboard, LogOut, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Package },

    { href: "/admin/category", label: "Category", icon: Boxes },
  ];

  return (
    <>
      <div className="w-72 min-h-screen bg-[#002018] text-white flex flex-col justify-between">
        {/**logo */}
        <div className="p-6">
          <Image
            src="/kachu.png"
            alt="Kachu logo"
            width={150}
            height={150}
            className="h-auto w-28"
            priority
          />
        </div>

        <div className="px-7 mt-40 flex flex-col gap-6">
          <ul className="flex flex-col gap-4 text-white">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-white hover:text-slate-200"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        {/**logout */}
        <div className="mt-auto mb-20 px-5 pb-8">
          <button className="flex items-center gap-4 w-full px-4 py-3 text-gray-400 hover:text-white transition-colors text-sm font-medium">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
