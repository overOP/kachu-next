import type { MetadataRoute } from "next";
import { fetchProducts } from "@/lib/services/products";
import { getSiteUrl } from "@/lib/config/site-url";

const base = getSiteUrl();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allProducts = await fetchProducts();
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/products",
    "/about",
    "/contact",
    "/login",
    "/signup",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = allProducts.map((p) => ({
    url: `${base}/product/${p.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes];
}
