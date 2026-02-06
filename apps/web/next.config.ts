import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
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
