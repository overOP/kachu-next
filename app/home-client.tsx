"use client";

import dynamic from "next/dynamic";
import { useLenis } from "@/lib/hooks/use-lenis";
import SiteShell from "@/components/layout/SiteShell";
import AboutSection from "@/components/AboutSection";
import ProductsSection from "@/components/ProductsSection";
import Footer from "@/components/Footer";
import type { Product } from "@/lib/data/products";

const HeroSlider = dynamic(() => import("@/components/HeroSlider"), {
  loading: () => <SectionSkeleton className="h-[520px] sm:h-[640px]" />,
});

const OwnerMessage = dynamic(() => import("@/components/OwnerMessage"), {
  loading: () => <SectionSkeleton className="h-[300px]" />,
});

const ChooseUs = dynamic(() => import("@/components/ChooseUs"), {
  loading: () => <SectionSkeleton className="h-[280px]" />,
});

function SectionSkeleton({ className }: { className: string }) {
  return (
    <div
      className={`w-full animate-pulse rounded-3xl bg-emerald-100/80 dark:bg-zinc-800/80 ${className}`}
      aria-hidden
    />
  );
}

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
