import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/:path*', // ← yahan apna NestJS port daal dena (development mein)
        // production mein: process.env.NEXT_PUBLIC_API_URL + '/:path*'
      },
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:3001/uploads/:path*', // Proxy uploads to API server
      },
    ];
  },
};

export default nextConfig;
