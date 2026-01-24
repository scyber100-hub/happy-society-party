import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['tzhkmnkhqdbskwcpvhqx.supabase.co'],
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
