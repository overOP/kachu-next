"use client";

import { useEffect, useId, useRef, useState } from "react";
import { uploadImageFile } from "@/lib/api/upload-file";
import { useAuth } from "@/lib/hooks/use-auth";
import { authInputClassName, authLabelClassName } from "@/components/auth/authFieldClasses";

type ImageFileFieldProps = {
  label?: string;
  imageUrl: string;
  onImageUrlChange: (url: string) => void;
  /** product | category — same storage, used for validation messaging */
  kind?: "product" | "category";
  disabled?: boolean;
};

export default function ImageFileField({
  label = "Product image",
  imageUrl,
  onImageUrlChange,
  kind = "product",
  disabled = false,
}: ImageFileFieldProps) {
  const inputId = useId();
  const urlId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const { token } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const displaySrc = preview || imageUrl || null;

  const onPickFile = async (file: File | null) => {
    setUploadError("");
    if (!file) return;

    if (!token) {
      setUploadError("Sign in again to upload images.");
      return;
    }

    if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const url = await uploadImageFile(file, token, kind);
      onImageUrlChange(url);
      setPreview(null);
    } catch (err) {
      setPreview(null);
      setUploadError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor={inputId} className={authLabelClassName}>
          {label}
        </label>
        <input
          ref={fileRef}
          id={inputId}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          disabled={disabled || uploading}
          onChange={(e) => void onPickFile(e.target.files?.[0] ?? null)}
          className={`mt-1.5 block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-emerald-700 disabled:opacity-60 dark:text-zinc-400 dark:file:bg-sky-600 dark:hover:file:bg-sky-500`}
        />
        <p className="mt-1 text-xs text-slate-500 dark:text-zinc-500">
          Upload a real image (JPEG, PNG, WebP, or GIF, max 5 MB). Stored on this site and sent to the API as a URL.
        </p>
      </div>

      {displaySrc ? (
        <div className="overflow-hidden rounded-xl border border-emerald-100 bg-emerald-50/40 p-2 dark:border-zinc-700 dark:bg-zinc-800/40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displaySrc}
            alt=""
            className="mx-auto max-h-40 w-full object-contain"
          />
        </div>
      ) : null}

      {uploading ? (
        <p className="text-xs font-medium text-emerald-700 dark:text-sky-300">Uploading…</p>
      ) : null}

      {uploadError ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-800 dark:bg-red-950/40 dark:text-red-200">
          {uploadError}
        </p>
      ) : null}

      <div>
        <label htmlFor={urlId} className="text-xs font-semibold text-slate-600 dark:text-zinc-400">
          Or paste image URL
        </label>
        <input
          id={urlId}
          type="url"
          value={imageUrl}
          disabled={disabled || uploading}
          onChange={(e) => onImageUrlChange(e.target.value)}
          placeholder="https://…"
          className={`mt-1 ${authInputClassName}`}
        />
      </div>
    </div>
  );
}
