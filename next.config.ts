import path from "path";
import type { NextConfig } from "next";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

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
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
webpack: (config) => {
    if (process.env.ANALYZE) {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          openAnalyzer: true,
        })
      );
    }
    return config;
  },
};

export default nextConfig;
