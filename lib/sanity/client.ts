import { createClient, type SanityClient } from "@sanity/client";
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { apiVersion, dataset, projectId } from "@/sanity/env";

let client: SanityClient | null = null;

/**
 * Lazy singleton — createClient throws if projectId isn't configured yet.
 * Left uncaught here so callers (lib/sanity/queries.ts) can fall back to the
 * local catalog the same way the old backend-fetch layer did.
 *
 * useCdn: false — the CDN caches query responses and does not invalidate
 * immediately on publish, which made Studio edits (especially image swaps)
 * appear not to take effect. Direct API hits are cheap for a catalog this size
 * and the result is cached by Next.js for `revalidate` seconds instead.
 */
export function getSanityClient(): SanityClient {
  if (!client) {
    client = createClient({ projectId, dataset, apiVersion, useCdn: false });
  }
  return client;
}

const builder = createImageUrlBuilder({ projectId, dataset });

/**
 * Build a CDN image URL from an image source. An optional `version` query param
 * is appended so a replaced asset busts the browser/CDN image cache.
 */
export function urlForImage(source: SanityImageSource, version?: string) {
  const url = builder.image(source).auto("format").fit("max").url();
  if (!version) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}v=${encodeURIComponent(version)}`;
}
