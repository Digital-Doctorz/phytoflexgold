import type { MetadataRoute } from "next"
import { SITE_URL, PRODUCT_IMAGE_URL } from "@/lib/seo"
import { getAllSlugs, getPost } from "./(shop)/blog/[slug]/data"

const siteUrl = SITE_URL

export default function sitemap(): MetadataRoute.Sitemap {
  const blogSlugs = getAllSlugs()

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      images: [PRODUCT_IMAGE_URL],
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

  const blogPages: MetadataRoute.Sitemap = blogSlugs.map((slug) => {
    const post = getPost(slug)
    return {
      url: `${siteUrl}/blog/${slug}`,
      lastModified: post ? new Date(post.date) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
      images: [PRODUCT_IMAGE_URL],
    }
  })

  return [...staticPages, ...blogPages]
}
