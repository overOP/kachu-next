import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  turbopack: {
    root: currentDir,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "5.imimg.com" },
      { protocol: "https", hostname: "tse1.mm.bing.net" },
      { protocol: "https", hostname: "kraftnaturalcheese.com" },
      { protocol: "https", hostname: "caffeinecam.com" },
      { protocol: "https", hostname: "www.pizzaboxbanksiagrove.com.au" },
      { protocol: "https", hostname: "i5.walmartimages.com" },
      { protocol: "https", hostname: "pbs.twimg.com" },
      { protocol: "https", hostname: "propack.pro" },
      { protocol: "https", hostname: "i.pinimg.com" },
      { protocol: "https", hostname: "logos-world.net" },
      { protocol: "https", hostname: "1000logos.net" },
      { protocol: "https", hostname: "logoeps.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;