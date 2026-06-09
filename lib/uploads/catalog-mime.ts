/** Client-safe catalog MIME list (keep in sync with lib/uploads/config.ts). */
export const CATALOG_MIME = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const EXT_TO_MIME: Record<string, string> = {
  ".pdf": "application/pdf",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

/** Browsers often omit `file.type` — infer from extension when needed. */
export function resolveCatalogMime(file: File): string | null {
  const type = file.type.trim().toLowerCase();
  if (type && CATALOG_MIME.has(type)) return type;

  const ext = file.name.includes(".")
    ? file.name.slice(file.name.lastIndexOf(".")).toLowerCase()
    : "";
  const inferred = EXT_TO_MIME[ext];
  return inferred && CATALOG_MIME.has(inferred) ? inferred : null;
}

export function catalogAcceptAttribute(): string {
  return ".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp";
}
