import type { Metadata } from "next";
import "./globals.css";
import Providers from "./components/Providers";
import React from "react";

export const metadata: Metadata = {
  title: "Kart — Wholesale Marketplace",
  description:
    "Your one-stop wholesale marketplace connecting factories to buyers worldwide.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
