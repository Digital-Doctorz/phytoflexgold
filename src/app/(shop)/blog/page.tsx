import Link from "next/link"
import type { Metadata } from "next"
import { SITE_URL, buildBreadcrumbSchema, buildArticleSchema } from "@/lib/seo"
import { posts as allPosts } from "./[slug]/data"

export const metadata: Metadata = {
  title: "Blog | PhytoFlex Gold",
  description:
    "Expert articles on joint health, botanical supplements, turmeric benefits, and natural wellness protocols from PhytoFlex Gold.",
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: "Blog | PhytoFlex Gold",
    description: "Expert articles on joint health, botanical supplements, and natural wellness protocols.",
    url: `${SITE_URL}/blog`,
    type: "website",
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "PhytoFlex Gold Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | PhytoFlex Gold",
    description: "Expert articles on joint health, botanical supplements, and natural wellness protocols.",
    images: [`${SITE_URL}/opengraph-image`],
  },
}

const posts = Object.values(allPosts).map((post) => ({
  slug: post.slug,
  title: post.title,
  excerpt: post.description,
  date: post.date,
  readTime: post.readTime,
  category: post.category,
}))

export default function BlogIndex() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Blog", url: `${SITE_URL}/blog` },
  ])
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "PhytoFlex Gold Blog",
    description:
      "Evidence-based articles on joint health, botanical supplements, and natural wellness protocols.",
    url: `${SITE_URL}/blog`,
    inLanguage: "en-US",
    publisher: { "@id": `${SITE_URL}/#organization` },
    blogPost: posts.map((post) => {
      const postData = allPosts[post.slug]
      return buildArticleSchema({
        title: post.title,
        description: post.excerpt,
        datePublished: post.date,
        slug: post.slug,
        category: post.category,
      })
    }),
  }

  return (
    <main className="bg-background min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <section className="max-w-4xl mx-auto px-margin-mobile md:px-gutter-md py-20">
        <header className="mb-12">
          <h1 className="text-headline-lg font-bold text-on-surface mb-4">
            PhytoFlex Gold Blog
          </h1>
          <p className="text-body-lg text-on-surface-variant max-w-2xl">
            Evidence-based articles on joint health, botanical supplements,
            and natural wellness protocols.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="bg-surface-container rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-primary-container text-on-primary-container text-label-sm px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-body-sm text-on-surface-variant">
                    {post.readTime}
                  </span>
                </div>
                <h2 className="text-title-lg font-bold text-on-surface mb-3">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover:text-primary transition-colors"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="text-body-md text-on-surface-variant mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <time
                    dateTime={new Date(post.date).toISOString().slice(0, 10)}
                    className="text-body-sm text-on-surface-variant"
                  >
                    {post.date}
                  </time>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-primary text-body-md font-bold hover:underline"
                    aria-label={`Read ${post.title}`}
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 bg-surface-container-low rounded-2xl p-8 text-center">
          <h2 className="text-title-lg font-bold text-on-surface mb-3">
            Stay Updated
          </h2>
          <p className="text-body-md text-on-surface-variant mb-6">
            Get the latest research on joint health and botanical supplements
            delivered to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" action="#" method="POST">
            <input
              type="email"
              name="email"
              required
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-full bg-surface border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Email address for newsletter"
            />
            <button
              type="submit"
              className="bg-primary-container text-on-primary-container px-6 py-3 rounded-full font-bold transition-all active:scale-95"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}
