"use client";

import { useEffect, useId, useRef, useState } from "react";
import { FiDownload, FiUpload } from "react-icons/fi";
import { fetchCatalogInfo, uploadCatalogFile, type CatalogInfo } from "@/lib/api/upload-file";
import { catalogAcceptAttribute } from "@/lib/uploads/catalog-mime";
import { useAuth } from "@/lib/hooks/use-auth";
import { authLabelClassName } from "@/components/auth/authFieldClasses";

type CatalogUploadFieldProps = {
  disabled?: boolean;
};

export default function CatalogUploadField({ disabled = false }: CatalogUploadFieldProps) {
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
      setSuccess("Catalog saved — customers can download it on /products.");
      await loadCatalog();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not upload catalog.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const busy = disabled || uploading;

  return (
    <div className="rounded-xl border border-dashed border-emerald-200 bg-emerald-50/30 p-4 dark:border-zinc-600 dark:bg-zinc-800/30">
      <p className="text-sm font-semibold text-emerald-900 dark:text-zinc-100">Store catalog (optional)</p>
      <p className="mt-0.5 text-xs text-slate-600 dark:text-zinc-400">
        Upload or replace the wholesale catalog PDF/image shown on the public Products page.
      </p>

      {loading ? (
        <p className="mt-3 text-xs text-slate-500">Checking catalog…</p>
      ) : catalog ? (
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 dark:text-zinc-400">
          <span className="font-medium text-emerald-800 dark:text-emerald-300">{catalog.fileName}</span>
          <a
            href={catalog.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:underline dark:text-sky-300"
          >
            <FiDownload className="h-3 w-3" aria-hidden />
            Preview
          </a>
        </div>
      ) : (
        <p className="mt-3 text-xs text-amber-800 dark:text-amber-200">No catalog uploaded yet.</p>
      )}

      <div className="mt-3">
        <label htmlFor={inputId} className={authLabelClassName}>
          {catalog ? "Replace catalog file" : "Upload catalog file"}
        </label>
        <input
          ref={fileRef}
          id={inputId}
          type="file"
          accept={catalogAcceptAttribute()}
          disabled={busy}
          onChange={(e) => void onUpload(e.target.files?.[0] ?? null)}
          className="mt-1.5 block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-emerald-700 disabled:opacity-60 dark:text-zinc-400 dark:file:bg-sky-600"
        />
        <p className="mt-1 text-xs text-slate-500 dark:text-zinc-500">PDF, JPEG, PNG, or WebP — max 25 MB.</p>
      </div>

      {uploading ? (
        <p className="mt-2 text-xs font-medium text-emerald-700 dark:text-sky-300">
          <FiUpload className="mr-1 inline" aria-hidden />
          Uploading…
        </p>
      ) : null}
      {error ? (
        <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-800 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200">
          {success}
        </p>
      ) : null}
    </div>
  );
}
