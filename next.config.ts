import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  allowedDevOrigins: ["192.168.0.196", "localhost"],
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
}

export default nextConfig
