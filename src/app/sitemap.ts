import type { MetadataRoute } from "next"
import { getAllSlugs } from "./(shop)/blog/[slug]/data"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.phytoflexgold.com"

const PRODUCT_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuDTqOpEHSIZVvw5PCnvpXM_uNUFC7Guyvy31zsWX8sGFPNRcoNPEEIgqTuR8o04qMKmaHa2JsVfKqVkBw1TMgr4IoyeD0ab8CZrclCE8VGMjlrZCnzElfqCxf9ZGkCkPpAhUsoH6sNdcc6WAnSNwtJXciqzOoIJ74KJ_2zKI9sQPzSGMuJ5t3mZIdoszGUQwEnzKl_YeeysAjWodwXmh9mlIpmcILW4PJHSufeA10SVVVZlI75W0cmF1DxqXo4a4uUXQ5zW-rPn4jkBpg"

export default function sitemap(): MetadataRoute.Sitemap {
  const blogSlugs = getAllSlugs()

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      images: [PRODUCT_IMAGE],
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/disclaimer`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/shipping`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/returns`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ]

  const blogPages: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${siteUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  return [...staticPages, ...blogPages]
}
