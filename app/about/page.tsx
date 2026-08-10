import type { Metadata } from "next";
import SiteShell from "@/components/layout/SiteShell";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn how Kachu Kart connects buyers with trusted manufacturers and dependable wholesale sourcing.",
};
import PageHero from "@/components/layout/PageHero";
import AboutSection from "@/components/AboutSection";
import ChooseUs from "@/components/ChooseUs";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="About Kachu Kart"
        title="Built for Smarter Wholesale Shopping"
        description="Learn who we are, how we connect buyers with trusted manufacturers, and why businesses rely on Kachu Kart for fast, dependable product sourcing."
        descriptionMaxWidth="3xl"
      />
      <AboutSection />
      <ChooseUs />
      <Footer />
    </SiteShell>
  );
}
