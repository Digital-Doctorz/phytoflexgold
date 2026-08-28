import type { Metadata } from "next"
import { SITE_URL, buildFAQSchema, buildBreadcrumbSchema } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Shipping Policy | PhytoFlex Gold",
  description:
    "Learn about PhytoFlex Gold shipping options, delivery times, and return policy. Free shipping on orders above Rs. 2,000 across India.",
  alternates: {
    canonical: `${SITE_URL}/shipping`,
  },
  openGraph: {
    title: "Shipping Policy | PhytoFlex Gold",
    description:
      "Shipping options, delivery times, and return policy for PhytoFlex Gold.",
    url: `${SITE_URL}/shipping`,
    type: "website",
    images: [
      {
        url: `${SITE_URL}/og-image.svg`,
        width: 1200,
        height: 630,
        alt: "PhytoFlex Gold Shipping Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shipping Policy | PhytoFlex Gold",
    description: "Shipping options, delivery times, and return policy for PhytoFlex Gold.",
    images: [`${SITE_URL}/og-image.svg`],
  },
}

const faqs = [
  {
    question: "How long does shipping take?",
    answer:
      "Standard shipping takes 5–7 business days across India. Metro cities (Delhi, Mumbai, Bangalore, Chennai, Kolkata) typically receive orders within 3–5 business days. Remote areas may take 7–10 business days.",
  },
  {
    question: "Is there free shipping?",
    answer:
      "Yes. Orders above Rs. 2,000 qualify for free standard shipping across India. Orders below Rs. 2,000 incur a flat shipping fee of Rs. 99.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Currently, we ship only within India. We are working on expanding to international markets. Contact us for specific inquiries about international shipping.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order ships, you will receive an email and SMS with a tracking number. You can track your order through our shipping partner's website or app.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day satisfaction guarantee offered by Liquid Health by Trade Me India. If you are not satisfied with your purchase, you may return unopened products within 30 days of delivery for a full refund. Contact us at support@phytoflexgold.com or call +91 9555 9555 95 to initiate a return. See our full Return & Refund Policy at /returns.",
  },
  {
    question: "What if my order arrives damaged?",
    answer:
      "If your order arrives damaged, please contact us within 48 hours of delivery with photos of the damage. We will arrange a replacement or full refund at no extra cost.",
  },
]

export default function ShippingPage() {
  return (
    <main className="bg-background min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFAQSchema(faqs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildBreadcrumbSchema([
              { name: "Home", url: SITE_URL },
              { name: "Shipping", url: `${SITE_URL}/shipping` },
            ])
          ),
        }}
      />
      <section className="max-w-3xl mx-auto px-margin-mobile md:px-gutter-md py-20">
        <h1 className="text-headline-lg font-bold text-on-surface mb-4">
          Shipping &amp; Delivery
        </h1>
        <p className="text-body-lg text-on-surface-variant mb-12">
          Fast, reliable delivery across India with free shipping on orders
          above Rs. 2,000.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
          <div className="bg-surface-container rounded-2xl p-6 flex gap-4">
            <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" /><path d="M15 18H9" /><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" /><circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" /></svg>
            </div>
            <div>
              <h2 className="text-title-md font-bold text-on-surface mb-1">
                Free Shipping
              </h2>
              <p className="text-body-md text-on-surface-variant">
                On all orders above Rs. 2,000 across India
              </p>
            </div>
          </div>

          <div className="bg-surface-container rounded-2xl p-6 flex gap-4">
            <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            </div>
            <div>
              <h2 className="text-title-md font-bold text-on-surface mb-1">
                Fast Delivery
              </h2>
              <p className="text-body-md text-on-surface-variant">
                3–7 business days depending on location
              </p>
            </div>
          </div>

          <div className="bg-surface-container rounded-2xl p-6 flex gap-4">
            <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
            </div>
            <div>
              <h2 className="text-title-md font-bold text-on-surface mb-1">
                30-Day Returns
              </h2>
              <p className="text-body-md text-on-surface-variant">
                Satisfaction guarantee on unopened products
              </p>
            </div>
          </div>

          <div className="bg-surface-container rounded-2xl p-6 flex gap-4">
            <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></svg>
            </div>
            <div>
              <h2 className="text-title-md font-bold text-on-surface mb-1">
                Secure Packaging
              </h2>
              <p className="text-body-md text-on-surface-variant">
                Tamper-proof, temperature-controlled shipping
              </p>
            </div>
          </div>
        </div>

        <section className="mb-16">
          <h2 className="text-title-lg font-bold text-on-surface mb-6">
            Shipping Options
          </h2>
          <div className="overflow-x-auto">
            <table
              className="w-full text-left border-collapse"
              role="table"
            >
              <caption className="sr-only">
                Shipping options and delivery times
              </caption>
              <thead>
                <tr className="border-b border-outline-variant/20">
                  <th scope="col" className="py-3 px-4 text-label-md text-on-surface-variant">
                    Method
                  </th>
                  <th scope="col" className="py-3 px-4 text-label-md text-on-surface-variant">
                    Cost
                  </th>
                  <th scope="col" className="py-3 px-4 text-label-md text-on-surface-variant">
                    Delivery Time
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-outline-variant/10">
                  <td className="py-3 px-4 text-body-md text-on-surface">Standard Shipping</td>
                  <td className="py-3 px-4 text-body-md text-on-surface">Rs. 99 (Free above Rs. 2,000)</td>
                  <td className="py-3 px-4 text-body-md text-on-surface">5–7 business days</td>
                </tr>
                <tr className="border-b border-outline-variant/10">
                  <td className="py-3 px-4 text-body-md text-on-surface">Express Shipping</td>
                  <td className="py-3 px-4 text-body-md text-on-surface">Rs. 199</td>
                  <td className="py-3 px-4 text-body-md text-on-surface">2–3 business days</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-body-md text-on-surface">Metro Same-Day</td>
                  <td className="py-3 px-4 text-body-md text-on-surface">Rs. 349</td>
                  <td className="py-3 px-4 text-body-md text-on-surface">Same day (metro cities only)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-title-lg font-bold text-on-surface mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="bg-surface-container rounded-xl overflow-hidden group"
              >
                <summary className="px-6 py-4 cursor-pointer text-title-sm font-bold text-on-surface list-none flex items-center justify-between">
                  {faq.question}
                  <span className="text-on-surface-variant group-open:rotate-180 transition-transform" aria-hidden="true">
                    ▼
                  </span>
                </summary>
                <div className="px-6 pb-4">
                  <p className="text-body-md text-on-surface-variant">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </section>
      </section>
    </main>
  )
}
