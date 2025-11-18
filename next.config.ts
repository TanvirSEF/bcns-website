import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations
  reactStrictMode: true,
  // swcMinify is deprecated in Next.js 15 - SWC is the default

  // Image optimization
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [75, 80, 85],
    unoptimized: false,
    loader: 'default',
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-b70aa615746044f6b05ea7197ee82be3.r2.dev",
        port: "",
        pathname: "/**",
      },
    ],
  },

  // Compression
  compress: true,

  // Experimental features for better performance
  experimental: {
    // optimizeCss: true, // Disabled - causing critters module error in Next.js 15
    scrollRestoration: true,
  },

  // Bundle analyzer - uncomment when needed
  // bundleAnalyzer: {
  //   enabled: process.env.ANALYZE === 'true',
  // },
};

export default nextConfig;
