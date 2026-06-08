import { cache } from "react";
import type { Review } from "@/lib/types/api";
import { fetchReviewsFromApi } from "@/lib/api/server-fetch";

export const fetchReviewsForProduct = cache(async function fetchReviewsForProduct(
  productId: string
): Promise<Review[]> {
  return fetchReviewsFromApi(productId);
});
