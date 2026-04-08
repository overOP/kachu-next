"use client";

import Sidebar from "./components/Sidebar";
import Dashboard from "./dashboard/page";

export default function Home() {
  return (
    <>
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />
        <main className="flex-1 p-6 md:p-10">
          <Dashboard />
        </main>
      </div>
    </>
  );
}
