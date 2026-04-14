"use server";

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
} as const;

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
  const img = trim(formData, "img");
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
  if (!isHttpsUrl(img)) {
    fieldErrors.img = "Image must be a valid https:// URL.";
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

  const payload: Omit<Product, "id"> = {
    name,
    brand,
    categorySlug,
    price,
    quantity,
    rate,
    img,
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
