import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
