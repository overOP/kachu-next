import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import {
  CATALOG_DIR,
  CATALOG_BASENAME,
  CATALOG_META_FILENAME,
  PRODUCT_IMAGES_DIR,
  UPLOADS_DIR,
} from "./config";

export type CatalogMeta = {
  fileName: string;
  url: string;
  updatedAt: string;
  mimeType?: string;
};

function extFromMime(mime: string): string {
  switch (mime) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/gif":
      return ".gif";
    case "application/pdf":
      return ".pdf";
    default:
      return "";
  }
}

/** Site-relative URL for files in /public (works with next/image and any deployment host). */
export function toPublicUploadUrl(relativePath: string): string {
  const normalized = relativePath.replace(/^\/+/, "");
  return `/${normalized}`;
}

async function ensureDir(dir: string) {
  await mkdir(dir, { recursive: true });
}

export async function saveProductImage(
  bytes: Buffer,
  mime: string
): Promise<{ relativePath: string; url: string }> {
  const ext = extFromMime(mime);
  if (!ext) throw new Error("Unsupported image type.");

  const dir = path.join(UPLOADS_DIR, PRODUCT_IMAGES_DIR);
  await ensureDir(dir);

  const fileName = `${randomUUID()}${ext}`;
  const absolute = path.join(dir, fileName);
  await writeFile(absolute, bytes);

  const relativePath = path.posix.join("uploads", PRODUCT_IMAGES_DIR, fileName);
  return { relativePath, url: toPublicUploadUrl(relativePath) };
}

export async function saveCatalogFile(
  bytes: Buffer,
  originalName: string,
  mime: string
): Promise<CatalogMeta> {
  const dir = path.join(UPLOADS_DIR, CATALOG_DIR);
  await ensureDir(dir);

  const ext = extFromMime(mime);
  if (!ext) throw new Error("Unsupported catalog file type.");

  const storedName = `${CATALOG_BASENAME}${ext}`;
  const absolute = path.join(dir, storedName);
  await writeFile(absolute, bytes);

  const meta: CatalogMeta = {
    fileName: originalName || storedName,
    url: toPublicUploadUrl(path.posix.join("uploads", CATALOG_DIR, storedName)),
    updatedAt: new Date().toISOString(),
    mimeType: mime,
  };

  await writeFile(
    path.join(dir, CATALOG_META_FILENAME),
    JSON.stringify(meta, null, 2),
    "utf8"
  );

  return meta;
}

export async function readCatalogMeta(): Promise<CatalogMeta | null> {
  try {
    const raw = await readFile(
      path.join(UPLOADS_DIR, CATALOG_DIR, CATALOG_META_FILENAME),
      "utf8"
    );
    const parsed = JSON.parse(raw) as CatalogMeta;
    if (!parsed?.url) return null;
    return parsed;
  } catch {
    return null;
  }
}
