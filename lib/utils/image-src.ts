/** Use a same-origin relative path for files in /public/uploads (avoids next/image private-IP fetch). */
export function resolveImageSrc(src: string): string {
  const trimmed = src.trim();
  if (!trimmed) return trimmed;
  if (trimmed.startsWith("/uploads/")) return trimmed;

  try {
    const parsed = new URL(trimmed);
    if (parsed.pathname.startsWith("/uploads/")) {
      return `${parsed.pathname}${parsed.search}`;
    }
  } catch {
    // Not an absolute URL — return as-is (remote CDN, placeholder, etc.).
  }

  return trimmed;
}
