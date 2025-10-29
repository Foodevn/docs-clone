import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',

  // Disable telemetry
  experimental: {
    serverComponentsExternalPackages: ['bcryptjs'],
  },

  /* config options here */
  // Thêm dòng này:

};

export default nextConfig;