/** Parse legacy product `rate` strings like "4.5(1k reviews)" to a 1–5 star count. */
export function parseRateValue(rate: string | number | undefined | null): number {
  if (typeof rate === "number" && Number.isFinite(rate)) {
    return Math.min(5, Math.max(1, Math.round(rate)));
  }
  const raw = String(rate ?? "").trim();
  const match = raw.match(/^(\d+(?:\.\d+)?)/);
  if (!match) return 0;
  const n = Number(match[1]);
  if (!Number.isFinite(n)) return 0;
  return Math.min(5, Math.max(0, Math.round(n)));
}

/** Format star count for product API `rate` field. */
export function formatRateForApi(stars: number): string {
  const n = Math.min(5, Math.max(1, Math.round(stars)));
  return String(n);
}
