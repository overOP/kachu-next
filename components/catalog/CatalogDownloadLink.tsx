"use client";

import { useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";
import { fetchCatalogInfo, type CatalogInfo } from "@/lib/api/upload-file";

type CatalogDownloadLinkProps = {
  className?: string;
  variant?: "footer" | "toolbar";
};

const variantClass: Record<NonNullable<CatalogDownloadLinkProps["variant"]>, string> = {
  footer:
    "inline-flex min-h-10 items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-2 text-sm font-medium text-white/90 transition-all hover:border-emerald-400/40 hover:text-emerald-300 dark:hover:border-sky-400/40 dark:hover:text-sky-200 lg:border-0 lg:bg-transparent lg:px-0 lg:py-1 lg:hover:translate-x-1",
  toolbar:
    "inline-flex min-h-10 items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800",
};

export default function CatalogDownloadLink({
  className = "",
  variant = "footer",
}: CatalogDownloadLinkProps) {
  const [catalog, setCatalog] = useState<CatalogInfo | null>(null);

  useEffect(() => {
    void fetchCatalogInfo().then(setCatalog);
  }, []);

  if (!catalog) return null;

  return (
    <a
      href={catalog.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${variantClass[variant]} ${className}`}
    >
      <FiDownload className="h-3.5 w-3.5 shrink-0" aria-hidden />
      Download catalog
    </a>
  );
}
