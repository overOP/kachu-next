import type { Metadata } from "next";
import SiteShell from "@/components/layout/SiteShell";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get help with orders, wholesale support, deliveries, and payments — or reach the Kachu Kart team directly.",
};
import PageHero from "@/components/layout/PageHero";
import ContactSections from "@/components/contact/ContactSections";
import Footer from "@/components/Footer";

export default function ContactPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Support & Help"
        title="Contact Us & Frequently Asked Questions"
        description="Find quick answers for orders, wholesale support, deliveries, and payments. If you still need help, contact our team directly and we will respond fast."
        descriptionMaxWidth="3xl"
      />
      <ContactSections />
      <Footer />
    </SiteShell>
  );
}
