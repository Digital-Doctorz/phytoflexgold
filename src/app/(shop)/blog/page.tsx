import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog | PhytoFlex Gold",
  description:
    "Expert articles on joint health, botanical supplements, turmeric benefits, and natural wellness protocols from PhytoFlex Gold.",
}

const posts = [
  {
    slug: "turmeric-curcumin-joint-health",
    title: "Turmeric & Curcumin: What the Science Says About Joint Health",
    excerpt:
      "Curcumin, the active compound in turmeric, has been studied extensively for its anti-inflammatory effects. Here's what 50+ clinical trials reveal about joint health.",
    date: "January 15, 2024",
    readTime: "8 min read",
    category: "Ingredients",
  },
  {
    slug: "boswellia-serrata-inflammation",
    title: "Boswellia Serrata: India's Ancient Anti-Inflammatory Secret",
    excerpt:
      "For centuries, Boswellia has been used in Ayurvedic medicine. Modern research now confirms its powerful effects on joint comfort and mobility.",
    date: "January 8, 2024",
    readTime: "6 min read",
    category: "Ingredients",
  },
  {
    slug: "liquid-supplements-absorption",
    title: "Liquid vs Capsule Supplements: Why Absorption Matters",
    excerpt:
      "Studies show liquid supplements can have up to 98% bioavailability compared to just 20-40% for capsules. Learn why delivery format matters for joint health.",
    date: "December 28, 2023",
    readTime: "5 min read",
    category: "Science",
  },
  {
    slug: "joint-health-exercise-recovery",
    title: "Joint Health & Exercise Recovery: A Complete Guide",
    excerpt:
      "Proper joint nutrition and recovery protocols can reduce exercise-related joint discomfort by up to 60%. Here's how to protect your joints during training.",
    date: "December 20, 2023",
    readTime: "10 min read",
    category: "Wellness",
  },
]

export default function BlogIndex() {
  return (
    <main className="bg-background min-h-screen">
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
                    dateTime={post.date}
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
