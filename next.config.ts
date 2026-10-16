import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  poweredByHeader: false,
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
  async redirects() {
    return [
      // P1 (WEBARCHITECT-PFG-P1-VERCEL-HOST-308-2026-10-06): duplicate vercel.app host -> www, 308.
      // Host-scoped, so preview deployments (phytoflexgold-git-*.vercel.app) are unaffected. Must stay FIRST.
      {
        source: "/:path*",
        has: [{ type: "host", value: "phytoflexgold.vercel.app" }],
        destination: "https://www.phytoflexgold.com/:path*",
        permanent: true,
      },
      // P2 REV1 (WEBARCHITECT-PFG-P2-LEGACY-REDIRECT-MAP-REV1-2026-10-06): legacy Shopify URLs, 28 rules, 301.
      // Order matters: specific sources before wildcards. statusCode 301 (permanent: true would emit 308).
      { source: "/home", destination: "/", statusCode: 301 },
      { source: "/pricing", destination: "/#pricing", statusCode: 301 },
      { source: "/products", destination: "/#pricing", statusCode: 301 },
      { source: "/products/phytoflex-gold", destination: "/#pricing", statusCode: 301 },
      { source: "/products/phytoflex-gold-joint-pain-relief", destination: "/#pricing", statusCode: 301 },
      { source: "/products/12-weeks-9-bottles", destination: "/#pricing", statusCode: 301 },
      { source: "/products/8-weeks-course-6-bottles", destination: "/#pricing", statusCode: 301 },
      { source: "/products/:path*", destination: "/#pricing", statusCode: 301 },
      { source: "/collections/all", destination: "/#pricing", statusCode: 301 },
      { source: "/collections/:path*", destination: "/#pricing", statusCode: 301 },
      { source: "/cart", destination: "/#pricing", statusCode: 301 },
      { source: "/blogs", destination: "/blog", statusCode: 301 },
      { source: "/blogs/news", destination: "/blog", statusCode: 301 },
      { source: "/blogs/herbal-remedies", destination: "/blog", statusCode: 301 },
      { source: "/blogs/herbal-remedies/phytoflex-gold-the-doctor-recommended-joint-care-solution-for-lasting-relief", destination: "/blog", statusCode: 301 },
      { source: "/blogs/herbal-remedies/best-supplements-for-pain-and-inflammation", destination: "/blog", statusCode: 301 },
      { source: "/blogs/herbal-remedies/understanding-joint-pain-and-natural-solutions", destination: "/blog", statusCode: 301 },
      { source: "/blogs/herbal-remedies/top-10-herbs-arthritis-relief", destination: "/blog", statusCode: 301 },
      { source: "/blogs/herbal-remedies/the-power-of-anti-inflammatory-diets-how-phytoflex-gold-by-liquid-health-can-transform-your-joint-health", destination: "/blog", statusCode: 301 },
      { source: "/blogs/:path*", destination: "/blog", statusCode: 301 },
      { source: "/herbs-for-arthritis", destination: "/blog", statusCode: 301 },
      { source: "/fight-arthritis-naturally", destination: "/blog", statusCode: 301 },
      { source: "/living-with-arthritis-can-joint-pain-be-cured", destination: "/blog", statusCode: 301 },
      { source: "/pages/sitemap", destination: "/", statusCode: 301 },
      { source: "/pages/referral-program", destination: "/", statusCode: 301 },
      { source: "/policies/terms-of-service", destination: "/terms", statusCode: 301 },
      { source: "/policies/privacy-policy", destination: "/privacy", statusCode: 301 },
      { source: "/policies/shipping-policy", destination: "/shipping", statusCode: 301 },
      { source: "/policies/refund-policy", destination: "/returns", statusCode: 301 },
    ]
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
}

export default nextConfig
