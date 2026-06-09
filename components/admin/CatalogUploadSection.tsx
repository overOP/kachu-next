"use client";

import { useEffect, useId, useRef, useState } from "react";
import { FiDownload, FiUpload } from "react-icons/fi";
import { fetchCatalogInfo, uploadCatalogFile, type CatalogInfo } from "@/lib/api/upload-file";
import { catalogAcceptAttribute } from "@/lib/uploads/catalog-mime";
import { useAuth } from "@/lib/hooks/use-auth";
import { authLabelClassName } from "@/components/auth/authFieldClasses";

type CatalogUploadSectionProps = {
  /** Compact layout for embedding in the products admin page */
  compact?: boolean;
};

export default function CatalogUploadSection({ compact = false }: CatalogUploadSectionProps) {
  const inputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const { token } = useAuth();
  const [catalog, setCatalog] = useState<CatalogInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadCatalog = async () => {
    setLoading(true);
    try {
      setCatalog(await fetchCatalogInfo());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCatalog();
  }, []);

  const onUpload = async (file: File | null) => {
    setError("");
    setSuccess("");
    if (!file) return;

    if (!token) {
      setError("Sign in again to upload the catalog.");
      return;
    }

    setUploading(true);
    try {
      await uploadCatalogFile(file, token);
      setSuccess("Catalog saved. It appears on the Products page for all customers.");
      await loadCatalog();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not upload catalog.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <section
      className={`rounded-2xl border border-emerald-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80 ${
        compact ? "p-5" : "p-6"
      }`}
    >
      <div className={compact ? "mb-4" : "mb-6"}>
        <h2 className={`font-black text-emerald-950 dark:text-zinc-50 ${compact ? "text-lg" : "text-xl"}`}>
          Store catalog
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">
          One catalog for the whole product section — upload a PDF or image. Replacing it updates the download on{" "}
          <span className="font-semibold">/products</span> for everyone.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-slate-600 dark:text-zinc-400">Checking catalog…</p>
      ) : catalog ? (
        <div className="mb-4 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
          <p className="text-sm font-semibold text-emerald-900 dark:text-zinc-100">Live on product section</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">{catalog.fileName}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-zinc-500">
            Updated {new Date(catalog.updatedAt).toLocaleString()}
          </p>
          <a
            href={catalog.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:underline dark:text-sky-300"
          >
            <FiDownload aria-hidden />
            Preview catalog
          </a>
        </div>
      ) : (
        <p className="mb-4 text-sm text-amber-800 dark:text-amber-200">
          No catalog yet — upload below and it will show on the public Products page.
        </p>
      )}

      <div>
        <label htmlFor={inputId} className={authLabelClassName}>
          {catalog ? "Replace catalog file" : "Upload catalog file"}
        </label>
        <input
          ref={fileRef}
          id={inputId}
          type="file"
          accept={catalogAcceptAttribute()}
          disabled={uploading}
          onChange={(e) => void onUpload(e.target.files?.[0] ?? null)}
          className="mt-1.5 block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-emerald-700 disabled:opacity-60 dark:text-zinc-400 dark:file:bg-sky-600"
        />
        <p className="mt-1 text-xs text-slate-500 dark:text-zinc-500">PDF, JPEG, PNG, or WebP — max 25 MB.</p>
      </div>

      {uploading ? (
        <p className="mt-3 text-sm font-medium text-emerald-700 dark:text-sky-300">
          <FiUpload className="mr-1 inline" aria-hidden />
          Uploading…
        </p>
      ) : null}

      {error ? (
        <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </p>
      ) : null}

      {success ? (
        <p className="mt-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200">
          {success}
        </p>
      ) : null}
    </section>
  );
}
