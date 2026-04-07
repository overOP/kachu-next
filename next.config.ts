import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '5.imimg.com' },
      { protocol: 'https', hostname: 'tse1.mm.bing.net' },
      { protocol: 'https', hostname: 'kraftnaturalcheese.com' },
      { protocol: 'https', hostname: 'caffeinecam.com' },
      { protocol: 'https', hostname: 'www.pizzaboxbanksiagrove.com.au' },
      { protocol: 'https', hostname: 'i5.walmartimages.com' },
      { protocol: 'https', hostname: 'pbs.twimg.com' },
      { protocol: 'https', hostname: 'propack.pro' },
      { protocol: 'https', hostname: 'i.pinimg.com' },
      { protocol: 'https', hostname: 'logos-world.net' },
      { protocol: 'https', hostname: '1000logos.net' },
      { protocol: 'https', hostname: 'logoeps.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
};

export default nextConfig;
