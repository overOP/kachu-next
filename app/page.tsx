export const dynamic = "force-dynamic";

import HomePageClient from "./home-client";
import { fetchProducts } from "@/lib/services/products";

export default async function Home() {
  const products = await fetchProducts();
  return <HomePageClient initialProducts={products} />;
}
