import { createClient, type SanityClient } from "@sanity/client";
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { apiVersion, dataset, projectId } from "@/sanity/env";

let client: SanityClient | null = null;

/**
 * Lazy singleton — createClient throws if projectId isn't configured yet.
 * Left uncaught here so callers (lib/sanity/queries.ts) can fall back to the
 * local catalog the same way the old backend-fetch layer did.
 */
export function getSanityClient(): SanityClient {
  if (!client) {
    client = createClient({ projectId, dataset, apiVersion, useCdn: true });
  }
  return client;
}

const builder = createImageUrlBuilder({ projectId, dataset });

export function urlForImage(source: SanityImageSource) {
  return builder.image(source).auto("format").fit("max").url();
}
