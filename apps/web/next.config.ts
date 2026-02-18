import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'ptcptourism.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'english.news.cn',
      },
      {
        protocol: 'https',
        hostname: 'popertydealer.pk',
      }
    ],
  },
  async rewrites() {
    // Only rewrite if NEXT_PUBLIC_API_URL is explicitly set
    // Otherwise, use relative paths (same domain) - no rewriting needed
    if (!process.env.NEXT_PUBLIC_API_URL) {
      return [];
    }
    
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    
    return [
      {
        source: '/api/:path*',
        destination: `${baseUrl}/api/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${baseUrl}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
