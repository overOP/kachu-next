import path from "node:path";

export const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

export const PRODUCT_IMAGES_DIR = "products";
export const CATALOG_DIR = "catalog";
export const CATALOG_BASENAME = "kachu-kart-catalog";
export const CATALOG_META_FILENAME = "meta.json";

export const MAX_PRODUCT_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_CATALOG_BYTES = 25 * 1024 * 1024;

export const PRODUCT_IMAGE_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export { CATALOG_MIME } from "./catalog-mime";
