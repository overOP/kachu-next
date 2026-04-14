import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import StoreProvider from "@/components/providers/StoreProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Kachu Kart — Wholesale Marketplace",
    template: "%s · Kachu Kart",
  },
  description:
    "Your one-stop wholesale marketplace connecting factories to buyers worldwide.",
  openGraph: {
    type: "website",
    locale: "en",
    siteName: "Kachu Kart",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased transition-colors duration-200">
        <ThemeProvider>
          <StoreProvider>{children}</StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
