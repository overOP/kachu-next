import type { Review } from "@/lib/types/api";

/** Normalize review payloads from the API (nested reviewer, optional fields). */
export function normalizeReview(raw: unknown): Review | null {
  if (raw == null || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const id = r.id;
  const productId = r.productId;
  const rating = r.rating;
  if (id == null || productId == null || typeof rating !== "number") return null;

  const reviewerRaw = r.reviewer ?? r.user;
  let reviewer: Review["reviewer"];
  if (reviewerRaw != null && typeof reviewerRaw === "object") {
    const rev = reviewerRaw as Record<string, unknown>;
    if (typeof rev.name === "string") {
      reviewer = {
        name: rev.name,
        profileImage:
          typeof rev.profileImage === "string"
            ? rev.profileImage
            : typeof rev.img === "string"
              ? rev.img
              : null,
      };
    }
  }

  return {
    id: String(id),
    productId: String(productId),
    userId: r.userId != null ? String(r.userId) : undefined,
    rating,
    comment: typeof r.comment === "string" ? r.comment : null,
    reviewer,
    createdAt: typeof r.createdAt === "string" ? r.createdAt : undefined,
  };
}

export function normalizeReviews(raw: unknown): Review[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(normalizeReview).filter((r): r is Review => r != null);
}
