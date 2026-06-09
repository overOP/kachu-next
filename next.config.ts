import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

function siteImagePatterns(): { protocol: "http" | "https"; hostname: string; port?: string; pathname: string }[] {
  const patterns: { protocol: "http" | "https"; hostname: string; port?: string; pathname: string }[] = [
    { protocol: "http", hostname: "localhost", port: "3000", pathname: "/uploads/**" },
    { protocol: "https", hostname: "localhost", port: "3000", pathname: "/uploads/**" },
  ];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (siteUrl) {
    try {
      const parsed = new URL(siteUrl);
      patterns.push({
        protocol: parsed.protocol.replace(":", "") as "http" | "https",
        hostname: parsed.hostname,
        ...(parsed.port ? { port: parsed.port } : {}),
        pathname: "/uploads/**",
      });
    } catch {
      // ignore invalid site URL
    }
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (apiUrl) {
    try {
      const parsed = new URL(apiUrl);
      patterns.push({
        protocol: parsed.protocol.replace(":", "") as "http" | "https",
        hostname: parsed.hostname,
        ...(parsed.port ? { port: parsed.port } : {}),
        pathname: "/**",
      });
    } catch {
      // ignore invalid API URL
    }
  }

  return patterns;
}

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
      ...siteImagePatterns(),
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