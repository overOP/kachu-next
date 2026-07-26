import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import StoreProvider from "@/components/providers/StoreProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { getSiteUrl } from "@/lib/config/site-url";

const siteUrl = getSiteUrl();

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
  verification: {
    google: "wNbG28M2MsgM1dgzbMlBkh5wfqcwiiC59mgEwgyWUA4",
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
