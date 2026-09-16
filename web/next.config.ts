import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow Playwright to connect to HMR
  serverExternalPackages: [],
  // @ts-ignore - this config exists in newer nextjs versions
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
};

export default nextConfig;
