"use server";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import type { Product } from "@/lib/data/products";
import { addProduct } from "@/lib/services/product-catalog";
import { fetchProductCategories } from "@/lib/services/products";

const MAX = {
  name: 160,
  brand: 80,
  price: 40,
  quantity: 80,
  rate: 40,
  url: 2048,
  description: 2000,
  imageBytes: 5 * 1024 * 1024,
} as const;

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

function isHttpsUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "https:";
  } catch {
    return false;
  }
}

function trim(formData: FormData, key: string): string {
  return (formData.get(key) as string | null)?.trim() ?? "";
}

function imageExtension(mimeType: string): string {
  const map: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/avif": ".avif",
  };
  return map[mimeType] ?? ".bin";
}

async function persistUploadedImage(file: File): Promise<string> {
  const uploadsDir = path.join(process.cwd(), "public", "uploads", "products");
  await mkdir(uploadsDir, { recursive: true });

  const extension = imageExtension(file.type);
  const filename = `${Date.now()}-${randomUUID()}${extension}`;
  const filePath = path.join(uploadsDir, filename);

  const arrayBuffer = await file.arrayBuffer();
  if (!(arrayBuffer instanceof ArrayBuffer)) {
    throw new TypeError("Invalid file buffer");
  }
  await writeFile(filePath, Buffer.from(new Uint8Array(arrayBuffer)));

  return `/uploads/products/${filename}`;
}

export type CreateProductResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Partial<Record<string, string>> };

export async function createProductAction(formData: FormData): Promise<CreateProductResult> {
  const name = trim(formData, "name");
  const brand = trim(formData, "brand");
  const categorySlug = trim(formData, "categorySlug");
  const price = trim(formData, "price");
  const quantity = trim(formData, "quantity");
  const rate = trim(formData, "rate");
  const imageFile = formData.get("imageFile");
  const logo = trim(formData, "logo");
  const Description = trim(formData, "Description");

  const fieldErrors: Partial<Record<string, string>> = {};

  if (name.length < 2 || name.length > MAX.name) {
    fieldErrors.name = "Name must be 2–160 characters.";
  }
  if (brand.length < 1 || brand.length > MAX.brand) {
    fieldErrors.brand = "Brand is required (max 80 characters).";
  }
  if (price.length < 1 || price.length > MAX.price) {
    fieldErrors.price = "Price is required.";
  }
  if (quantity.length < 1 || quantity.length > MAX.quantity) {
    fieldErrors.quantity = "MOQ / quantity line is required.";
  }
  if (rate.length < 1 || rate.length > MAX.rate) {
    fieldErrors.rate = "Rating text is required (e.g. 4.5(1k reviews))";
  }
  if (Description.length < 4 || Description.length > MAX.description) {
    fieldErrors.Description = "Description must be 4–2000 characters.";
  }

  if (!(imageFile instanceof File) || imageFile.size === 0) {
    fieldErrors.imageFile = "Product image is required.";
  } else {
    if (!ALLOWED_IMAGE_TYPES.has(imageFile.type)) {
      fieldErrors.imageFile = "Allowed formats: JPG, PNG, WEBP, GIF, AVIF.";
    } else if (imageFile.size > MAX.imageBytes) {
      fieldErrors.imageFile = "Image must be 5MB or less.";
    }
  }

  if (!isHttpsUrl(logo)) {
    fieldErrors.logo = "Logo must be a valid https:// URL.";
  }

  const categories = await fetchProductCategories();
  const allowed = new Set(categories.map((c) => c.slug));
  if (!categorySlug || !allowed.has(categorySlug)) {
    fieldErrors.categorySlug = "Pick a valid category.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: "Please fix the highlighted fields.", fieldErrors };
  }

  let imagePath: string;
  try {
    imagePath = await persistUploadedImage(imageFile as File);
  } catch {
    return { ok: false, error: "Could not upload image. Try again." };
  }

  const payload: Omit<Product, "id"> = {
    name,
    brand,
    categorySlug,
    price,
    quantity,
    rate,
    img: imagePath,
    logo,
    Description,
  };

  try {
    addProduct(payload);
  } catch {
    return { ok: false, error: "Could not save the product. Try again." };
  }

  revalidatePath("/admin/products");
  revalidatePath("/admin");
  revalidatePath("/admin/categories");
  revalidatePath("/products");
  revalidatePath("/");
  revalidatePath("/sitemap.xml");

  return { ok: true };
}
