import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_BACKEND_URL: 'http://localhost:5000',
  },
  output: 'standalone',
};

export default nextConfig;
