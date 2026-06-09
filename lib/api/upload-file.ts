import { API_ORIGIN } from "@/lib/api/config";

type UploadKind = "product" | "category";

type UploadResponse = { url: string };

function parseUploadResponse(json: unknown): string {
  if (!json || typeof json !== "object") {
    throw new Error("Invalid upload response.");
  }
  const url = (json as UploadResponse).url;
  if (typeof url !== "string" || !url.trim()) {
    throw new Error("Upload did not return a URL.");
  }
  return url.trim();
}

async function parseUploadError(res: Response): Promise<string> {
  try {
    const json = (await res.json()) as { message?: string };
    if (typeof json.message === "string" && json.message.trim()) {
      return json.message.trim();
    }
  } catch {
    // ignore
  }
  return `Upload failed (${res.status}).`;
}

/** Upload a product/category image via the Next.js upload route (returns a public URL for the backend). */
export async function uploadImageFile(
  file: File,
  token: string,
  kind: UploadKind = "product"
): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  form.append("kind", kind);

  const res = await fetch("/api/upload", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });

  if (!res.ok) {
    throw new Error(await parseUploadError(res));
  }

  return parseUploadResponse(await res.json());
}

/** Upload or replace the single site-wide catalog PDF. */
export async function uploadCatalogFile(file: File, token: string): Promise<UploadResponse> {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch("/api/catalog", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });

  if (!res.ok) {
    throw new Error(await parseUploadError(res));
  }

  const json = (await res.json()) as UploadResponse & { updatedAt?: string; fileName?: string };
  return {
    url: parseUploadResponse(json),
  };
}

export type CatalogInfo = {
  url: string;
  fileName: string;
  updatedAt: string;
  mimeType?: string;
};

export async function fetchCatalogInfo(): Promise<CatalogInfo | null> {
  const res = await fetch("/api/catalog", { cache: "no-store" });
  if (!res.ok) return null;
  const json = (await res.json()) as { catalog?: CatalogInfo | null };
  return json.catalog ?? null;
}

/** Resolve image src for display — supports absolute URLs and same-origin upload paths. */
export function resolveImageSrc(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  if (trimmed.startsWith("/")) {
    const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "";
    return site ? `${site}${trimmed}` : trimmed;
  }
  return trimmed;
}

/** Hostname from API origin — allow product images served by the backend when applicable. */
export function apiImageHostname(): string | null {
  try {
    return new URL(API_ORIGIN).hostname;
  } catch {
    return null;
  }
}
