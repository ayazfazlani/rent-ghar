import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/:path*', // ← yahan apna NestJS port daal dena (development mein)
        // production mein: process.env.NEXT_PUBLIC_API_URL + '/:path*'
      },
    ];
  },
};

export default nextConfig;
