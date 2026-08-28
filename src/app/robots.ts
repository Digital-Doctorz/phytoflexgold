import type { MetadataRoute } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.phytoflexgold.com"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        disallow: ["/admin", "/api", "/auth", "/checkout", "/order-confirmation"],
      },
      {
        userAgent: ["GPTBot", "ChatGPT-User", "ClaudeBot", "anthropic-ai", "PerplexityBot", "cohere-ai", "meta-externalagent", "Omgilibot"],
        allow: ["/", "/llms.txt"],
      },
      {
        userAgent: ["Google-Extended", "Bingbot", "Applebot"],
        allow: "/",
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
