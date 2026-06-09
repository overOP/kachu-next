"use client";

import CatalogUploadSection from "@/components/admin/CatalogUploadSection";

export default function AdminCatalogPanel() {
  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-emerald-950 dark:text-zinc-50">
          Catalog
        </h1>
        <p className="mt-2 text-slate-600 dark:text-zinc-400">
          Manage the single catalog file shown on the public Products page.
        </p>
      </header>

      <CatalogUploadSection />
    </div>
  );
}
