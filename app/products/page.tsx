export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Footer from "@/components/Footer";
import PageHero from "@/components/layout/PageHero";
import SiteShell from "@/components/layout/SiteShell";
import ProductsSection from "@/components/ProductsSection";
import { fetchProductCategories, fetchProducts } from "@/lib/services/products";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse the Kachu Kart catalog — pricing, MOQs, and quick WhatsApp ordering on every product.",
};

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    fetchProducts(),
    fetchProductCategories(),
  ]);

  return (
    <SiteShell>
      <PageHero
        eyebrow="Catalog"
        title="Explore All Products"
        description="Browse our curated products and open any item to view details, pricing, and order directly on WhatsApp."
        descriptionMaxWidth="2xl"
      />
      <ProductsSection products={products} categories={categories} />
      <Footer />
    </SiteShell>
  );
}
