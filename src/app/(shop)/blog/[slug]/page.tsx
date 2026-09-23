import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getPost, getAllSlugs } from "./data"
import { SITE_URL, buildArticleSchema, buildBreadcrumbSchema } from "@/lib/seo"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}

  return {
    title: `${post.title} | PhytoFlex Gold Blog`,
    description: post.description,
    alternates: {
      canonical: `${SITE_URL}/blog/${post.slug}`,
    },
      openGraph: {
      title: post.title,
      description: post.description,
      url: `${SITE_URL}/blog/${post.slug}`,
      type: "article",
      publishedTime: new Date(post.date).toISOString(),
      authors: ["PhytoFlex Gold"],
      tags: [post.category, "joint health", "supplements"],
      images: [
        {
          url: `${SITE_URL}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [`${SITE_URL}/opengraph-image`],
    },
  }
}

export default async function BlogArticle({ params }: Props) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const paragraphs = post.content
    .split("\n\n")
    .filter((p) => p.trim())

  return (
    <main className="bg-background min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildArticleSchema({
              title: post.title,
              description: post.description,
              datePublished: post.date,
              slug: post.slug,
              category: post.category,
            })
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildBreadcrumbSchema([
              { name: "Home", url: SITE_URL },
              { name: "Blog", url: `${SITE_URL}/blog` },
              { name: post.title, url: `${SITE_URL}/blog/${post.slug}` },
            ])
          ),
        }}
      />

      <article className="max-w-3xl mx-auto px-margin-mobile md:px-gutter-md py-20">
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-body-sm text-on-surface-variant">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href="/blog"
                className="hover:text-primary transition-colors"
              >
                Blog
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-on-surface" aria-current="page">
              {post.title}
            </li>
          </ol>
        </nav>

        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-primary-container text-on-primary-container text-label-sm px-3 py-1 rounded-full">
              {post.category}
            </span>
            <time
              dateTime={new Date(post.date).toISOString().slice(0, 10)}
              className="text-body-sm text-on-surface-variant"
            >
              {post.date}
            </time>
            <span className="text-body-sm text-on-surface-variant">
              · {post.readTime}
            </span>
          </div>
          <h1 className="text-headline-lg font-bold text-on-surface mb-4">
            {post.title}
          </h1>
          <p className="text-body-lg text-on-surface-variant">
            {post.description}
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
          {paragraphs.map((paragraph, i) => {
            if (paragraph.startsWith("## ")) {
              return (
                <h2
                  key={i}
                  className="text-title-xl font-bold text-on-surface mt-12 mb-4"
                >
                  {paragraph.replace("## ", "")}
                </h2>
              )
            }
            if (paragraph.startsWith("### ")) {
              return (
                <h3
                  key={i}
                  className="text-title-lg font-bold text-on-surface mt-8 mb-3"
                >
                  {paragraph.replace("### ", "")}
                </h3>
              )
            }
            if (paragraph.startsWith("- ")) {
              const items = paragraph.split("\n").filter((l) => l.startsWith("- "))
              return (
                <ul
                  key={i}
                  className="list-disc pl-6 space-y-2 text-body-md text-on-surface-variant my-4"
                >
                  {items.map((item, j) => (
                    <li key={j}>{item.replace("- ", "").replace(/\*\*/g, "")}</li>
                  ))}
                </ul>
              )
            }
            if (paragraph.startsWith("|")) {
              const lines = paragraph
                .split("\n")
                .map((l) => l.trim())
                .filter((l) => l.startsWith("|"))
              const dataRows = lines.filter((l) => !/^[\s|:-]+$/.test(l))
              const toCells = (line: string) =>
                line
                  .replace(/^\|/, "")
                  .replace(/\|$/, "")
                  .split("|")
                  .map((c) => c.trim())
              const [header, ...body] = dataRows
              if (!header) return null
              return (
                <div key={i} className="overflow-x-auto my-6 -mx-margin-mobile px-margin-mobile">
                  <table className="w-full text-body-sm sm:text-body-md border-collapse min-w-[400px]">
                    <thead>
                      <tr className="border-b border-outline-variant/30">
                        {toCells(header).map((h, hi) => (
                          <th
                            key={hi}
                            scope="col"
                            className="py-3 pr-4 text-left font-bold text-on-surface"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {body.map((r, ri) => (
                        <tr key={ri} className="border-b border-outline-variant/10">
                          {toCells(r).map((c, ci) => (
                            <td key={ci} className="py-3 pr-4 text-on-surface-variant">
                              {c}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            }
            if (paragraph.startsWith("---")) {
              return (
                <hr
                  key={i}
                  className="my-12 border-outline-variant/20"
                  aria-hidden="true"
                />
              )
            }
            if (paragraph.startsWith("*") && paragraph.endsWith("*")) {
              return (
                <p
                  key={i}
                  className="text-body-sm text-on-surface-variant italic mt-8"
                >
                  {paragraph.replace(/\*/g, "")}
                </p>
              )
            }
            return (
              <p
                key={i}
                className="text-body-md text-on-surface-variant my-4 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: paragraph
                    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                    .replace(/\*(.*?)\*/g, "<em>$1</em>")
                    .replace(/\n/g, "<br />"),
                }}
              />
            )
          })}
        </div>

        <footer className="mt-16 pt-8 border-t border-outline-variant/20">
          <Link
            href="/blog"
            className="text-primary font-bold hover:underline"
          >
            ← Back to Blog
          </Link>
        </footer>
      </article>
    </main>
  )
}
