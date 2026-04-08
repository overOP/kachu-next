"use client";

import { Boxes, Factory, LayoutDashboard, LogOut, Package } from "lucide-react";
import Image from "next/image";

export default function Sidebar() {
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
            <li className="flex items-center gap-3 text-sm font-medium hover:text-slate-200 transition-colors">
              <LayoutDashboard />
              Dashboard
            </li>
            <li className="flex items-center gap-3 text-sm font-medium hover:text-slate-200 transition-colors">
              <Package />
              Products
            </li>
            <li className="flex items-center gap-3 text-sm font-medium hover:text-slate-200 transition-colors">
              <Factory />
              Factory
            </li>
            <li className="flex items-center gap-3 text-sm font-medium hover:text-slate-200 transition-colors">
              <Boxes />
              Category
            </li>
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
