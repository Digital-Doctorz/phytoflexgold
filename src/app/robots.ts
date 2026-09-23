import type { MetadataRoute } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.phytoflexgold.com"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/auth", "/checkout", "/order-confirmation"],
      },
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "OAI-SearchBot",
          "ClaudeBot",
          "anthropic-ai",
          "PerplexityBot",
          "cohere-ai",
          "meta-externalagent",
          "meta-externalfetcher",
          "Google-Extended",
          "Applebot-Extended",
          "Amazonbot",
          "Bytespider",
          "CCBot",
          "YouBot",
          "DuckAssistBot",
          "Omgilibot",
        ],
        allow: "/",
        disallow: ["/admin", "/api", "/auth", "/checkout", "/order-confirmation"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
