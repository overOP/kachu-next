"use client";

import { useEffect, useState } from "react";
import { FiDownload, FiFileText } from "react-icons/fi";
import { fetchCatalogInfo, type CatalogInfo } from "@/lib/api/upload-file";

export default function CatalogDownloadBanner() {
  const [catalog, setCatalog] = useState<CatalogInfo | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    void fetchCatalogInfo().then((info) => {
      setCatalog(info);
      setLoaded(true);
    });
  }, []);

  if (!loaded || !catalog) return null;

  const isPdf = catalog.mimeType === "application/pdf" || catalog.fileName.toLowerCase().endsWith(".pdf");

  return (
    <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50/90 to-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-900/80">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white dark:bg-sky-600">
          <FiFileText className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-emerald-700 dark:text-sky-400">
            Wholesale catalog
          </p>
          <p className="mt-0.5 font-semibold text-emerald-950 dark:text-zinc-100">{catalog.fileName}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-zinc-500">
            {isPdf ? "Download the full product catalog (PDF)." : "View our full product catalog."}
          </p>
        </div>
      </div>
      <a
        href={catalog.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 dark:bg-sky-600 dark:hover:bg-sky-500"
      >
        <FiDownload className="h-4 w-4" aria-hidden />
        {isPdf ? "Download catalog" : "Open catalog"}
      </a>
    </div>
  );
}
