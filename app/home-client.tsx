"use client";

import { useLenis } from "@/lib/hooks/use-lenis";
import SiteShell from "@/components/layout/SiteShell";
import HeroSlider from "@/components/HeroSlider";
import AboutSection from "@/components/AboutSection";
import ProductsSection from "@/components/ProductsSection";
import Footer from "@/components/Footer";
import ChooseUs from "@/components/ChooseUs";
import OwnerMessage from "@/components/OwnerMessage";
import type { Product } from "@/lib/data/products";

export default function HomePageClient({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  useLenis();

  return (
    <SiteShell>
      <HeroSlider />
      <ProductsSection products={initialProducts} />
      <AboutSection />
      <OwnerMessage />
      <ChooseUs />
      <Footer />
    </SiteShell>
  );
}
